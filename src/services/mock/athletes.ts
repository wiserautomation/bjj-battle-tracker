import { Athlete } from "@/types";

export const mockAthletes: Athlete[] = [
  {
    id: "athlete-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "blue",
    stripes: 2,
    weight: 175,
    trainingHistory: {
      startDate: "2021-03-15",
      yearsTraining: 2
    },
    achievements: ["badge-1", "badge-3"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-2",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "purple",
    stripes: 1,
    weight: 155,
    trainingHistory: {
      startDate: "2019-06-22",
      yearsTraining: 4
    },
    achievements: ["badge-1", "badge-2", "badge-4"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-3",
    name: "Taylor Kim",
    email: "taylor@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "white",
    stripes: 4,
    weight: 145,
    trainingHistory: {
      startDate: "2022-01-10",
      yearsTraining: 1
    },
    achievements: ["badge-1"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-4",
    name: "Jordan Patel",
    email: "jordan@example.com",
    role: "athlete",
    schoolId: "school-2",
    belt: "brown",
    stripes: 0,
    weight: 185,
    trainingHistory: {
      startDate: "2016-11-05",
      yearsTraining: 6
    },
    achievements: ["badge-1", "badge-2", "badge-3", "badge-4", "badge-5"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-5",
    name: "Casey Morgan",
    email: "casey@example.com",
    role: "athlete",
    schoolId: "school-2",
    belt: "black",
    stripes: 1,
    weight: 170,
    trainingHistory: {
      startDate: "2013-08-20",
      yearsTraining: 9
    },
    achievements: ["badge-1", "badge-2", "badge-3", "badge-4", "badge-5", "badge-6"],
    profilePicture: "/placeholder.svg"
  }
];

export const getAthleteById = (id: string): Athlete | undefined => 
  mockAthletes.find(athlete => athlete.id === id);

export const getAthletesBySchool = (schoolId: string): Athlete[] => 
  mockAthletes.filter(athlete => athlete.schoolId === schoolId);
