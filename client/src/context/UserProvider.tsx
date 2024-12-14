// UserContext.tsx
import { useState, useEffect, ReactNode } from "react";
import { UserContext, User } from "./UserContext";
import { getCurrentUser } from "@/services/users.service";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user data is in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const LogCurrentUserIn = async () => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      if (accessToken && refreshToken) {
        try {
          const response = await getCurrentUser();
          setUser(response);
        } catch (err) {
          console.error("Error logging in user:", err);
          setUser(null);
        }
      }
    };
    LogCurrentUserIn();
  }, []);
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
