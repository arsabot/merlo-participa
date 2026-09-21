export type UserRole = 'admin' | 'gestor';

export interface AuthSession {
  email: string;
  name: string;
  role: UserRole;
  expiresAt: number;
}

export const AUTH_COOKIE_NAME = 'merlo_participa_session';
export const AUTH_ROLE_KEY = 'merlo_participa_user_role';
export const AUTH_LOGGED_KEY = 'merlo_participa_admin_logged';

// Helper to set cookie with standard parameters
export function setAuthCookie(session: AuthSession, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const sessionStr = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${AUTH_COOKIE_NAME}=${sessionStr}; path=/; expires=${expires}; SameSite=Lax`;
}

// Helper to clear cookie
export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

// Helper to read session from cookie
export function getAuthCookie(): AuthSession | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [name, ...val] = c.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      try {
        const parsed = JSON.parse(decodeURIComponent(val.join('=')));
        if (parsed && parsed.email) {
          return parsed as AuthSession;
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Set auth session across cookies and local storage
export function setAuthSession(sessionData: { email: string; name?: string; role?: UserRole }) {
  const session: AuthSession = {
    email: sessionData.email,
    name: sessionData.name || (sessionData.role === 'admin' ? 'Administrador LLA' : 'Gestor Territorial'),
    role: sessionData.role || 'admin',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  setAuthCookie(session);

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_LOGGED_KEY, 'true');
    localStorage.setItem(AUTH_ROLE_KEY, session.role);
    localStorage.setItem('merlo_participa_user_email', session.email);
  }

  return session;
}

// Clear all auth sessions
export function clearAuthSession() {
  clearAuthCookie();

  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_LOGGED_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem('merlo_participa_user_email');
  }
}

// Check if user is authenticated client-side
export function getClientAuthSession(): AuthSession | null {
  const cookieSession = getAuthCookie();
  if (cookieSession) return cookieSession;

  if (typeof window !== 'undefined') {
    const isLogged = localStorage.getItem(AUTH_LOGGED_KEY) === 'true';
    if (isLogged) {
      const role = (localStorage.getItem(AUTH_ROLE_KEY) as UserRole) || 'admin';
      const email = localStorage.getItem('merlo_participa_user_email') || 'admin@llamerlo.com';
      const session: AuthSession = {
        email,
        name: role === 'admin' ? 'Administrador LLA' : 'Gestor Territorial',
        role,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      // Sync cookie
      setAuthCookie(session);
      return session;
    }
  }

  return null;
}
