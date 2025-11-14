// Session management utilities

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_KEY = "user";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "teacher" | "parent" | "student";
  createdAt: number;
  lastLogin: number;
  sessionExpiry: number;
  lastActivity: number;
}

/**
 * Create a new session for a user
 */
export function createSession(userData: Omit<SessionUser, "sessionExpiry" | "lastActivity">): SessionUser {
  const now = Date.now();
  const session: SessionUser = {
    ...userData,
    sessionExpiry: now + SESSION_DURATION,
    lastActivity: now,
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Get the current session
 */
export function getSession(): SessionUser | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    const session: SessionUser = JSON.parse(sessionData);
    return session;
  } catch (error) {
    console.error("Error reading session:", error);
    return null;
  }
}

/**
 * Validate if the current session is still valid
 */
export function validateSession(): boolean {
  const session = getSession();
  if (!session) return false;
  
  const now = Date.now();
  
  // Check if session has expired
  if (now > session.sessionExpiry) {
    clearSession();
    return false;
  }
  
  // Update last activity
  session.lastActivity = now;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return true;
}

/**
 * Extend the current session
 */
export function extendSession(): void {
  const session = getSession();
  if (!session) return;
  
  const now = Date.now();
  session.sessionExpiry = now + SESSION_DURATION;
  session.lastActivity = now;
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear the current session (logout)
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get time remaining in session (in milliseconds)
 */
export function getSessionTimeRemaining(): number {
  const session = getSession();
  if (!session) return 0;
  
  const now = Date.now();
  return Math.max(0, session.sessionExpiry - now);
}

/**
 * Check if session will expire soon (within 5 minutes)
 */
export function isSessionExpiringSoon(): boolean {
  const timeRemaining = getSessionTimeRemaining();
  const fiveMinutes = 5 * 60 * 1000;
  return timeRemaining > 0 && timeRemaining < fiveMinutes;
}

/**
 * Update user data in session
 */
export function updateSessionUser(updates: Partial<SessionUser>): void {
  const session = getSession();
  if (!session) return;
  
  const updatedSession = { ...session, ...updates };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
}
