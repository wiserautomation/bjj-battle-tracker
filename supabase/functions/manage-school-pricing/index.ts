
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    switch (action) {
      case 'update_pricing_config': {
        const { min_price, max_price, commission_rate, commission_threshold } = data;
        const { error } = await supabase
          .from('pricing_config')
          .update({
            min_price,
            max_price,
            commission_rate,
            commission_threshold,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_pricing_config': {
        const { data: config, error } = await supabase
          .from('pricing_config')
          .select('*')
          .single();

        if (error) throw error;
        return new Response(JSON.stringify(config), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'create_subscription': {
        const { schoolId, pricePerStudent } = data;
        
        // Get current pricing config
        const { data: config } = await supabase
          .from('pricing_config')
          .select('*')
          .single();
        
        if (!config) throw new Error('Pricing configuration not found');
        
        // Calculate commission
        const commission = pricePerStudent >= config.commission_threshold 
          ? Math.floor((pricePerStudent * config.commission_rate) / 100)
          : 0;

        // Create or get Stripe customer
        const { data: { user } } = await supabase.auth.admin.getUserById(schoolId);
        if (!user?.email) throw new Error('User email not found');

        let customerId;
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await stripe.customers.create({ email: user.email });
          customerId = customer.id;
        }

        // Create Stripe subscription
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: pricePerStudent,
                product_data: {
                  name: 'School Subscription',
                  description: `Per student pricing at $${(pricePerStudent / 100).toFixed(2)}/month`,
                },
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${req.headers.get('origin')}/school-dashboard`,
          cancel_url: `${req.headers.get('origin')}/school-dashboard`,
        });

        // Record subscription attempt
        await supabase.from('school_subscriptions').insert({
          school_id: schoolId,
          stripe_customer_id: customerId,
          price_per_student: pricePerStudent,
          commission_rate: config.commission_rate,
          commission_amount: commission,
          status: 'pending',
        });

        return new Response(JSON.stringify({ url: session.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
