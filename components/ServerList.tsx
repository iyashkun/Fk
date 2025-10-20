'use client'
import { useState, useEffect } from 'react'
import { Plus, Hash, Users } from 'lucide-react'
import { uploadToIPFS, getFromIPFS } from '@/lib/ipfs'

export default function ServerList({ onSelectServer }: any) {
  const [servers, setServers] = useState<any[]>([])
  const [activeServer, setActiveServer] = useState(null)

  useEffect(() => {
    loadServers()
  }, [])

  const loadServers = async () => {
    // Load from IPFS (decentralized)
    const serverCids = localStorage.getItem('servers')?.split(',') || []
    const serverData = await Promise.all(
      serverCids.map(cid => getFromIPFS(cid))
    )
    setServers(serverData)
  }

  const createServer = async (name: string) => {
    const serverData = {
      id: Date.now().toString(),
      name,
      channels: [{ id: 'general', name: 'general' }],
      members: [],
      created: Date.now(),
    }
    
    const cid = await uploadToIPFS(serverData)
    localStorage.setItem('servers', 
      localStorage.getItem('servers') 
        ? `${localStorage.getItem('servers')},${cid}`
        : cid
    )
    setServers([...servers, serverData])
    onSelectServer(serverData.id)
  }

  return (
    <div className="w-60 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold">Servers</h2>
        <button 
          onClick={() => createServer('New Server')}
          className="mt-2 p-2 bg-green-600 rounded hover:bg-green-700"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {servers.map((server) => (
          <div 
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className={`server-item ${activeServer === server.id ? 'bg-gray-800' : ''}`}
          >
            <Hash size={20} className="mr-3" />
            <span>{server.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
