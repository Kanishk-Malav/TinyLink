'use client'

import { useState } from 'react'

interface Link {
  id: string
  code: string
  targetUrl: string
  clicks: number
  createdAt: string
}

interface LinkTableProps {
  links: Link[]
  onLinkDeleted: () => void
}

export default function LinkTable({ links, onLinkDeleted }: LinkTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (code: string, id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete link')
      }

      onLinkDeleted()
    } catch (err) {
      alert('Failed to delete link')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No links yet. Create your first short link above! 👆</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-indigo-600 font-semibold">
                    /{link.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`)}
                    className="text-gray-400 hover:text-indigo-600"
                    title="Copy link"
                  >
                    📋
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <a
                  href={link.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-900 hover:text-indigo-600 truncate block max-w-md"
                  title={link.targetUrl}
                >
                  {link.targetUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {link.clicks} clicks
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(link.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDelete(link.code, link.id)}
                  disabled={deletingId === link.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {deletingId === link.id ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
