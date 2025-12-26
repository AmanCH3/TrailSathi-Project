import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Lock, Medal, Trophy, Mountain, Footprints, Flag, Download } from "lucide-react";
import { toast } from 'react-toastify';

const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Joined your first hiking group.',
    icon: Footprints,
    image: '/badges/first_steps.png', // Illustrated Badge
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    condition: (user) => (user.stats?.hikesJoined || 0) > 0 || (user.joinedTrails?.length || 0) > 0
  },
  {
    id: 'trail_conqueror',
    title: 'Trail Conqueror',
    description: 'Completed your first hike.',
    icon: Flag,
    image: '/badges/trail_conqueror.png', // Illustrated Badge
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    condition: (user) => (user.stats?.totalHikes || 0) > 0 || (user.completedTrails?.length || 0) > 0
  },
  {
    id: 'high_flyer',
    title: 'High Flyer',
    description: 'Claimed over 1000m of elevation gain.',
    icon: Mountain,
    image: '/badges/high_flyer.png', // Illustrated Badge
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    condition: (user) => (user.stats?.totalElevation || 0) >= 1000
  },
  {
    id: 'marathoner',
    title: 'Marathoner',
    description: 'Hiked a total of 42km or more.',
    icon: Trophy,
    image: '/badges/marathoner.png', // Illustrated Badge
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    condition: (user) => (user.stats?.totalDistance || 0) >= 42
  },
  {
    id: 'solo_spirit',
    title: 'Solo Spirit',
    description: 'Completed a hike as a Solo Hiker.',
    icon: User => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    condition: (user) => user.hikerType === 'Solo' && (user.stats?.totalHikes || 0) > 0
  },
  {
    id: 'legend',
    title: 'Trail Legend',
    description: 'Completed 10 hikes.',
    icon: Medal,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    condition: (user) => (user.stats?.totalHikes || 0) >= 10
  }
];

export function AchievementsTab({ user }) {

  const handleShare = async (achievement) => {
    const shareData = {
      title: 'TrailSathi Achievement Unlocked!',
      text: `I just unlocked the "${achievement.title}" achievement on TrailSathi! ${achievement.description}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success("Achievement details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleDownload = (achievement) => {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = achievement.image;
      link.download = `${achievement.id}_badge.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${achievement.title} Badge!`);
  };

  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(user)).length;
  const progress = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                 <Trophy className="h-6 w-6 text-yellow-400" />
                 Your Achievements
              </h2>
              <p className="text-gray-300">
                You have unlocked <span className="text-white font-bold">{unlockedCount}</span> of <span className="text-white font-bold">{ACHIEVEMENTS.length}</span> badges.
              </p>
           </div>
           
           <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-gray-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-green-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold">{progress}%</span>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = achievement.condition(user);
          const Icon = achievement.icon;

          return (
            <Card 
                key={achievement.id} 
                className={`transition-all duration-300 overflow-hidden ${isUnlocked ? 'border-gray-200 shadow-sm hover:shadow-md bg-white' : 'border-dashed border-gray-200 bg-gray-50/50 opacity-70'}`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 relative">
                
                {/* Badge Image or Icon */}
                <div className="flex-shrink-0">
                    {achievement.image ? (
                        <div className={`h-16 w-16 rounded-full overflow-hidden border-2 ${isUnlocked ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200'} transition-transform hover:scale-105`}>
                             <img 
                                src={achievement.image} 
                                alt={achievement.title} 
                                className={`h-full w-full object-cover ${!isUnlocked && 'grayscale opacity-60'}`} 
                             />
                        </div>
                    ) : (
                        <div className={`p-3 rounded-2xl ${isUnlocked ? achievement.bgColor : 'bg-gray-100'}`}>
                           {isUnlocked ? (
                               <Icon className={`h-6 w-6 ${achievement.color}`} />
                           ) : (
                               <Lock className="h-6 w-6 text-gray-400" />
                           )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                {isUnlocked && (
                    <div className="flex gap-1">
                         {achievement.image && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600" onClick={() => handleDownload(achievement)} title="Download Badge">
                                <Download className="h-4 w-4" />
                            </Button>
                         )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => handleShare(achievement)} title="Share Achievement">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
              </CardHeader>
              
              <CardContent>
                <CardTitle className={`text-lg mb-1 flex items-center gap-2 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                    {!isUnlocked && <Lock className="h-3 w-3 text-gray-400" />}
                </CardTitle>
                <CardDescription className="text-sm">
                    {achievement.description}
                </CardDescription>
                
                <div className="mt-4">
                     {isUnlocked ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Unlocked</Badge>
                     ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Locked</Badge>
                     )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
