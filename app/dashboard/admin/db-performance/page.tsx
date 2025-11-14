'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function DatabasePerformancePage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  const checkPerformance = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/admin/db-performance')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to check performance')
      }
    } catch (err) {
      setError('Error checking database performance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkPerformance()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600 bg-green-50 border-green-200'
      case 'GOOD': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'SLOW': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return <CheckCircle className="w-5 h-5" />
      case 'SLOW':
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-8 h-8" />
              Database Performance
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and optimize database query performance
            </p>
          </div>
          
          <Button
            onClick={checkPerformance}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
              
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${getStatusColor(data.connection.status)}`}>
                {getStatusIcon(data.connection.status)}
                <div>
                  <div className="font-semibold">{data.connection.status}</div>
                  <div className="text-sm">Connection Time: {data.connection.connectionTime}</div>
                </div>
              </div>
            </div>

            {/* Database Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Database Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Database Size</div>
                  <div className="text-2xl font-bold text-gray-900">{data.database.size}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total Tables</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.keys(data.database.tables).length}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Table Counts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(data.database.tables).map(([table, count]) => (
                    <div key={table} className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm text-blue-600 capitalize">{table}</div>
                      <div className="text-lg font-bold text-blue-900">{count as number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Query Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Query Statistics</h2>
              
              {data.queries.stats.total > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600">Total Queries</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {data.queries.stats.total}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600">Average Time</div>
                      <div className="text-2xl font-bold text-green-900">
                        {data.queries.stats.average}ms
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-600">Slow Queries</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {data.queries.slowQueries}
                      </div>
                    </div>
                  </div>

                  {data.queries.slowQueriesList.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Slowest Queries</h3>
                      <div className="space-y-2">
                        {data.queries.slowQueriesList.map((query: any, index: number) => (
                          <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                            <div className="flex justify-between items-start">
                              <div className="text-sm text-red-900 font-mono flex-1">
                                {query.query.substring(0, 80)}...
                              </div>
                              <div className="text-sm font-bold text-red-600 ml-2">
                                {query.duration}ms
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No query statistics available yet. Queries will be tracked as you use the system.
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              
              <div className="space-y-2">
                {data.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      rec.startsWith('✅')
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Optimization Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use connection pooling (already configured)</li>
                <li>• Add indexes to frequently queried fields</li>
                <li>• Limit the use of deep includes in queries</li>
                <li>• Use pagination for large result sets</li>
                <li>• Cache frequently accessed data</li>
                <li>• Use select to fetch only needed fields</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
