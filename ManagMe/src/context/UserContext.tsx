import { createContext, useContext } from "react";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: "admin" | "devops" | "developer" | "guest";
  login: string;
  password?: string;
};

type UserContextType = {
  currentUser: User | null;
  allUsers: User[];  
  setCurrentUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserContext.Provider");
  return context;
};