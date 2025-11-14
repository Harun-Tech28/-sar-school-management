import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND")
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed", public errors?: any) {
    super(message, 400, "VALIDATION_ERROR")
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT")
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Not authenticated") {
    super(message, 401, "UNAUTHORIZED")
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN")
  }
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "meta" in error
  ) {
    const prismaError = error as { code: string; meta?: any }
    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(
          {
            error: "A record with this value already exists",
            code: "DUPLICATE_ENTRY",
            field: prismaError.meta?.target,
          },
          { status: 409 }
        )
      case "P2025":
        return NextResponse.json(
          {
            error: "Record not found",
            code: "NOT_FOUND",
          },
          { status: 404 }
        )
      case "P2003":
        return NextResponse.json(
          {
            error: "Invalid reference to related record",
            code: "INVALID_REFERENCE",
          },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          {
            error: "Database error",
            code: "DATABASE_ERROR",
          },
          { status: 500 }
        )
    }
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { details: error.errors }),
      },
      { status: error.statusCode }
    )
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  )
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withErrorHandler(
  handler: (...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
