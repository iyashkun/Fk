import { Avatar, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function MessageBubble({ message }: any) {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {message.author}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          <MoreVertical size={14} className="text-gray-400" />
        </div>
        <div className={`message-bubble ${
          message.author === 'user1' 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
