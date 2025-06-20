
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Music, Sparkles, Trophy } from 'lucide-react';

interface GameHeaderProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  gameData: any;
}

export const GameHeader = ({ currentScreen, setCurrentScreen, gameData }: GameHeaderProps) => {
  const screens = [
    { id: 'team', label: 'Team', icon: Crown },
    { id: 'song', label: 'Song', icon: Music },
    { id: 'performance', label: 'Performance', icon: Sparkles },
    { id: 'competition', label: 'Competition', icon: Trophy }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">
            🇸🇪 Eurovision Sweden Manager
          </h1>
          <p className="text-blue-100">
            Lead Sweden to Eurovision glory! Manage your team, create the perfect song, and compete for the crown.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {screens.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentScreen === id ? "default" : "secondary"}
              onClick={() => setCurrentScreen(id)}
              className={`transition-all duration-200 ${
                currentScreen === id 
                  ? 'bg-yellow-500 text-blue-900 hover:bg-yellow-400' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
