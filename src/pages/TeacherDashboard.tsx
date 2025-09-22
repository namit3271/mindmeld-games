import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, TrendingUp, Download, Upload, Target } from "lucide-react";

interface ClassData {
  students: Array<{
    id: string;
    name: string;
    email: string;
    score: number;
    problemsSolved: number;
    streak: number;
    lastActive: string;
  }>;
  classAverage: number;
  totalStudents: number;
  activeToday: number;
}

export default function TeacherDashboard() {
  const [classData] = useState<ClassData>({
    students: [
      { id: '1', name: 'Alice Johnson', email: 'alice@school.edu', score: 890, problemsSolved: 234, streak: 12, lastActive: '2 hours ago' },
      { id: '2', name: 'Bob Smith', email: 'bob@school.edu', score: 750, problemsSolved: 189, streak: 8, lastActive: '1 hour ago' },
      { id: '3', name: 'Carol Davis', email: 'carol@school.edu', score: 680, problemsSolved: 156, streak: 15, lastActive: '30 min ago' },
      { id: '4', name: 'David Wilson', email: 'david@school.edu', score: 920, problemsSolved: 267, streak: 23, lastActive: '5 min ago' },
      { id: '5', name: 'Emma Brown', email: 'emma@school.edu', score: 540, problemsSolved: 123, streak: 5, lastActive: '1 day ago' },
    ],
    classAverage: 756,
    totalStudents: 5,
    activeToday: 4
  });

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Score', 'Problems Solved', 'Streak', 'Last Active'],
      ...classData.students.map(student => [
        student.name,
        student.email,
        student.score.toString(),
        student.problemsSolved.toString(),
        student.streak.toString(),
        student.lastActive
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'class-progress.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Monitor your class progress and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{classData.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{classData.classAverage}</div>
            <div className="text-sm text-muted-foreground">Class Average</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{classData.activeToday}</div>
            <div className="text-sm text-muted-foreground">Active Today</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">85%</div>
            <div className="text-sm text-muted-foreground">Engagement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Student Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Student Performance
              </CardTitle>
              <CardDescription>Individual student progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classData.students.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{student.score}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{student.problemsSolved}</div>
                        <div className="text-xs text-muted-foreground">Problems</div>
                      </div>
                      <div className="text-center">
                        <Badge className={student.streak > 10 ? 'badge-gold' : student.streak > 5 ? 'badge-silver' : 'badge-bronze'}>
                          {student.streak} streak
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">{student.lastActive}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Progress</CardTitle>
              <CardDescription>Weekly learning goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Goal</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Participation</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Problem Accuracy</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>This week's leaders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classData.students
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-yellow-500 text-yellow-900' : 
                          index === 1 ? 'bg-gray-400 text-gray-800' : 
                          'bg-orange-500 text-orange-900'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.score} points</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gradient-primary">
                Create Assignment
              </Button>
              <Button variant="outline" className="w-full">
                Send Announcements
              </Button>
              <Button variant="outline" className="w-full">
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}