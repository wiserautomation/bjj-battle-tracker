
import { User } from "@/types";
import { mockAthletes, getAthleteById, getAthletesBySchool } from "./mock/athletes";
import { mockSchools, getSchoolById } from "./mock/schools";
import { 
  mockChallenges, 
  mockChallengeResults,
  getChallengeById,
  getChallengesBySchool,
  getChallengesByAthlete,
  getChallengeResults,
  getAthleteResults
} from "./mock/challenges";
import { mockJournalEntries, getJournalEntriesByAthlete } from "./mock/journal";
import { mockBadges, getBadges, getAthleteBadges } from "./mock/badges";
import { LogAchievementParams, logChallengeAchievement } from "./mock/achievements";

export const mockDataService = {
  getCurrentUser: (): User => mockAthletes[0],
  getSchools: () => mockSchools,
  getSchoolById,
  getAthletes: () => mockAthletes,
  getAthleteById,
  getAthletesBySchool,
  getChallenges: () => mockChallenges,
  getChallengeById,
  getChallengesBySchool,
  getChallengesByAthlete,
  getChallengeResults,
  getAthleteResults,
  getJournalEntriesByAthlete,
  getBadges,
  getAthleteBadges,
  logChallengeAchievement
};

export type { LogAchievementParams };
