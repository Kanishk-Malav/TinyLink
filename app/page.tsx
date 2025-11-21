'use client'

import { useState, useEffect } from 'react'
import LinkForm from '@/components/LinkForm'
import LinkTable from '@/components/LinkTable'

export default function Home() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/links')
      if (!response.ok) throw new Error('Failed to fetch links')
      const data = await response.json()
      setLinks(data.success ? data.data : data)
    } catch (err) {
      setError('Failed to load links')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleLinkCreated = () => {
    fetchLinks()
  }

  const handleLinkDeleted = () => {
    fetchLinks()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔗 TinyLink
          </h1>
          <p className="text-xl text-gray-600">
            Shorten URLs, track clicks, and manage your links
          </p>
        </div>

        {/* Link Creation Form */}
        <div className="mb-12">
          <LinkForm onLinkCreated={handleLinkCreated} />
        </div>

        {/* Links Dashboard */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Your Links
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <LinkTable links={links} onLinkDeleted={handleLinkDeleted} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </main>
  )
}
