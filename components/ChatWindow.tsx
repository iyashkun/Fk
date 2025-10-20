'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { crypto } from '@/lib/crypto'
import { webrtc } from '@/lib/webrtc'

export default function ChatWindow({ 
  serverId, 
  channelId = 'general',
  users 
}: any) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    // Load encrypted messages from IPFS
    const messageCids = localStorage.getItem(`${serverId}-${channelId}`)?.split(',') || []
    const decryptedMessages = await Promise.all(
      messageCids.map(async (cid) => {
        const data = await getFromIPFS(cid)
        return {
          ...data,
          content: await crypto.decrypt(data.encrypted, data.session)
        }
      })
    )
    setMessages(decryptedMessages)
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const encrypted = await crypto.encrypt(input, null, null)
    const message = {
      id: Date.now(),
      content: input,
      encrypted,
      timestamp: Date.now(),
      author: 'user1', // Get from auth
      channelId,
    }

    // Store on IPFS
    const cid = await uploadToIPFS(message)
    localStorage.setItem(
      `${serverId}-${channelId}`,
      localStorage.getItem(`${serverId}-${channelId}`)
        ? `${localStorage.getItem(`${serverId}-${channelId}`)},${cid}`
        : cid
    )

    // Send via WebRTC to all peers
    users.forEach((userId: string) => {
      webrtc.getPeer(userId)?.send(JSON.stringify(message))
    })

    setMessages([...messages, message])
    setInput('')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">#{channelId}</h2>
          <span className="ml-2 text-gray-500">({users.length})</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="p-2 text-blue-600 hover:text-blue-800"
          >
            <Send size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Paperclip size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
