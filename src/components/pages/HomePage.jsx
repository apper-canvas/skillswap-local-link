import React from 'react';
import HomeHeader from '@/components/organisms/HomeHeader';
import MainFeatureOrganism from '@/components/organisms/MainFeatureOrganism';
import FloatingActionButton from '@/components/molecules/FloatingActionButton'; // FAB is specific to MySkills, remove from here or make generic

export default function HomePage() {
  // Hardcoded for now as per original functionality, could fetch from user service later
  const userCredits = 12;

  return (
    <div className="min-h-full bg-background">
      <HomeHeader credits={userCredits} />
      <div className="p-4">
        <MainFeatureOrganism />
      </div>
      {/* FloatingActionButton is managed within MySkillsPage, remove from HomePage if not needed here */}
      {/* <FloatingActionButton /> */}
    </div>
  );
}