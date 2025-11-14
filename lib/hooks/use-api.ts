"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiError } from "@/lib/api-client"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  immediate?: boolean
}

/**
 * Hook for making API requests with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [apiCall])

  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [execute, options.immediate])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  return {
    ...state,
    refetch,
    execute,
  }
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, loading: true, error: null })

      try {
        const data = await mutationFn(variables)
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "An unexpected error occurred"
        setState({ data: null, loading: false, error: errorMessage })
        throw error
      }
    },
    [mutationFn]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    mutate,
    reset,
  }
}
