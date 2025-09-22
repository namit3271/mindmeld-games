import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  ArrowLeft, 
  Flame,
  Star,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeedMathProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Problem {
  question: string;
  answer: number;
  difficulty: number;
}

export default function SpeedMath({ onComplete, onBack }: SpeedMathProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [problemsAttempted, setProblemsAttempted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const { toast } = useToast();

  const generateProblem = useCallback((level: number = difficulty): Problem => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    // Increase difficulty based on performance
    const range = Math.min(10 + level * 5, 100);
    
    let a = Math.floor(Math.random() * range) + 1;
    let b = Math.floor(Math.random() * range) + 1;
    let question: string;
    let answer: number;

    switch (operation) {
      case '+':
        question = `${a} + ${b}`;
        answer = a + b;
        break;
      case '-':
        if (a < b) [a, b] = [b, a]; // Ensure positive result
        question = `${a} - ${b}`;
        answer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 12) + 1; // Keep multiplication manageable
        b = Math.floor(Math.random() * 12) + 1;
        question = `${a} × ${b}`;
        answer = a * b;
        break;
      case '÷':
        const product = a * b;
        question = `${product} ÷ ${a}`;
        answer = b;
        break;
      default:
        question = `${a} + ${b}`;
        answer = a + b;
    }

    return { question, answer, difficulty: level };
  }, [difficulty]);

  const startChallenge = () => {
    setIsActive(true);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setProblemsAttempted(0);
    setCorrectAnswers(0);
    setDifficulty(1);
    setMultiplier(1);
    
    const newProblem = generateProblem(1);
    setProblem(newProblem);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim() || !isActive || !problem) return;
    
    const answer = parseFloat(userAnswer);
    setProblemsAttempted(prev => prev + 1);
    
    if (Math.abs(answer - problem.answer) < 0.01) { // Allow for floating point precision
      const basePoints = 10;
      const difficultyBonus = problem.difficulty * 2;
      const streakBonus = streak >= 5 ? streak * 2 : 0;
      const points = (basePoints + difficultyBonus + streakBonus) * multiplier;
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      
      // Increase difficulty every 5 correct answers
      if ((correctAnswers + 1) % 5 === 0) {
        setDifficulty(prev => prev + 1);
        toast({
          title: "Level Up! 🎉",
          description: `Difficulty increased to level ${difficulty + 1}`,
        });
      }
      
      // Update multiplier based on streak
      if (streak >= 10) {
        setMultiplier(3);
      } else if (streak >= 5) {
        setMultiplier(2);
      }
      
      toast({
        title: streak >= 5 ? `🔥 Streak ${streak + 1}!` : "Correct! ✨",
        description: `+${points} points${streakBonus ? ` (bonus: ${streakBonus})` : ''}`,
      });
    } else {
      setStreak(0);
      setMultiplier(1);
      toast({
        title: "Not quite right 💫",
        description: `The answer was ${problem.answer}`,
        variant: "destructive",
      });
    }
    
    setUserAnswer("");
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  useEffect(() => {
    if (!isActive && score > 0) {
      onComplete(score);
    }
  }, [isActive, score, onComplete]);

  useEffect(() => {
    const initialProblem = generateProblem(1);
    setProblem(initialProblem);
  }, [generateProblem]);

  const accuracy = problemsAttempted > 0 ? Math.round((correctAnswers / problemsAttempted) * 100) : 0;
  const timeElapsed = 60 - timeLeft;
  const progressPercentage = (timeElapsed / 60) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Speed Math Challenge
          </h1>
          <p className="text-muted-foreground">Solve problems as fast as you can!</p>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Flame className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Target className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">×{multiplier}</div>
            <div className="text-xs text-muted-foreground">Multiplier</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">{timeLeft}</div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Level {difficulty}
              {streak >= 5 && <Badge className="bg-destructive animate-pulse">🔥 ON FIRE!</Badge>}
            </CardTitle>
            {isActive && <Progress value={progressPercentage} className="w-32" />}
          </div>
          <CardDescription>
            {isActive 
              ? `${correctAnswers}/${problemsAttempted} correct • Max streak: ${maxStreak}` 
              : "Ready to test your speed?"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {problem && (
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-primary animate-scale-in">
                {problem.question} = ?
              </div>
              
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your answer"
                  className="text-center text-2xl h-14"
                  disabled={!isActive}
                  autoFocus={isActive}
                />
                <Button 
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim() || !isActive}
                  className="gradient-success h-14 px-8"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {!isActive ? (
              <Button 
                onClick={startChallenge}
                className="gradient-primary text-lg px-8 py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start 60s Challenge
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-lg text-muted-foreground">
                  Keep going! {timeLeft} seconds left
                </div>
                {multiplier > 1 && (
                  <Badge className="bg-warning text-warning-foreground animate-pulse">
                    {multiplier}x Multiplier Active!
                  </Badge>
                )}
              </div>
            )}
          </div>

          {!isActive && score > 0 && (
            <div className="text-center p-6 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20 animate-fade-in">
              <Award className="w-12 h-12 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold text-success mb-2">Challenge Complete!</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Final Score: <span className="font-bold text-foreground">{score} points</span></div>
                <div>Problems Solved: <span className="font-bold text-foreground">{correctAnswers}/{problemsAttempted}</span></div>
                <div>Best Streak: <span className="font-bold text-foreground">{maxStreak}</span></div>
                <div>Accuracy: <span className="font-bold text-foreground">{accuracy}%</span></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}