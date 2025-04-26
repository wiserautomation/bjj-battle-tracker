
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: "athlete" | "school";
  userBelt?: string;
  content: string;
  timestamp: Date;
  profilePicture?: string;
}

const ChatPage = () => {
  const { currentUser, getAthletesBySchool } = useApp();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        userId: "school1",
        userName: "JU-PLAY Academy",
        userRole: "school",
        content: "Welcome to the school chat! This is where we'll share important announcements and you can ask questions.",
        timestamp: new Date(Date.now() - 3600000 * 24),
      },
      {
        id: "2",
        userId: "user1",
        userName: "Alex Johnson",
        userRole: "athlete",
        userBelt: "purple",
        content: "Thanks coach! Quick question - will there be classes on the holiday next week?",
        timestamp: new Date(Date.now() - 3600000 * 12),
      },
      {
        id: "3",
        userId: "school1",
        userName: "JU-PLAY Academy",
        userRole: "school",
        content: "Yes, we'll be running a special open mat session from 10am-12pm on the holiday.",
        timestamp: new Date(Date.now() - 3600000 * 11),
      },
    ];
    
    setMessages(initialMessages);
  }, []);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Please log in to access the chat.</p>
        </div>
      </MainLayout>
    );
  }
  
  const isSchool = currentUser.role === "school";
  const athletes = isSchool ? getAthletesBySchool(currentUser.id) : [];
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role as "athlete" | "school",
      ...(currentUser.role === "athlete" ? { userBelt: (currentUser as any).belt } : {}),
      content: message,
      timestamp: new Date(),
      profilePicture: currentUser.profilePicture,
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">School Chat</h1>
          <p className="text-muted-foreground">
            {isSchool 
              ? `Chat with your athletes (${athletes.length} members)` 
              : "Chat with your school coaches and teammates"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat area */}
          <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-200px)]">
            <CardHeader className="pb-2">
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>
                {isSchool 
                  ? "Send announcements and answer questions" 
                  : "Communicate with your coaches and teammates"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto pb-2">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.userId === currentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`flex ${
                        msg.userId === currentUser.id ? "flex-row-reverse" : "flex-row"
                      } items-start gap-2 max-w-[80%]`}
                    >
                      <Avatar className={msg.userId === currentUser.id ? "ml-2" : "mr-2"}>
                        <AvatarImage src={msg.profilePicture} alt={msg.userName} />
                        <AvatarFallback className={msg.userRole === "athlete" && msg.userBelt ? `bg-bjj-${msg.userBelt}` : "bg-bjj-navy"}>
                          {msg.userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div 
                          className={`rounded-lg p-3 mb-1 ${
                            msg.userId === currentUser.id 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <div 
                          className={`flex text-xs text-muted-foreground ${
                            msg.userId === currentUser.id ? "justify-end" : ""
                          }`}
                        >
                          <span className="font-semibold mr-1">
                            {msg.userId === currentUser.id ? "You" : msg.userName}
                          </span>
                          <span>{format(new Date(msg.timestamp), "h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="border-t p-3">
              <form onSubmit={sendMessage} className="flex w-full gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
          
          {/* Members list */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {isSchool ? `${athletes.length} athletes` : "Your teammates"}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(100vh-300px)]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                  <Avatar>
                    <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                    <AvatarFallback className="bg-bjj-navy text-white">
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{currentUser.name} (You)</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                </div>
                
                {isSchool ? (
                  <>
                    {athletes.map((athlete) => (
                      <div key={athlete.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <Avatar>
                          <AvatarImage src={athlete.profilePicture} alt={athlete.name} />
                          <AvatarFallback className={`bg-bjj-${athlete.belt}`}>
                            {athlete.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{athlete.name}</p>
                          <div className="flex items-center text-xs">
                            <span className="capitalize text-muted-foreground mr-1">
                              {athlete.belt} Belt
                            </span>
                            {Array.from({ length: athlete.stripes }).map((_, i) => (
                              <span key={i} className="inline-block h-1 w-1 bg-bjj-gold rounded-full"></span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Avatar>
                        <AvatarFallback className="bg-bjj-navy text-white">JA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">JU-PLAY Academy</p>
                        <p className="text-xs text-muted-foreground">School</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Avatar>
                        <AvatarFallback className="bg-bjj-black text-white">MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Mike Coach</p>
                        <p className="text-xs text-muted-foreground">Coach • Black Belt</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Avatar>
                        <AvatarFallback className="bg-bjj-purple text-white">AJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Alex Johnson</p>
                        <p className="text-xs text-muted-foreground">Purple Belt</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Avatar>
                        <AvatarFallback className="bg-bjj-blue text-white">JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">James Smith</p>
                        <p className="text-xs text-muted-foreground">Blue Belt</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
