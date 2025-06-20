
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Competitor {
  id: string;
  country: string;
  flag: string;
  song: string;
  artist: string;
  score: number;
  votes: number;
}

const competitors: Competitor[] = [
  { id: '1', country: 'Norway', flag: '🇳🇴', song: 'Arctic Dreams', artist: 'Frost & Fire', score: 0, votes: 0 },
  { id: '2', country: 'Denmark', flag: '🇩🇰', song: 'Copenhagen Nights', artist: 'Viking Heart', score: 0, votes: 0 },
  { id: '3', country: 'Finland', flag: '🇫🇮', song: 'Northern Soul', artist: 'Aurora Borealis', score: 0, votes: 0 },
  { id: '4', country: 'Iceland', flag: '🇮🇸', song: 'Volcano', artist: 'Ice & Fire', score: 0, votes: 0 },
  { id: '5', country: 'Germany', flag: '🇩🇪', song: 'Digital Love', artist: 'Techno Dreams', score: 0, votes: 0 },
  { id: '6', country: 'France', flag: '🇫🇷', song: 'Lumière', artist: 'Étoile Brillante', score: 0, votes: 0 },
  { id: '7', country: 'Italy', flag: '🇮🇹', song: 'Amore Infinito', artist: 'Bella Voce', score: 0, votes: 0 },
  { id: '8', country: 'Netherlands', flag: '🇳🇱', song: 'Windmill Dreams', artist: 'Orange Sky', score: 0, votes: 0 },
];

interface CompetitionProps {
  gameData: any;
  updateGameData: (updates: any) => void;
}

