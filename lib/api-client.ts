/**
 * API Client for making requests to the backend
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  // Build URL with query params
  let url = endpoint
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      data.error || "An error occurred",
      response.status,
      data.code,
      data.details
    )
  }

  return data
}

/**
 * GET request
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return fetchApi<T>(endpoint, { method: "GET", params })
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, body?: any): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, body?: any): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return fetchApi<T>(endpoint, { method: "DELETE" })
}

/**
 * Student API
 */
export const studentApi = {
  list: (params?: {
    classId?: string
    search?: string
    page?: number
    limit?: number
  }) => get<any>("/api/students", params),

  get: (id: string) => get<any>(`/api/students/${id}`),

  create: (data: any) => post<any>("/api/students", data),

  update: (id: string, data: any) => put<any>(`/api/students/${id}`, data),

  delete: (id: string) => del<any>(`/api/students/${id}`),

  getAttendance: (id: string, params?: { startDate?: string; endDate?: string; limit?: number }) =>
    get<any>(`/api/students/${id}/attendance`, params),

  getGrades: (id: string, params?: { term?: string; academicYear?: string; subject?: string }) =>
    get<any>(`/api/students/${id}/grades`, params),

  getHomework: (id: string, params?: { status?: string }) =>
    get<any>(`/api/students/${id}/homework`, params),
}

/**
 * Auth API
 */
export const authApi = {
  register: (data: any) => post<any>("/api/auth/register", data),

  login: (email: string, password: string) =>
    post<any>("/api/auth/login", { email, password }),

  getSession: () => get<any>("/api/auth/session"),
}
