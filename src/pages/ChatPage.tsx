
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";

const ChatPage = () => {
  const { currentUser, hasSchool } = useApp();
  
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
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">School chat functionality will be implemented in a future update.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ChatPage;