export const Competition = ({ gameData, updateGameData }: CompetitionProps) => {
  const [competitionState, setCompetitionState] = useState<'ready' | 'running' | 'finished'>('ready');
  const [results, setResults] = useState<Competitor[]>([]);
  const [swedenScore, setSwedenScore] = useState(0);
  const [currentRound, setCurrentRound] = useState<'semi-final' | 'final'>('semi-final');

  const canCompete = () => {
    return gameData.song && gameData.performance && gameData.team.length > 0;
  };

  const calculateSwedenScore = () => {
    let baseScore = 0;
    
    // Song contribution
    if (gameData.song) {
      baseScore += gameData.song.appeal;
      
      // Team bonuses
      const singer = gameData.team.find((m: any) => m.role === 'Lead Singer');
      const songwriter = gameData.team.find((m: any) => m.role === 'Songwriter');
      if (singer) baseScore += Math.floor(singer.skill / 5);
      if (songwriter) baseScore += Math.floor(songwriter.skill / 5);
    }
    
    // Performance contribution
    if (gameData.performance) {
      baseScore += gameData.performance.totalImpact;
    }
    
    // Morale contribution
    baseScore += Math.floor(gameData.morale / 10);
    
    // Add some randomness (±20%)
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    return Math.floor(baseScore * randomFactor);
  };

  const generateCompetitorScores = () => {
    return competitors.map(competitor => ({
      ...competitor,
      score: Math.floor(60 + Math.random() * 80), // Random scores between 60-140
      votes: Math.floor(50 + Math.random() * 300) // Random votes
    }));
  };

  const startCompetition = () => {
    if (!canCompete()) {
      toast({
        title: "Not Ready to Compete",
        description: "You need a song, performance setup, and team members to compete.",
        variant: "destructive"
      });
      return;
    }

    setCompetitionState('running');
    
    // Simulate competition
    setTimeout(() => {
      const swedenFinalScore = calculateSwedenScore();
      const competitorResults = generateCompetitorScores();
      
      // Add Sweden to results
      const allResults = [
        ...competitorResults,
        {
          id: 'sweden',
          country: 'Sweden',
          flag: '🇸🇪',
          song: gameData.song.title,
          artist: gameData.team.find((m: any) => m.role === 'Lead Singer')?.name || 'Unknown Artist',
          score: swedenFinalScore,
          votes: Math.floor(swedenFinalScore * 2.5)
        }
      ].sort((a, b) => b.score - a.score);

      setResults(allResults);
      setSwedenScore(swedenFinalScore);
      setCompetitionState('finished');
      
      const swedenPosition = allResults.findIndex(r => r.id === 'sweden') + 1;
      
      if (swedenPosition <= 3) {
        toast({
          title: "🏆 Congratulations!",
          description: `Sweden finished in ${swedenPosition}${swedenPosition === 1 ? 'st' : swedenPosition === 2 ? 'nd' : 'rd'} place!`,
        });
      } else {
        toast({
          title: "Competition Complete",
          description: `Sweden finished in ${swedenPosition}th place. Better luck next time!`,
        });
      }
    }, 3000);
  };

  const resetCompetition = () => {
    setCompetitionState('ready');
    setResults([]);
    setSwedenScore(0);
  };

  const getSwedenPreview = () => {
    if (!gameData.song || !gameData.team.length) return null;
    
    const singer = gameData.team.find((m: any) => m.role === 'Lead Singer');
    const estimatedScore = calculateSwedenScore();
    
    return {
      country: 'Sweden',
      flag: '🇸🇪',
      song: gameData.song.title,
      artist: singer?.name || 'Unknown Artist',
      estimatedScore: estimatedScore
    };
  };

  const swedenPreview = getSwedenPreview();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Eurovision Competition
        </h2>
        
        {!canCompete() ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-100 mb-4">
              Complete all preparations before entering the competition.
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {!gameData.song && <Badge variant="destructive">No Song</Badge>}
              {!gameData.performance && <Badge variant="destructive">No Performance</Badge>}
              {gameData.team.length === 0 && <Badge variant="destructive">No Team</Badge>}
            </div>
          </div>
        ) : (
          <>
            {swedenPreview && (
              <Card className="p-4 bg-gradient-to-r from-blue-600/20 to-yellow-500/20 border-yellow-400/30 mb-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  🇸🇪 Sweden's Entry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-blue-200">Song</div>
                    <div className="font-semibold text-white">{swedenPreview.song}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Artist</div>
                    <div className="font-semibold text-white">{swedenPreview.artist}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Estimated Score</div>
                    <div className="font-semibold text-white">{swedenPreview.estimatedScore}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Status</div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      Ready to Compete
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {competitionState === 'ready' && (
              <div className="text-center">
                <Button
                  onClick={startCompetition}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 text-xl px-8 py-4"
                >
                  <Trophy className="w-6 h-6 mr-2" />
                  Start Competition
                </Button>
              </div>
            )}

            {competitionState === 'running' && (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Competition in Progress...</h3>
                <p className="text-blue-100">The votes are being counted!</p>
              </div>
            )}

            {competitionState === 'finished' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">🎉 Final Results</h3>
                  <Button
                    onClick={resetCompetition}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Try Again
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {results.map((result, index) => (
                    <Card 
                      key={result.id} 
                      className={`p-4 ${
                        result.id === 'sweden' 
                          ? 'bg-gradient-to-r from-blue-600/30 to-yellow-500/30 border-yellow-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`text-2xl font-bold ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-300' : 
                            index === 2 ? 'text-yellow-600' : 'text-white'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="text-2xl">{result.flag}</div>
                          <div>
                            <div className="font-semibold text-white">{result.country}</div>
                            <div className="text-sm text-blue-200">
                              "{result.song}" by {result.artist}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{result.score}</div>
                          <div className="text-sm text-blue-200">{result.votes} votes</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          Competition Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {competitors.slice(0, 8).map((competitor) => (
            <div key={competitor.id} className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl mb-1">{competitor.flag}</div>
              <div className="text-sm font-semibold text-white">{competitor.country}</div>
              <div className="text-xs text-blue-200">"{competitor.song}"</div>
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-blue-200">
          You'll be competing against 8 other countries in the semi-final round.
        </div>
      </Card>
    </div>
  );
};
