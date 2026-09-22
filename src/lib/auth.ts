export type UserRole = 'admin' | 'gestor';

export interface AuthSession {
  email: string;
  name: string;
  role: UserRole;
  expiresAt: number;
}

export interface UserAccount {
  email: string;
  name: string;
  role: UserRole;
  password: string;
  resetCode?: string;
  resetCodeExpires?: number;
}

export const AUTH_COOKIE_NAME = 'merlo_participa_session';
export const AUTH_ROLE_KEY = 'merlo_participa_user_role';
export const AUTH_LOGGED_KEY = 'merlo_participa_admin_logged';
export const AUTH_ACCOUNTS_KEY = 'merlo_participa_accounts_v2';

// Default system accounts with initial passwords
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    email: 'admin@merloparticipa.org',
    name: 'Administrador Comunitario',
    role: 'admin',
    password: 'Merlo2026!',
  },
  {
    email: 'gestor@merloparticipa.org',
    name: 'Gestor Barrial',
    role: 'gestor',
    password: 'GestorMerlo2026!',
  },
];

// Get all accounts from storage or initialize with defaults
export function getAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw) as UserAccount[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading accounts from localStorage', e);
    return DEFAULT_ACCOUNTS;
  }
}

// Save accounts
export function saveAccounts(accounts: UserAccount[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts to localStorage', e);
  }
}

// Validate login credentials
export function validateCredentials(
  email: string,
  passwordInput: string
): { success: boolean; session?: AuthSession; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  const accounts = getAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    return {
      success: false,
      error: 'No existe una cuenta registrada con este correo electrónico.',
    };
  }

  if (account.password !== cleanPassword) {
    return {
      success: false,
      error: 'Contraseña incorrecta. Verifique e intente nuevamente o restablezca su clave.',
    };
  }

  const session = setAuthSession({
    email: account.email,
    name: account.name,
    role: account.role,
  });

  return {
    success: true,
    session,
  };
}

// Request password reset PIN
export function requestPasswordReset(email: string): {
  success: boolean;
  resetCode?: string;
  expiresInMinutes?: number;
  message: string;
} {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return {
      success: false,
      message: 'No encontramos una cuenta asociada a este correo.',
    };
  }

  // Generate 6-digit verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresInMinutes = 15;
  const resetCodeExpires = Date.now() + expiresInMinutes * 60 * 1000;

  accounts[index].resetCode = resetCode;
  accounts[index].resetCodeExpires = resetCodeExpires;
  saveAccounts(accounts);

  return {
    success: true,
    resetCode,
    expiresInMinutes,
    message: `Código de verificación generado correctamente para ${cleanEmail}.`,
  };
}

// Verify code and set new password
export function verifyAndResetPassword(
  email: string,
  resetCode: string,
  newPassword: string
): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = resetCode.trim();
  const cleanNewPassword = newPassword.trim();

  if (cleanNewPassword.length < 6) {
    return {
      success: false,
      message: 'La nueva contraseña debe tener al menos 6 caracteres.',
    };
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return {
      success: false,
      message: 'Cuenta no encontrada.',
    };
  }

  const account = accounts[index];

  if (!account.resetCode || account.resetCode !== cleanCode) {
    return {
      success: false,
      message: 'El código de verificación es incorrecto o no ha sido solicitado.',
    };
  }

  if (account.resetCodeExpires && account.resetCodeExpires < Date.now()) {
    return {
      success: false,
      message: 'El código de verificación ha expirado. Solicite uno nuevo.',
    };
  }

  // Update password and clear reset code
  accounts[index].password = cleanNewPassword;
  delete accounts[index].resetCode;
  delete accounts[index].resetCodeExpires;
  saveAccounts(accounts);

  return {
    success: true,
    message: '¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión.',
  };
}

// Change password for currently logged-in user
export function changePassword(
  email: string,
  currentPasswordInput: string,
  newPasswordInput: string
): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCurrentPassword = currentPasswordInput.trim();
  const cleanNewPassword = newPasswordInput.trim();

  if (cleanNewPassword.length < 6) {
    return {
      success: false,
      message: 'La nueva contraseña debe tener al menos 6 caracteres.',
    };
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return {
      success: false,
      message: 'Usuario no encontrado.',
    };
  }

  if (accounts[index].password !== cleanCurrentPassword) {
    return {
      success: false,
      message: 'La contraseña actual ingresada es incorrecta.',
    };
  }

  accounts[index].password = cleanNewPassword;
  saveAccounts(accounts);

  return {
    success: true,
    message: 'Contraseña actualizada correctamente.',
  };
}

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
    name: sessionData.name || (sessionData.role === 'admin' ? 'Administrador Comunitario' : 'Gestor Barrial'),
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
      const email = localStorage.getItem('merlo_participa_user_email') || 'admin@merloparticipa.org';
      const session: AuthSession = {
        email,
        name: role === 'admin' ? 'Administrador Comunitario' : 'Gestor Barrial',
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
