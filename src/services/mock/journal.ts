import { JournalEntry } from "@/types";

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    athleteId: "athlete-1",
    date: "2025-04-20",
    title: "Great rolling session today",
    content: "Really felt my guard passing improving. Coach gave good tips on pressure.",
    tags: ["guard passing", "rolling", "improvement"],
    trainingType: "gi",
    submissions: {
      achieved: {
        count: 3,
        types: ["armbar", "triangle"]
      },
      received: {
        count: 2,
        types: ["kimura", "americana"]
      }
    },
    partners: ["athlete-2", "athlete-3"],
    private: true
  },
  {
    id: "journal-2",
    athleteId: "athlete-2",
    date: "2025-04-19",
    title: "Competition prep",
    content: "Focused on takedowns and top pressure. Need to work on conditioning.",
    tags: ["competition", "takedowns", "top pressure"],
    trainingType: "no-gi",
    submissions: {
      achieved: {
        count: 4,
        types: ["guillotine", "rear-naked choke"]
      },
      received: {
        count: 1,
        types: ["heel hook"]
      }
    },
    private: false
  },
  {
    id: "journal-3",
    athleteId: "athlete-4",
    date: "2025-04-18",
    title: "Teaching the basics",
    content: "Helped teach the fundamentals class today. Refreshed my understanding of core principles.",
    tags: ["teaching", "basics", "fundamentals"],
    trainingType: "gi",
    submissions: {
      achieved: {
        count: 5,
        types: ["collar choke", "kimura", "ezekiel"]
      },
      received: {
        count: 0,
        types: []
      }
    },
    private: false
  }
];

export const getJournalEntriesByAthlete = (athleteId: string): JournalEntry[] => 
  mockJournalEntries.filter(entry => entry.athleteId === athleteId);
