declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CONTRACT_ADDRESS: string
      NEXT_PUBLIC_IPFS_ENDPOINT: string
      NEXT_PUBLIC_API_ENDPOINT: string
    }
  }
}

export {}
