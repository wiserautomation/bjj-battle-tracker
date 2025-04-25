
import { useApp } from "@/context/AppContext";
import { Challenge } from "@/types";
import { useState } from "react";
import ChallengeCard from "./ChallengeCard";

const ChallengesList = () => {
  const { currentUser, getChallenges, getChallengesByAthlete } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  
  const challenges = currentUser?.role === 'athlete'
    ? getChallengesByAthlete(currentUser.id)
    : getChallenges();
    
  const filteredChallenges = challenges.filter(challenge => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    
    switch(filter) {
      case 'active':
        return now >= startDate && now <= endDate;
      case 'upcoming':
        return now < startDate;
      case 'completed':
        return now > endDate;
      default:
        return true;
    }
  });

  const handleChallengeSelect = (challengeId: string) => {
    console.log(`Challenge selected: ${challengeId}`);
    // Navigate to challenge detail page or open modal
  };
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'all' 
            ? 'bg-bjj-navy text-white' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'active' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'upcoming' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'completed' 
            ? 'bg-gray-600 text-white' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>
      
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No challenges found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onSelect={handleChallengeSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
