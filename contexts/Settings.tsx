import { NetworkType } from '@airgap/beacon-sdk'
import constate from 'constate'
import { useState } from 'react'

export const [
  SettingsProvider,
  useAppName,
  useEndpoint,
  useNetwork,
  useContractAddress,
] = constate(
  () => {
    const [settings] = useState({
      app_name: 'LFDINE Customer Portal',
      endpoint:
				process.env.NEXT_PUBLIC_ENV === "DEV"
					? "https://ghostnet.ecadinfra.com"
					: "https://mainnet.api.tez.ie",
			network:
				process.env.NEXT_PUBLIC_ENV === "DEV"
					? NetworkType.GHOSTNET
					: NetworkType.MAINNET,
      contract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        : 'KT1H9kCFuVDCA3kCXgStentobimFVeitbq8A',
    })
    return settings
  },
  (v) => v.app_name,
  (v) => v.endpoint,
  (v) => v.network,
  (v) => v.contract
)
