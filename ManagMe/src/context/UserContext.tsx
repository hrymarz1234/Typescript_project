import { createContext, useContext } from "react";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
};

const mockUser: User = {
  id: 1,
  firstName: "Jan",
  lastName: "Kowalski",
};

export const UserContext = createContext<User>(mockUser);
export const useUser = () => useContext(UserContext);