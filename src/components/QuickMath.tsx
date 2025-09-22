import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Clock, Zap, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickMathProps {
  onComplete?: (score: number) => void;
}

export default function QuickMath({ onComplete }: QuickMathProps) {
  const [problem, setProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [problemsAttempted, setProblemsAttempted] = useState(0);
  const { toast } = useToast();

  const generateProblem = () => {
    const operations = [
      { 
        type: 'addition',
        generator: () => {
          const a = Math.floor(Math.random() * 50) + 1;
          const b = Math.floor(Math.random() * 50) + 1;
          return { question: `${a} + ${b}`, answer: a + b };
        }
      },
      {
        type: 'subtraction', 
        generator: () => {
          const a = Math.floor(Math.random() * 50) + 1;
          const b = Math.floor(Math.random() * 50) + 1;
          const max = Math.max(a, b);
          const min = Math.min(a, b);
          return { question: `${max} - ${min}`, answer: max - min };
        }
      },
      {
        type: 'multiplication',
        generator: () => {
          const a = Math.floor(Math.random() * 12) + 1;
          const b = Math.floor(Math.random() * 12) + 1;
          return { question: `${a} × ${b}`, answer: a * b };
        }
      }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const newProblem = operation.generator();
    setProblem(newProblem);
  };

  const startChallenge = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    setProblemsAttempted(0);
    generateProblem();
    
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
    if (!userAnswer.trim() || !isActive) return;
    
    const answer = parseInt(userAnswer);
    setProblemsAttempted(prev => prev + 1);
    
    if (answer === problem.answer) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "+10 points",
        variant: "default",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The answer was ${problem.answer}`,
        variant: "destructive",
      });
    }
    
    setUserAnswer("");
    generateProblem();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  useEffect(() => {
    if (!isActive && score > 0 && onComplete) {
      onComplete(score);
    }
  }, [isActive, score, onComplete]);

  useEffect(() => {
    generateProblem();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          Quick Math Challenge
        </CardTitle>
        <CardDescription>
          {isActive 
            ? `Score: ${score} | Problems: ${problemsAttempted}` 
            : "Test your speed and accuracy!"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isActive && (
          <div className="flex items-center justify-center gap-2 text-warning">
            <Clock className="w-4 h-4" />
            <Badge variant="outline" className="text-lg px-3 py-1">
              {timeLeft}s
            </Badge>
          </div>
        )}

        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {problem.question} = ?
          </div>
          
          <div className="flex gap-2">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your answer"
              className="text-center text-xl"
              disabled={!isActive}
              autoFocus
            />
            <Button 
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || !isActive}
              className="gradient-success"
            >
              Submit
            </Button>
          </div>
        </div>

        {!isActive ? (
          <Button 
            onClick={startChallenge}
            className="w-full gradient-primary text-lg py-3"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start 30s Challenge
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{score}</div>
            <div className="text-sm text-muted-foreground">Current Score</div>
          </div>
        )}

        {!isActive && score > 0 && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-xl font-bold text-success">Challenge Complete!</div>
            <div className="text-sm text-muted-foreground">
              Final Score: {score} points from {problemsAttempted} problems
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}