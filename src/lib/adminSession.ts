// Admin session management
export interface AdminSession {
  schoolId: string;
  username: string;
  timestamp: number;
  expiresAt: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to check if we're on the client side
function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function createAdminSession(schoolId: string, username: string): void {
  if (!isClient()) return;
  
  const now = Date.now();
  const session: AdminSession = {
    schoolId,
    username,
    timestamp: now,
    expiresAt: now + SESSION_DURATION
  };
  
  localStorage.setItem('adminSession', JSON.stringify(session));
}

export function getAdminSession(): AdminSession | null {
  if (!isClient()) return null;
  
  try {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) return null;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('adminSession');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error parsing admin session:', error);
    localStorage.removeItem('adminSession');
    return null;
  }
}

export function isAdminForSchool(schoolId: string): boolean {
  if (!isClient()) return false;
  
  const session = getAdminSession();
  return session?.schoolId === schoolId;
}

export function clearAdminSession(): void {
  if (!isClient()) return;
  
  localStorage.removeItem('adminSession');
}

export function getCurrentAdminUsername(): string | null {
  if (!isClient()) return null;
  
  const session = getAdminSession();
  return session?.username || null;
} 