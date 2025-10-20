'use client'
import { useState } from 'react'
import ServerList from '@/components/ServerList'
import ChatWindow from '@/components/ChatWindow'
import CreateServer from '@/components/CreateServer'

export default function Home() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [users, setUsers] = useState(['user1', 'user2', 'user3'])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ServerList onSelectServer={setSelectedServer} />
      
      {selectedServer ? (
        <ChatWindow 
          serverId={selectedServer} 
          users={users}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <CreateServer onCreate={setSelectedServer} />
        </div>
      )}
    </div>
  )
}
