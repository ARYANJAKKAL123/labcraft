import { useState, useEffect } from "react";

type Role = "admin" | "viewer";

interface User {
  email: string;
  role: Role;
}

// ✅ Authorized admins
const AUTHORIZED_USERS = [
  {
    email: "aryan@labcraft.com",
    password: "aryan123",
    role: "admin" as const,
  },
  {
    email: "tanishq@labcraft.com",
    password: "tanishq123",
    role: "admin" as const,
  },
];

// ❌ No viewers
const VIEWER_ACCOUNT: any[] = [];

const ALL_USERS = [...AUTHORIZED_USERS, ...VIEWER_ACCOUNT];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // load session
  useEffect(() => {
    const stored = localStorage.getItem("labcraft_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const found = ALL_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      const userData = { email: found.email, role: found.role };
      setUser(userData);
      localStorage.setItem("labcraft_user", JSON.stringify(userData));
      setError("");
      return true;
    } else {
      setError("Invalid email or password");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("labcraft_user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  // only admins exist → always true when logged in
  const canEdit = user?.role === "admin";

  return {
    user,
    error,
    login,
    logout,
    isLoading,
    isAuthenticated,
    canEdit,
  };
}

