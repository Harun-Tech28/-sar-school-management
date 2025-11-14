// Centralized error messages for the application

export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    USER_NOT_FOUND: "No account found with this email address.",
    EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
    WEAK_PASSWORD: "Password does not meet security requirements.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    UNAUTHORIZED: "You don't have permission to access this resource.",
    LOGIN_REQUIRED: "Please log in to continue.",
  },

  // Database errors
  DATABASE: {
    CONNECTION_FAILED: "Unable to connect to the database. Please try again later.",
    QUERY_FAILED: "An error occurred while processing your request.",
    NOT_FOUND: "The requested resource was not found.",
    DUPLICATE_ENTRY: "This record already exists.",
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PHONE: "Please enter a valid phone number.",
    INVALID_DATE: "Please enter a valid date.",
    MIN_LENGTH: (min: number) => `Must be at least ${min} characters long.`,
    MAX_LENGTH: (max: number) => `Must not exceed ${max} characters.`,
  },

  // Network errors
  NETWORK: {
    OFFLINE: "You are currently offline. Changes will be synced when you're back online.",
    TIMEOUT: "Request timed out. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    NO_RESPONSE: "No response from server. Please check your internet connection.",
  },

  // Sync errors
  SYNC: {
    FAILED: "Failed to sync your changes. Will retry automatically.",
    CONFLICT: "A conflict occurred while syncing. Please refresh and try again.",
    QUOTA_EXCEEDED: "Storage quota exceeded. Please free up some space.",
  },

  // Student management errors
  STUDENT: {
    NOT_FOUND: "Student not found.",
    CREATE_FAILED: "Failed to create student record.",
    UPDATE_FAILED: "Failed to update student information.",
    DELETE_FAILED: "Failed to delete student record.",
  },

  // Attendance errors
  ATTENDANCE: {
    MARK_FAILED: "Failed to mark attendance.",
    ALREADY_MARKED: "Attendance has already been marked for this date.",
    INVALID_DATE: "Cannot mark attendance for future dates.",
  },

  // Generic errors
  GENERIC: {
    UNKNOWN: "An unexpected error occurred. Please try again.",
    TRY_AGAIN: "Something went wrong. Please try again.",
    CONTACT_SUPPORT: "If this problem persists, please contact support.",
  },
} as const

// Helper function to get error message with fallback
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return ERROR_MESSAGES.GENERIC.UNKNOWN
}

// Helper function to check if error is a specific type
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("auth") ||
    message.includes("login") ||
    message.includes("credential") ||
    message.includes("unauthorized")
  )
}

export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("network") ||
    message.includes("offline") ||
    message.includes("connection") ||
    message.includes("timeout")
  )
}
