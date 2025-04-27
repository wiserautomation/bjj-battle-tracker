
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AthleteRequest {
  id: string;
  name: string;
  belt: string;
  stripes: number;
  profilePicture: string;
}

interface JoinRequestsProps {
  requests: AthleteRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const JoinRequests = ({ requests, onAccept, onReject }: JoinRequestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
        <CardDescription>Approve or reject athletes requesting to join your school</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.profilePicture} alt={request.name} />
                    <AvatarFallback className={`bg-bjj-${request.belt}`}>
                      {request.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {request.belt} Belt
                      </Badge>
                      {Array.from({ length: request.stripes }).map((_, i) => (
                        <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => onReject(request.id)}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onAccept(request.id)}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
