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
      app_name: 'My DApp',
      endpoint: 'https://ghostnet.ecadinfra.com',
      network: NetworkType.GHOSTNET,
      contract: 'KT1QTccSn65Syeou2Z9U72wn5bjsRp1BMy66',
    })
    return settings
  },
  (v) => v.app_name,
  (v) => v.endpoint,
  (v) => v.network,
  (v) => v.contract
)
