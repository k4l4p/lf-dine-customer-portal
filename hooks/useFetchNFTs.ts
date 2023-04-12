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
  metadata: Metadata
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

const useFetchNFTs = () => {
  const userAddr = useWalletAddress()
  const contractAddr = useContractAddress()
  const [nftList, setNftList] = useState<INFT[] | null>(null)
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!userAddr) return
      const url = new URL(process.env.NEXT_PUBLIC_INDEXER ?? 'https://api.ghostnet.tzkt.io/v1/tokens/balances')
      url.searchParams.set('account', userAddr)
      url.searchParams.set('token.contract', contractAddr)
      url.searchParams.set('token.metadata.displayUri.null', 'false')
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network Error')
      const nfts = await res.json() as NFTres[]
      const formatted: INFT[] = nfts.map(item =>  ({
					id: item.token.tokenId,
					name: item.token.metadata.name,
					creator: item.token.metadata.creators,
					description: item.token.metadata.description,
					img: item.token.metadata.displayUri.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_ENDPOINT ?? 'https://cloudflare-ipfs.com/ipfs/')
				})
			)
			setNftList(formatted)
    }
    fetchNFTs().catch(console.log)
  }, [])

  return nftList
}

export default useFetchNFTs
