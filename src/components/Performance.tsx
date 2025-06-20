
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shirt, Star, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PerformanceElement {
  id: string;
  type: 'staging' | 'costume';
  name: string;
  impact: number;
  cost: number;
  timeCost: number;
  description: string;
}

const performanceElements: PerformanceElement[] = [
  { 
    id: '1', 
    type: 'staging', 
    name: 'Minimalist Stage', 
    impact: 15, 
    cost: 5000, 
    timeCost: 5,
    description: 'Simple but elegant staging focusing on the performance'
  },
  { 
    id: '2', 
    type: 'staging', 
    name: 'LED Spectacular', 
    impact: 35, 
    cost: 20000, 
    timeCost: 15,
    description: 'High-tech LED walls and floor with synchronized visuals'
  },
  { 
    id: '3', 
    type: 'staging', 
    name: 'Interactive Stage', 
    impact: 45, 
    cost: 30000, 
    timeCost: 20,
    description: 'Moving platforms and interactive elements'
  },
  { 
    id: '4', 
    type: 'costume', 
    name: 'Classic Elegance', 
    impact: 20, 
    cost: 3000, 
    timeCost: 3,
    description: 'Timeless, sophisticated outfit'
  },
  { 
    id: '5', 
    type: 'costume', 
    name: 'Avant-garde Design', 
    impact: 40, 
    cost: 12000, 
    timeCost: 10,
    description: 'Bold, artistic costume that makes a statement'
  },
  { 
    id: '6', 
    type: 'costume', 
    name: 'Cultural Fusion', 
    impact: 35, 
    cost: 8000, 
    timeCost: 7,
    description: 'Modern Swedish design with traditional elements'
  },
];

interface PerformanceProps {
  gameData: any;
  updateGameData: (updates: any) => void;
}

export const Performance = ({ gameData, updateGameData }: PerformanceProps) => {
  const canPreparePerformance = () => {
    return gameData.song && gameData.team.length > 0;
  };

  const hasChoreographer = () => {
    return gameData.team.some((member: any) => member.role === 'Choreographer');
  };

  const hasStylist = () => {
    return gameData.team.some((member: any) => member.role === 'Stylist');
  };

  const selectElement = (element: PerformanceElement) => {
    if (!canPreparePerformance()) {
      toast({
        title: "Prerequisites Missing",
        description: "You need a song and team members to prepare the performance.",
        variant: "destructive"
      });
      return;
    }

    if (gameData.budget < element.cost) {
      toast({
        title: "Insufficient Budget",
        description: "You don't have enough budget for this performance element.",
        variant: "destructive"
      });
      return;
    }

    if (gameData.time < element.timeCost) {
      toast({
        title: "Not Enough Time",
        description: "You don't have enough time to prepare this element.",
        variant: "destructive"
      });
      return;
    }

    const currentPerformance = gameData.performance || { staging: null, costume: null, totalImpact: 0 };
    const updatedPerformance = {
      ...currentPerformance,
      [element.type]: element,
      totalImpact: currentPerformance.totalImpact - (currentPerformance[element.type]?.impact || 0) + element.impact
    };

    // Add team bonuses
    let bonus = 0;
    if (element.type === 'staging' && hasChoreographer()) {
      const choreographer = gameData.team.find((m: any) => m.role === 'Choreographer');
      bonus += Math.floor(choreographer.skill / 10);
    }
    if (element.type === 'costume' && hasStylist()) {
      const stylist = gameData.team.find((m: any) => m.role === 'Stylist');
      bonus += Math.floor(stylist.skill / 10);
    }

    updatedPerformance.totalImpact += bonus;

    const budgetDeduction = gameData.performance?.[element.type] ? 
      element.cost - gameData.performance[element.type].cost : element.cost;
    const timeDeduction = gameData.performance?.[element.type] ? 
      element.timeCost - gameData.performance[element.type].timeCost : element.timeCost;

    updateGameData({
      performance: updatedPerformance,
      budget: gameData.budget - budgetDeduction,
      time: gameData.time - timeDeduction,
      morale: Math.min(100, gameData.morale + 5)
    });

    toast({
      title: "Performance Updated!",
      description: `${element.name} has been added to your performance.`
    });
  };

  const getTeamBonus = (type: string) => {
    if (type === 'staging' && hasChoreographer()) {
      const choreographer = gameData.team.find((m: any) => m.role === 'Choreographer');
      return Math.floor(choreographer.skill / 10);
    }
    if (type === 'costume' && hasStylist()) {
      const stylist = gameData.team.find((m: any) => m.role === 'Stylist');
      return Math.floor(stylist.skill / 10);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
          Performance Preparation
        </h2>
        
        {!canPreparePerformance() ? (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-100 mb-4">
              You need to select a song and build your team before preparing the performance.
            </p>
            <div className="flex justify-center gap-2">
              {!gameData.song && <Badge variant="destructive">No Song Selected</Badge>}
              {gameData.team.length === 0 && <Badge variant="destructive">No Team Members</Badge>}
            </div>
          </div>
        ) : (
          <>
            {gameData.performance ? (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Your Performance Setup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{gameData.performance.totalImpact}</div>
                    <div className="text-xs text-blue-200">Total Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      {gameData.performance.staging?.name || 'Not Selected'}
                    </div>
                    <div className="text-xs text-blue-200">Staging</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      {gameData.performance.costume?.name || 'Not Selected'}
                    </div>
                    <div className="text-xs text-blue-200">Costume</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100">Start building your performance by selecting staging and costume elements.</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Staging Options
                  {hasChoreographer() && (
                    <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300">
                      +{getTeamBonus('staging')} Choreographer Bonus
                    </Badge>
                  )}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {performanceElements.filter(el => el.type === 'staging').map((element) => (
                    <Card key={element.id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-white">{element.name}</h4>
                          <p className="text-blue-100 text-sm">{element.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            <span className="text-white">{element.impact + getTeamBonus('staging')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-400" />
                            <span className="text-white">{element.timeCost}d</span>
                          </div>
                        </div>
                        
                        <div className="text-green-300 font-semibold text-center">
                          ${element.cost.toLocaleString()}
                        </div>
                        
                        <Button
                          onClick={() => selectElement(element)}
                          disabled={gameData.budget < element.cost || gameData.time < element.timeCost}
                          className="w-full bg-purple-500 hover:bg-purple-400 text-white"
                          variant={gameData.performance?.staging?.id === element.id ? "secondary" : "default"}
                        >
                          {gameData.performance?.staging?.id === element.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Shirt className="w-5 h-5 mr-2 text-pink-400" />
                  Costume Options
                  {hasStylist() && (
                    <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300">
                      +{getTeamBonus('costume')} Stylist Bonus
                    </Badge>
                  )}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {performanceElements.filter(el => el.type === 'costume').map((element) => (
                    <Card key={element.id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-white">{element.name}</h4>
                          <p className="text-blue-100 text-sm">{element.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            <span className="text-white">{element.impact + getTeamBonus('costume')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-400" />
                            <span className="text-white">{element.timeCost}d</span>
                          </div>
                        </div>
                        
                        <div className="text-green-300 font-semibold text-center">
                          ${element.cost.toLocaleString()}
                        </div>
                        
                        <Button
                          onClick={() => selectElement(element)}
                          disabled={gameData.budget < element.cost || gameData.time < element.timeCost}
                          className="w-full bg-pink-500 hover:bg-pink-400 text-white"
                          variant={gameData.performance?.costume?.id === element.id ? "secondary" : "default"}
                        >
                          {gameData.performance?.costume?.id === element.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
