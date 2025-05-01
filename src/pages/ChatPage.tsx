
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
          <SchoolEnrollment />
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
                  <div className="flex items-center gap-3 py-2 px-4 bg-accent/20">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="JU-PLAY Academy" />
                      <AvatarFallback className="bg-bjj-navy">JA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">JU-PLAY Academy</p>
                      <p className="text-xs text-muted-foreground">School</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 px-4 hover:bg-accent/10 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.name} />
                      <AvatarFallback className="bg-bjj-blue">
                        {currentUser?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser?.name} (You)</p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser?.role === "athlete" ? "Athlete" : "School"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 px-4 hover:bg-accent/10 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Coach Mike" />
                      <AvatarFallback className="bg-bjj-black">MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Mike Coach</p>
                      <p className="text-xs text-muted-foreground">Coach • Black Belt</p>
                    </div>
                  </div>
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
                  <div className="bg-accent/10 self-start rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="JU-PLAY Academy" />
                        <AvatarFallback className="bg-bjj-navy">JA</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">JU-PLAY Academy</span>
                      <span className="text-xs text-muted-foreground">12:07 PM</span>
                    </div>
                    <p>Welcome to the school chat! This is where we'll share important announcements and you can ask questions.</p>
                  </div>
                  
                  <div className="bg-primary/10 self-end rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">12:07 AM</span>
                      <span className="text-sm font-medium">{currentUser?.name}</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.name} />
                        <AvatarFallback className="bg-bjj-blue">
                          {currentUser?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p>Thanks coach! Quick question - will there be classes on the holiday next week?</p>
                  </div>
                  
                  <div className="bg-accent/10 self-start rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="JU-PLAY Academy" />
                        <AvatarFallback className="bg-bjj-navy">JA</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">JU-PLAY Academy</span>
                      <span className="text-xs text-muted-foreground">1:07 AM</span>
                    </div>
                    <p>Yes, we'll be running a special open mat session from 10am-12pm on the holiday.</p>
                  </div>
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
