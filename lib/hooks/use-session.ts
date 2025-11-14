import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  validateSession,
  extendSession,
  clearSession,
  isSessionExpiringSoon,
  type SessionUser,
} from "@/lib/session-manager";

export function useSession() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    // Check session on mount
    const session = getSession();
    if (session && validateSession()) {
      setUser(session);
      setIsExpiringSoon(isSessionExpiringSoon());
    } else {
      setUser(null);
      // Redirect to login if on a protected route
      if (window.location.pathname.startsWith("/dashboard")) {
        router.push("/auth/login");
      }
    }
    setIsLoading(false);

    // Set up interval to check session validity
    const interval = setInterval(() => {
      if (validateSession()) {
        const session = getSession();
        setUser(session);
        setIsExpiringSoon(isSessionExpiringSoon());
      } else {
        setUser(null);
        if (window.location.pathname.startsWith("/dashboard")) {
          router.push("/auth/login");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [router]);

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/auth/login");
  };

  const extend = () => {
    extendSession();
    const session = getSession();
    setUser(session);
    setIsExpiringSoon(false);
  };

  return {
    user,
    isLoading,
    isExpiringSoon,
    logout,
    extendSession: extend,
  };
}
