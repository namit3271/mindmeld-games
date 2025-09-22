import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Award, Clock, Brain, Star } from "lucide-react";
import { StudentProgress, MathProblem, Badge as BadgeType } from "@/types";

export default function StudentDashboard() {
  const [progress, setProgress] = useState<StudentProgress>({
    score: 450,
    streak: 8,
    badges: [
      { id: '1', name: 'First Steps', description: 'Solved your first problem', icon: '🎯', type: 'bronze', earnedAt: new Date() },
      { id: '2', name: 'Speed Demon', description: '10 problems in under 2 minutes', icon: '⚡', type: 'silver', earnedAt: new Date() },
      { id: '3', name: 'Perfect Score', description: 'Got 100% in a quiz round', icon: '🏆', type: 'gold', earnedAt: new Date() }
    ],
    level: 5,
    problemsSolved: 127,
    timeSpent: 2450
  });

  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizScore, setQuizScore] = useState(0);

  // Generate new problem
  const generateProblem = () => {
    const difficulty = Math.min(progress.level, 10);
    const max = 10 + difficulty * 5;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    const type = operations[Math.floor(Math.random() * operations.length)] as MathProblem['type'];
    
    let problem: string;
    let answer: number;
    
    switch (type) {
      case 'addition':
        problem = `${a} + ${b}`;
        answer = a + b;
        break;
      case 'subtraction':
        problem = `${a + b} - ${a}`;
        answer = b;
        break;
      case 'multiplication':
        problem = `${a} × ${b}`;
        answer = a * b;
        break;
      case 'division':
        const product = a * b;
        problem = `${product} ÷ ${a}`;
        answer = b;
        break;
    }
    
    setCurrentProblem({
      id: Math.random().toString(),
      problem,
      answer,
      difficulty,
      type
    });
  };

  // Start quiz session
  const startQuiz = () => {
    setIsQuizActive(true);
    setTimeLeft(30);
    setQuizScore(0);
    generateProblem();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsQuizActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Submit answer
  const submitAnswer = () => {
    if (!currentProblem || !userAnswer) return;
    
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      setProgress(prev => ({
        ...prev,
        score: prev.score + 10,
        streak: prev.streak + 1,
        problemsSolved: prev.problemsSolved + 1
      }));
      
      // Check for streak badge
      if ((progress.streak + 1) % 10 === 0) {
        const newBadge: BadgeType = {
          id: Math.random().toString(),
          name: `Streak Master ${progress.streak + 1}`,
          description: `Solved ${progress.streak + 1} problems in a row!`,
          icon: '🔥',
          type: 'gold',
          earnedAt: new Date()
        };
        setProgress(prev => ({
          ...prev,
          badges: [...prev.badges, newBadge]
        }));
      }
    }
    
    setUserAnswer("");
    if (isQuizActive) {
      generateProblem();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  useEffect(() => {
    generateProblem();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{progress.score}</div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{progress.streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{progress.level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{progress.problemsSolved}</div>
            <div className="text-sm text-muted-foreground">Problems Solved</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Game Hub Section */}
        <div className="lg:col-span-2 space-y-6">
          <GameHub 
            playerLevel={progress.level}
            onGameComplete={(gameId, score, xp) => {
              setProgress(prev => ({
                ...prev,
                score: prev.score + score,
                problemsSolved: prev.problemsSolved + 1
              }));
            }}
          />
        </div>

        {/* Badges and Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                    <Badge className={`badge-${badge.type}`}>
                      {badge.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Alex", score: 890, rank: 1 },
                  { name: "You", score: progress.score, rank: 2 },
                  { name: "Sarah", score: 420, rank: 3 },
                  { name: "Mike", score: 380, rank: 4 },
                ].map((entry, i) => (
                  <div key={entry.name} className={`flex items-center justify-between p-2 rounded ${entry.name === 'You' ? 'bg-primary/10 border border-primary/20' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold w-6">#{entry.rank}</span>
                      <span className={entry.name === 'You' ? 'font-bold' : ''}>{entry.name}</span>
                    </div>
                    <span className="font-semibold">{entry.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}