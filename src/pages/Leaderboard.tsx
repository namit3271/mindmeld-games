import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  streak: number;
  badges: number;
  level: number;
  avatar?: string;
}

export default function Leaderboard() {
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'David Wilson', score: 1250, streak: 25, badges: 12, level: 8 },
    { id: '2', name: 'Alice Johnson', score: 1180, streak: 18, badges: 10, level: 7 },
    { id: '3', name: 'Emma Rodriguez', score: 1050, streak: 22, badges: 9, level: 7 },
    { id: '4', name: 'Bob Smith', score: 980, streak: 15, badges: 8, level: 6 },
    { id: '5', name: 'Carol Davis', score: 890, streak: 12, badges: 7, level: 6 },
    { id: '6', name: 'Michael Chen', score: 845, streak: 9, badges: 6, level: 5 },
    { id: '7', name: 'Sarah Kim', score: 780, streak: 14, badges: 5, level: 5 },
    { id: '8', name: 'James Lee', score: 720, streak: 8, badges: 4, level: 4 },
    { id: '9', name: 'Lisa Wang', score: 650, streak: 6, badges: 4, level: 4 },
    { id: '10', name: 'Alex Brown', score: 590, streak: 5, badges: 3, level: 3 },
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-500" />;
      default: return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return <Badge className="badge-gold">Champion</Badge>;
    if (position === 2) return <Badge className="badge-silver">Runner-up</Badge>;
    if (position === 3) return <Badge className="badge-bronze">Third Place</Badge>;
    if (position <= 10) return <Badge variant="secondary">Top 10</Badge>;
    return null;
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Global Leaderboard</h1>
        <p className="text-xl text-muted-foreground">
          Compete with students worldwide and climb to the top!
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => {
          const position = index + 1;
          return (
            <Card 
              key={entry.id} 
              className={`card-hover relative overflow-hidden ${
                position === 1 ? 'shadow-glow border-yellow-500/30' : 
                position === 2 ? 'border-gray-400/30' : 
                'border-orange-500/30'
              }`}
            >
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  {getRankIcon(position)}
                </div>
                <CardTitle className="text-2xl">{entry.name}</CardTitle>
                <CardDescription>Level {entry.level}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">{entry.score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-success">{entry.streak}</div>
                    <div className="text-muted-foreground">Streak</div>
                  </div>
                  <div>
                    <div className="font-semibold text-warning">{entry.badges}</div>
                    <div className="text-muted-foreground">Badges</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {getRankBadge(position)}
                </div>
              </CardContent>
              
              {/* Ranking number overlay */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                #{position}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Complete Rankings
          </CardTitle>
          <CardDescription>
            See where you stand against all learners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const position = index + 1;
              const isTopThree = position <= 3;
              
              return (
                <div 
                  key={entry.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                    isTopThree ? 'bg-primary/5 border-primary/20' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      position === 1 ? 'bg-yellow-500 text-yellow-900' :
                      position === 2 ? 'bg-gray-400 text-gray-800' :
                      position === 3 ? 'bg-orange-500 text-orange-900' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      #{position}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-foreground text-lg">
                        {entry.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {entry.level} • {entry.badges} badges earned
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {entry.score}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">
                        {entry.streak}
                      </div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getRankIcon(position)}
                      {getRankBadge(position)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Award className="w-5 h-5" />
              Speed Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Fastest Solver</span>
                <Badge className="badge-gold">David W.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Most Problems/Hour</span>
                <Badge className="badge-silver">Alice J.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Longest Streak</span>
                <Badge className="badge-bronze">Emma R.</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Star className="w-5 h-5" />
              Perfect Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Most Perfect Rounds</span>
                <Badge className="badge-gold">Alice J.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>100% Accuracy Week</span>
                <Badge className="badge-silver">David W.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Difficulty Master</span>
                <Badge className="badge-bronze">Bob S.</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Medal className="w-5 h-5" />
              Consistency Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Daily Practitioner</span>
                <Badge className="badge-gold">Carol D.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Weekly Champion</span>
                <Badge className="badge-silver">Emma R.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Most Improved</span>
                <Badge className="badge-bronze">Sarah K.</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}