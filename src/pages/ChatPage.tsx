
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Users } from "lucide-react";

const ChatPage = () => {
  const { currentUser, hasSchool } = useApp();
  const [message, setMessage] = useState('');
  
  // Check if the athlete has joined a school
  const hasJoinedSchool = currentUser?.role === "athlete" ? hasSchool(currentUser.id) : 
                           currentUser?.role === "school"; // Schools always have access
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">School Chat</h1>
            <p className="text-muted-foreground">Connect with your school community</p>
          </div>
        </div>
        
        {!hasJoinedSchool ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Join a School First</h3>
                <p className="text-muted-foreground mb-4">
                  You need to join a school to access the chat and connect with coaches and teammates.
                </p>
              </CardContent>
            </Card>
            <SchoolEnrollment />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-240px)]">
            {/* Member list sidebar */}
            <Card className="md:col-span-1 hidden md:block">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <p className="text-center text-muted-foreground py-4">
                    No members available yet.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Chat area */}
            <Card className="md:col-span-3 flex flex-col">
              <CardHeader>
                <CardTitle>Team Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="flex flex-col space-y-4">
                  <p className="text-center text-muted-foreground py-12">
                    No messages yet. Be the first to send a message to your school!
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" disabled={!message}>
                    <SendHorizonal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ChatPage;
