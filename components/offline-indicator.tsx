"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react"
import { syncManager } from "@/lib/sync-manager"
import { toast } from "sonner"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingChanges, setPendingChanges] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const checkPendingChanges = async () => {
    try {
      const stored = await (await import("@/lib/offline-db")).offlineDB.getSyncQueue()
      setPendingChanges(stored.length)
    } catch (error) {
      console.error("Error checking pending changes:", error)
    }
  }

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      await syncManager.sync()
      await checkPendingChanges()
      toast.success("Sync completed successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sync failed"
      setSyncError(errorMessage)
      toast.error(`Sync failed: ${errorMessage}`)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncError(null)
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check pending changes periodically
    const interval = setInterval(checkPendingChanges, 5000)

    // Initial check
    checkPendingChanges()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (isOnline && pendingChanges === 0 && !syncError) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 z-50 shadow-lg ${
        syncError
          ? "bg-destructive text-destructive-foreground"
          : isOnline
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      {syncError ? (
        <>
          <AlertCircle size={16} />
          <span>Sync Error</span>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors disabled:opacity-50"
          >
            Retry
          </button>
        </>
      ) : isOnline ? (
        <>
          <Wifi size={16} />
          <span>
            {isSyncing
              ? "Syncing..."
              : pendingChanges > 0
              ? `${pendingChanges} pending`
              : "Online"}
          </span>
          {pendingChanges > 0 && !isSyncing && (
            <button
              onClick={handleManualSync}
              className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
              title="Sync now"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Offline Mode</span>
          {pendingChanges > 0 && <span className="ml-1">({pendingChanges} pending)</span>}
        </>
      )}
    </div>
  )
}
