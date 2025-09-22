import { createContext, useContext, useState, ReactNode } from "react";
import { User, StudentProgress } from "@/types";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  studentProgress: StudentProgress | null;
  setStudentProgress: (progress: StudentProgress) => void;
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const value: AppContextType = {
    user,
    setUser,
    studentProgress,
    setStudentProgress,
    isQuizActive,
    setIsQuizActive,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};