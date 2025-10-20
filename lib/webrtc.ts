import Peer from 'simple-peer'

interface PeerConnection {
  peer: Peer.Instance
  userId: string
}

class WebRTCManager {
  private peers: Map<string, PeerConnection> = new Map()
  
  createPeer(userId: string, initiator = false) {
    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    })
    
    this.peers.set(userId, { peer, userId })
    return peer
  }
  
  addPeer(userId: string, stream?: MediaStream) {
    const peer = this.createPeer(userId, true)
    
    peer.on('signal', (data) => {
      // Send offer/answer via IPFS
      this.broadcastSignal(userId, data)
    })
    
    peer.on('data', (data) => {
      console.log('Received:', data.toString())
    })
    
    if (stream) peer.addStream(stream)
  }
  
  async broadcastSignal(to: string, signal: any) {
    // Store signal data on IPFS and notify peer
    const cid = await uploadToIPFS({ to, signal, from: this.localId })
    // Use pub/sub for peer discovery
    await this.notifyPeer(to, cid)
  }
  
  getPeer(userId: string) {
    return this.peers.get(userId)?.peer
  }
}

export const webrtc = new WebRTCManager()
