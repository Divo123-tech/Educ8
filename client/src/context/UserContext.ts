import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
  username: string;
  id: number;
  email: string;
  courses: [];
  bio?: string;
  profile_picture?: File | null;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);
