import * as signal from 'libsignal'

class CryptoManager {
  private store: any = {}
  
  async generateKeys() {
    const identity = await signal.IdentityKeyPair.generate()
    const registrationId = signal.RegistrationId.generate()
    const preKey = await signal.PrivateKey.generate()
    const signedPreKey = await signal.PrivateKey.generate()
    
    return {
      identityKey: identity.pubKey,
      registrationId,
      preKeys: [preKey],
      signedPreKey,
    }
  }
  
  encrypt(message: string, theirIdentity: Uint8Array, session: any) {
    const ciphertext = signal.sendMessage(
      session,
      new TextEncoder().encode(message)
    )
    return ciphertext.serialize()
  }
  
  decrypt(ciphertext: any, session: any) {
    const plaintext = signal.receiveMessage(session, ciphertext)
    return new TextDecoder().decode(plaintext)
  }
}

export const crypto = new CryptoManager()
