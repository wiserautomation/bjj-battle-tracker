
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import StudentBillingManager from "@/components/school/StudentBillingManager";

const SchoolBillingPage = () => {
  const { currentUser, getAthletesBySchool } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const isSchool = currentUser?.role === 'school';
  const schoolStudents = isSchool ? getAthletesBySchool(currentUser.id) : [];
  
  const filteredStudents = schoolStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Billing Management</h1>
          <p className="text-muted-foreground">
            Manage subscription reminders for your students
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Select a student to manage their billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {filteredStudents.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    {searchTerm ? "No students match your search" : "No students found"}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredStudents.map(student => (
                      <div 
                        key={student.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedStudent === student.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs capitalize">
                          {student.belt} Belt • {student.stripes} Stripes
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {selectedStudent ? (
              <StudentBillingManager studentId={selectedStudent} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-2">Select a student to manage their billing</p>
                  <p className="text-sm">You can set reminder dates and configure billing periods</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchoolBillingPage;
