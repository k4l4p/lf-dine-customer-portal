import { BeaconProvider } from '@/contexts/Beacon'
import { ContractProvider } from '@/contexts/Contract'
import { ModalProvider } from '@/contexts/Modal'
import { SettingsProvider } from '@/contexts/Settings'
import { TaquitoProvider } from '@/contexts/Taquito'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NoSSR from 'react-no-ssr'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      <ModalProvider>
        <SettingsProvider>
          <TaquitoProvider>
            <BeaconProvider>
              <ContractProvider>
                <Component {...pageProps} />
              </ContractProvider>
            </BeaconProvider>
          </TaquitoProvider>
        </SettingsProvider>
      </ModalProvider>
    </NoSSR>
  )
}
