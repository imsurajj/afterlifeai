export const SESSION_COOKIE_NAME = "afterlife_session"

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function createSessionToken() {
  // Minimal session token for demo/prototype purposes
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

