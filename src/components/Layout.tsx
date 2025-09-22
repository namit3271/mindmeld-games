import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Home, Info, Trophy, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [user, setUser] = useState(null); // Will be managed by context later

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 gradient-gaming shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">STEM Learn</h1>
                <p className="text-xs text-white/80">Gamified • Engaging • Professional</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-white hover:bg-white/10 ${isActive ? 'bg-white/20' : ''}`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                )}
              </NavLink>
              
              <NavLink to="/student">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-white hover:bg-white/10 ${isActive ? 'bg-white/20' : ''}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Student
                  </Button>
                )}
              </NavLink>
              
              <NavLink to="/teacher">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-white hover:bg-white/10 ${isActive ? 'bg-white/20' : ''}`}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Teacher
                  </Button>
                )}
              </NavLink>
              
              <NavLink to="/leaderboard">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-white hover:bg-white/10 ${isActive ? 'bg-white/20' : ''}`}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                )}
              </NavLink>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="bg-white text-primary hover:bg-white/90">
                    Login
                  </Button>
                  <Button variant="secondary">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} STEM Learn — Built for engaging education
          </p>
        </div>
      </footer>
    </div>
  );
}