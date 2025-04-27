import { School } from "@/types";

export const mockSchools: School[] = [
  {
    id: "school-1",
    name: "Elite BJJ Academy",
    email: "info@elitebjj.com",
    role: "school",
    location: "123 Main St, Anytown, USA",
    contact: "(555) 123-4567",
    description: "A premier BJJ academy focused on technical excellence and competitive success.",
    athletes: ["athlete-1", "athlete-2", "athlete-3"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "school-2",
    name: "Gracie Defense Systems",
    email: "contact@graciedefense.com",
    role: "school",
    location: "456 Oak Ave, Somewhere, USA",
    contact: "(555) 987-6543",
    description: "Traditional Gracie Jiu-Jitsu with a focus on self-defense applications.",
    athletes: ["athlete-4", "athlete-5"],
    profilePicture: "/placeholder.svg"
  }
];

export const getSchoolById = (id: string): School | undefined => 
  mockSchools.find(school => school.id === id);
