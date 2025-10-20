'use client'
import { useState } from 'react'
import { ArrowRight, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [walletAddress, setWalletAddress] = useState('')
  const router = useRouter()

  const connectWallet = () => {
    // Simulate wallet connection
    localStorage.setItem('wallet', walletAddress || '0xA2V4...5R68')
    localStorage.setItem('userId', 'user1')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to DecentralChat
        </h1>
        
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Wallet size={20} />
            Connect Wallet
          </button>
          
          <div className="text-center text-gray-500">OR</div>
          
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={connectWallet}
            className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
