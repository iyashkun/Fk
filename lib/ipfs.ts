import { create } from 'ipfs-http-client'

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Bearer ${process.env.IPFS_API_KEY}`,
  },
})

export const uploadToIPFS = async (data: any) => {
  const { cid } = await ipfs.add(JSON.stringify(data))
  return cid.toString()
}

export const getFromIPFS = async (cid: string) => {
  const chunks = []
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString())
}
