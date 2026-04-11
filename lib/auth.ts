export const SESSION_COOKIE_NAME = "afterlife_session"
export const PROFILE_COOKIE_NAME = "afterlife_profile"

export interface SessionProfile {
  name: string
  email: string
  role?: string
  kycVerified?: boolean
  kycData?: {
    aadhaarName: string
    maskedAadhaar: string
    dob: string
    address: string
    photo?: string
  }
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function createSessionToken() {
  // Minimal session token for demo/prototype purposes
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

export function normalizeProfileName(name: string | undefined, email: string) {
  const trimmedName = name?.trim()
  if (trimmedName) return trimmedName

  const emailPrefix = email.split("@")[0] ?? "Vault User"
  return emailPrefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function serializeProfileCookie(profile: SessionProfile) {
  return encodeURIComponent(JSON.stringify(profile))
}

export function parseProfileCookie(value: string | undefined): SessionProfile | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<SessionProfile>
    if (typeof parsed.name !== "string" || typeof parsed.email !== "string") {
      return null
    }

    return {
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      kycVerified: parsed.kycVerified,
      kycData: parsed.kycData,
    }
  } catch {
    return null
  }
}

