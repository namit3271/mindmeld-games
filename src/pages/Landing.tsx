import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Target, Award, BarChart3, Zap, Brain, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuickMath from "../components/QuickMath";
import heroImage from "../assets/hero-image.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  🚀 Gamified Learning Platform
                </Badge>
                <h1 className="text-5xl font-extrabold text-foreground mb-6 leading-tight">
                  Make STEM Learning 
                  <span className="gradient-primary bg-clip-text text-transparent"> Addictive</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Transform math and science education with our gamified platform. 
                  Engage students through interactive quizzes, achievements, and real-time progress tracking.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white hover:opacity-90 shadow-glow"
                  onClick={() => navigate('/student')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate('/teacher')}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  I'm a Teacher
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center glass rounded-lg p-4">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">Goals</div>
                  <div className="text-sm text-muted-foreground">Achievement System</div>
                </div>
                <div className="text-center glass rounded-lg p-4">
                  <Award className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">Badges</div>
                  <div className="text-sm text-muted-foreground">Unlock Rewards</div>
                </div>
                <div className="text-center glass rounded-lg p-4">
                  <BarChart3 className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">Analytics</div>
                  <div className="text-sm text-muted-foreground">Track Progress</div>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-lg opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              ></div>
              <div className="relative glass rounded-lg p-6">
                <QuickMath onComplete={(score) => console.log('Demo completed with score:', score)} />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full gradient-primary opacity-20 blur-xl animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full gradient-success opacity-20 blur-xl animate-float"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose STEM Learn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines the best of gaming psychology with educational excellence
              to create an engaging learning experience that students love.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Get immediate results and explanations for every problem solved
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Brain className="w-10 h-10 text-success mb-4" />
                <CardTitle>Adaptive Learning</CardTitle>
                <CardDescription>
                  Problems automatically adjust to match each student's skill level
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Award className="w-10 h-10 text-warning mb-4" />
                <CardTitle>Achievement System</CardTitle>
                <CardDescription>
                  Unlock badges, streaks, and rewards as you progress through challenges
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-secondary mb-4" />
                <CardTitle>Teacher Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards and reports for tracking class performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Target className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Goal Setting</CardTitle>
                <CardDescription>
                  Set daily and weekly goals to maintain consistent learning habits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Gamepad2 className="w-10 h-10 text-success mb-4" />
                <CardTitle>Gamification</CardTitle>
                <CardDescription>
                  Turn learning into an engaging game with points, levels, and competitions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}