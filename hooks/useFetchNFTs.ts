import { useWalletAddress } from '@/contexts/Beacon'
import { useContractAddress } from '@/contexts/Settings'
import React, { useEffect, useState } from 'react'

export interface INFT {
  id: string
  name: string
  creator: string[]
  img: string
  description: string
}

export interface Res {
  success: boolean
  response: NFTres[]
}

export interface NFTres {
  id: number
  account: Account
  token: Token
  balance: string
  transfersCount: number
  firstLevel: number
  firstTime: Date
  lastLevel: number
  lastTime: Date
}

export interface Token {
  id: number
  contract: Account
  tokenId: string
  standard: string
  totalSupply: string
  metadata: string
}

export interface Metadata {
  name: string
  symbol: Symbol
  creators: string[]
  decimals: string
  displayUri: string
  artifactUri: string
  description: string
  thumbnailUri: string
  is_transferable: boolean
  shouldPreferSymbol: boolean
}

export interface Account {
  address: string
}

export interface QRCode_res {
  success: boolean
  response: string
}

const useFetchNFTs = () => {
  const userAddr = useWalletAddress() ?? ''
  const contractAddr = useContractAddress()
  const [nftList, setNftList] = useState<INFT[] | null>(null)
  const endpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:8000'
  const ipfsEndpoint =
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ?? 'https://cloudflare-ipfs.com/ipfs/'
  const generate = async (id: string) => {
    const tokenId = Number.parseInt(id)
    const body = JSON.stringify({
      address: userAddr,
      tokenId,
    })
    const req = new Request(endpoint + '/qr/generate', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    })
    const res = await fetch(req)
    if (!res.ok) throw new Error('Cannot connect backend')
    const res_body = (await res.json()) as QRCode_res
    return res_body.response
  }

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!userAddr) return
      const url = `${endpoint}/user/listNft?address=${userAddr}`
      const res = await fetch(url, {
        headers: {
          'Content-Type': ' application/json',
        },
      })

      if (!res.ok) throw new Error('Network Error')
      const nfts = (await res.json()) as Res
      const wrapper = nfts.response.map(async (item) => {
        const res = await fetch(
          item.token.metadata.replace('ipfs://', ipfsEndpoint)
        )
        if (!res.ok) return null
        const body = (await res.json()) as Metadata
        return body
      })
      const metaRes = (await Promise.all(wrapper)) as Array<Metadata | null>
      const formatted: INFT[] = metaRes
        .filter((item): item is Metadata => item !== null)
        .map((item, idx) => ({
          id: nfts.response[idx].token.tokenId,
          name: item.name,
          creator: item.creators,
          description: item.description,
          img: item.displayUri.replace('ipfs://', ipfsEndpoint),
        }))
      console.log(formatted)
      setNftList(formatted)
    }
    fetchNFTs().catch(console.log)
  }, [])

  return { nftList, generate }
}

export default useFetchNFTs
