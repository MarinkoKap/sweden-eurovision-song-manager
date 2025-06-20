
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Star, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skill: number;
  cost: number;
  specialty: string;
}

const availableMembers: TeamMember[] = [
  { id: '1', name: 'Astrid Lindgren', role: 'Lead Singer', skill: 95, cost: 25000, specialty: 'Pop Vocals' },
  { id: '2', name: 'Magnus Carlsson', role: 'Lead Singer', skill: 88, cost: 20000, specialty: 'Rock Vocals' },
  { id: '3', name: 'Erik Sundin', role: 'Songwriter', skill: 92, cost: 15000, specialty: 'Electronic' },
  { id: '4', name: 'Lena Andersson', role: 'Songwriter', skill: 89, cost: 12000, specialty: 'Ballads' },
  { id: '5', name: 'Björn Styles', role: 'Choreographer', skill: 91, cost: 10000, specialty: 'Modern Dance' },
  { id: '6', name: 'Saga Fashion', role: 'Stylist', skill: 87, cost: 8000, specialty: 'Avant-garde' },
];

interface TeamManagementProps {
  gameData: any;
  updateGameData: (updates: any) => void;
}

export const TeamManagement = ({ gameData, updateGameData }: TeamManagementProps) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const hireMember = (member: TeamMember) => {
    if (gameData.budget < member.cost) {
      toast({
        title: "Insufficient Budget",
        description: "You don't have enough budget to hire this team member.",
        variant: "destructive"
      });
      return;
    }

    const existingRole = gameData.team.find((m: TeamMember) => m.role === member.role);
    if (existingRole) {
      toast({
        title: "Role Already Filled",
        description: `You already have a ${member.role}. Fire them first to hire a new one.`,
        variant: "destructive"
      });
      return;
    }

    updateGameData({
      team: [...gameData.team, member],
      budget: gameData.budget - member.cost,
      morale: Math.min(100, gameData.morale + 5)
    });

    toast({
      title: "Team Member Hired!",
      description: `${member.name} has joined your team as ${member.role}.`
    });
  };

  const fireMember = (memberId: string) => {
    const member = gameData.team.find((m: TeamMember) => m.id === memberId);
    updateGameData({
      team: gameData.team.filter((m: TeamMember) => m.id !== memberId),
      budget: gameData.budget + Math.floor(member.cost * 0.3),
      morale: Math.max(0, gameData.morale - 10)
    });

    toast({
      title: "Team Member Released",
      description: `${member.name} has been released from the team.`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-yellow-400" />
          Your Team
        </h2>
        
        {gameData.team.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-100">No team members hired yet. Start building your dream team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameData.team.map((member: TeamMember) => (
              <Card key={member.id} className="p-4 bg-white/5 border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => fireMember(member.id)}
                  >
                    Release
                  </Button>
                </div>
                <p className="text-blue-100 text-sm mb-2">{member.role}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    {member.skill}/100
                  </Badge>
                  <span className="text-xs text-blue-200">{member.specialty}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Plus className="w-6 h-6 mr-2 text-yellow-400" />
          Available Talent
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMembers.filter(member => 
            !gameData.team.some((tm: TeamMember) => tm.id === member.id)
          ).map((member) => (
            <Card key={member.id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-blue-100 text-sm">{member.role}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    {member.skill}/100
                  </Badge>
                  <span className="text-green-300 font-semibold">${member.cost.toLocaleString()}</span>
                </div>
                
                <div className="text-xs text-blue-200 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {member.specialty}
                </div>
                
                <Button
                  onClick={() => hireMember(member)}
                  disabled={gameData.budget < member.cost}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900"
                >
                  Hire
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
