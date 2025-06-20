
import React, { useState } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { TeamManagement } from '@/components/TeamManagement';
import { SongDevelopment } from '@/components/SongDevelopment';
import { Performance } from '@/components/Performance';
import { Competition } from '@/components/Competition';
import { GameStats } from '@/components/GameStats';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('team');
  const [gameData, setGameData] = useState({
    budget: 100000,
    time: 100,
    morale: 80,
    team: [],
    song: null,
    performance: null,
    round: 'preparation'
  });

  const updateGameData = (updates: Partial<typeof gameData>) => {
    setGameData(prev => ({ ...prev, ...updates }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'team':
        return <TeamManagement gameData={gameData} updateGameData={updateGameData} />;
      case 'song':
        return <SongDevelopment gameData={gameData} updateGameData={updateGameData} />;
      case 'performance':
        return <Performance gameData={gameData} updateGameData={updateGameData} />;
      case 'competition':
        return <Competition gameData={gameData} updateGameData={updateGameData} />;
      default:
        return <TeamManagement gameData={gameData} updateGameData={updateGameData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600">
      <div className="container mx-auto px-4 py-6">
        <GameHeader 
          currentScreen={currentScreen} 
          setCurrentScreen={setCurrentScreen}
          gameData={gameData}
        />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {renderScreen()}
          </div>
          
          <div className="lg:col-span-1">
            <GameStats gameData={gameData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
