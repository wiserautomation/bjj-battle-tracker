
import { Button } from "@/components/ui/button";
import { School, User } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bjj-navy to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Welcome to PLAY BJJ</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your Brazilian Jiu-Jitsu journey, join challenges, and improve your skills with AI-powered insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 rounded-lg p-8 text-center hover:bg-white/15 transition-all">
            <School className="w-16 h-16 mx-auto mb-4 text-bjj-gold" />
            <h2 className="text-2xl font-bold mb-4">School Account</h2>
            <p className="text-gray-300 mb-6">
              Create and manage challenges, track student progress, and build your BJJ community.
            </p>
            <Link to="/auth?type=school">
              <Button size="lg" className="bg-bjj-gold text-bjj-navy hover:bg-bjj-gold/90">
                Create School Account
              </Button>
            </Link>
          </div>

          <div className="bg-white/10 rounded-lg p-8 text-center hover:bg-white/15 transition-all">
            <User className="w-16 h-16 mx-auto mb-4 text-bjj-blue" />
            <h2 className="text-2xl font-bold mb-4">Athlete Account</h2>
            <p className="text-gray-300 mb-6">
              Join challenges, track your progress, and get AI-powered insights to improve your game.
            </p>
            <Link to="/auth?type=athlete">
              <Button size="lg" className="bg-bjj-blue text-white hover:bg-bjj-blue/90">
                Create Athlete Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose PLAY BJJ?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <h4 className="text-xl font-bold mb-3 text-bjj-gold">Track Progress</h4>
              <p className="text-gray-300">Monitor your journey with detailed statistics and achievements.</p>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-3 text-bjj-gold">AI Insights</h4>
              <p className="text-gray-300">Get personalized recommendations and analysis of your performance.</p>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-3 text-bjj-gold">Community</h4>
              <p className="text-gray-300">Connect with your school and participate in challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
