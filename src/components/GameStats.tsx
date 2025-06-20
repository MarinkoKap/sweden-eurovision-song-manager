
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coins, Clock, Heart, Star } from 'lucide-react';

interface GameStatsProps {
  gameData: {
    budget: number;
    time: number;
    morale: number;
    team: any[];
    song: any;
    performance: any;
    round: string;
  };
}

export const GameStats = ({ gameData }: GameStatsProps) => {
  const getOverallScore = () => {
    let score = 0;
    if (gameData.team.length > 0) score += 25;
    if (gameData.song) score += 35;
    if (gameData.performance) score += 40;
    return score;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Game Stats
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm text-blue-100 mb-1">
              <span className="flex items-center">
                <Coins className="w-4 h-4 mr-1" />
                Budget
              </span>
              <span>${gameData.budget.toLocaleString()}</span>
            </div>
            <Progress value={(gameData.budget / 100000) * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm text-blue-100 mb-1">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Time Left
              </span>
              <span>{gameData.time} days</span>
            </div>
            <Progress value={gameData.time} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm text-blue-100 mb-1">
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                Team Morale
              </span>
              <span>{gameData.morale}%</span>
            </div>
            <Progress value={gameData.morale} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm text-blue-100 mb-1">
              <span>Readiness</span>
              <span>{getOverallScore()}%</span>
            </div>
            <Progress value={getOverallScore()} className="h-2" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h4 className="text-white font-semibold mb-2">Current Phase</h4>
        <div className="text-blue-100 capitalize text-sm">
          {gameData.round.replace('_', ' ')}
        </div>
      </Card>
    </div>
  );
};
