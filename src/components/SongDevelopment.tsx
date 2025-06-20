
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, Star, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Song {
  id: string;
  title: string;
  genre: string;
  appeal: number;
  difficulty: number;
  timeCost: number;
  budgetCost: number;
}

const availableSongs: Song[] = [
  { 
    id: '1', 
    title: 'Northern Lights', 
    genre: 'Pop Ballad', 
    appeal: 85, 
    difficulty: 60, 
    timeCost: 20, 
    budgetCost: 15000 
  },
  { 
    id: '2', 
    title: 'Midnight Sun', 
    genre: 'Electronic Pop', 
    appeal: 92, 
    difficulty: 80, 
    timeCost: 30, 
    budgetCost: 25000 
  },
  { 
    id: '3', 
    title: 'Viking Heart', 
    genre: 'Folk Rock', 
    appeal: 78, 
    difficulty: 55, 
    timeCost: 15, 
    budgetCost: 10000 
  },
  { 
    id: '4', 
    title: 'Stockholm Dreams', 
    genre: 'Indie Pop', 
    appeal: 88, 
    difficulty: 70, 
    timeCost: 25, 
    budgetCost: 18000 
  },
];

interface SongDevelopmentProps {
  gameData: any;
  updateGameData: (updates: any) => void;
}

export const SongDevelopment = ({ gameData, updateGameData }: SongDevelopmentProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const hasRequiredTeam = () => {
    const hasSinger = gameData.team.some((member: any) => member.role === 'Lead Singer');
    const hasSongwriter = gameData.team.some((member: any) => member.role === 'Songwriter');
    return hasSinger && hasSongwriter;
  };

  const selectSong = (song: Song) => {
    if (!hasRequiredTeam()) {
      toast({
        title: "Missing Team Members",
        description: "You need a Lead Singer and Songwriter to develop a song.",
        variant: "destructive"
      });
      return;
    }

    if (gameData.budget < song.budgetCost) {
      toast({
        title: "Insufficient Budget",
        description: "You don't have enough budget to develop this song.",
        variant: "destructive"
      });
      return;
    }

    if (gameData.time < song.timeCost) {
      toast({
        title: "Not Enough Time",
        description: "You don't have enough time to develop this song.",
        variant: "destructive"
      });
      return;
    }

    updateGameData({
      song: song,
      budget: gameData.budget - song.budgetCost,
      time: gameData.time - song.timeCost,
      morale: Math.min(100, gameData.morale + 10)
    });

    toast({
      title: "Song Selected!",
      description: `"${song.title}" is now your Eurovision entry.`
    });
  };

  const getTeamBonus = () => {
    const singer = gameData.team.find((member: any) => member.role === 'Lead Singer');
    const songwriter = gameData.team.find((member: any) => member.role === 'Songwriter');
    
    if (!singer || !songwriter) return 0;
    
    return Math.floor((singer.skill + songwriter.skill) / 10);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Music className="w-6 h-6 mr-2 text-yellow-400" />
          Song Development
        </h2>
        
        {gameData.song ? (
          <div className="bg-gradient-to-r from-yellow-500/20 to-blue-500/20 rounded-lg p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{gameData.song.title}</h3>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                Selected Song
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{gameData.song.appeal + getTeamBonus()}</div>
                <div className="text-xs text-blue-200">Appeal Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-200">{gameData.song.genre}</div>
                <div className="text-xs text-blue-200">Genre</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{gameData.song.difficulty}/100</div>
                <div className="text-xs text-blue-200">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-300">+{getTeamBonus()}</div>
                <div className="text-xs text-blue-200">Team Bonus</div>
              </div>
            </div>
            
            <Button
              variant="destructive"
              onClick={() => updateGameData({ song: null })}
              className="mt-4"
            >
              Change Song
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-100 mb-4">
              {hasRequiredTeam() 
                ? "Choose your Eurovision song from the available options below." 
                : "You need a Lead Singer and Songwriter to develop a song."
              }
            </p>
            {!hasRequiredTeam() && (
              <Badge variant="destructive">
                Missing: {!gameData.team.some((m: any) => m.role === 'Lead Singer') ? 'Lead Singer ' : ''}
                {!gameData.team.some((m: any) => m.role === 'Songwriter') ? 'Songwriter' : ''}
              </Badge>
            )}
          </div>
        )}
      </Card>

      {!gameData.song && (
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Available Songs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSongs.map((song) => (
              <Card key={song.id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white text-lg">{song.title}</h4>
                    <p className="text-blue-100 text-sm">{song.genre}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span className="text-white">Appeal: {song.appeal + getTeamBonus()}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-1 rounded-full bg-red-400"></div>
                      <span className="text-white">Difficulty: {song.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-blue-400" />
                      <span className="text-white">{song.timeCost} days</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-300">${song.budgetCost.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => selectSong(song)}
                    disabled={!hasRequiredTeam() || gameData.budget < song.budgetCost || gameData.time < song.timeCost}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900"
                  >
                    Select Song
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
