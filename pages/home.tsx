import { useDisconnect, useIsConnected } from '@/contexts/Beacon'
import { useContract } from '@/contexts/Contract'
import { useTezosToolkit } from '@/contexts/Taquito'
import useFetchNFTs, { INFT } from '@/hooks/useFetchNFTs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [selectedNFT, setSelectedNFT] = useState<null | INFT>(null)
  const isConnected = useIsConnected()()
  const disconnect = useDisconnect()
  const router = useRouter()
  const { nftList } = useFetchNFTs()
  const smallCardOnClickHandler = (addr: INFT) => () => {
    setSelectedNFT(addr)
  }

  const clearSelected = () => {
    setSelectedNFT(null)
  }

  const homeContent = () => {
    if (selectedNFT) {
      return <DetailPage clear={clearSelected} nft={selectedNFT} />
    }
    return (
      <>
        <div className="flex justify-center py-5 relative">
          <Image src={'/logo.svg'} alt="LFDINE" width={102} height={29} />
          <button
            onClick={() => {disconnect()}}
            className='rounded-md px-2 bg-red-500 text-white absolute right-0 inset-y-3 text-sm'
          >Disconnect</button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {nftList &&
            nftList.map((item, idx) => (
              <SmallCard
                key={idx}
                img={item.img}
                name={item.name}
                price={0.25}
                onclick={smallCardOnClickHandler(item)}
              />
            ))}
        </div>
      </>
    )
  }

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])
  return (
    <div className="bg-[#F7F9FB] font-dm-sans overflow-auto">
      <div className="max-w-sm mx-auto w-full flex flex-col px-3 py-2 min-h-screen">
        {homeContent()}
      </div>
    </div>
  )
}

const SmallCard = ({
  name,
  img,
  price,
  onclick,
}: {
  name: string
  img: string
  price: number
  onclick: () => void
}) => (
  <button
    onClick={onclick}
    className="bg-white rounded-lg p-2 flex justify-center"
  >
    <div className="flex flex-col gap-3">
      <div className="rounded-lg relative h-[145px] w-[145px]">
        <Image alt="nft" src={img} fill className="object-cover rounded-lg" />
      </div>
      <div className="flex flex-col gap-2 self-start items-start">
        <h2 className="font-bold leading-3">{name}</h2>
        <div className="flex items-center gap-1">
          <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E9F0FF]">
            <Image src="/tezos.svg" alt="tezos" width={15} height={18} />
          </div>
          <h4 className="text-[#0D61FF] font-bold text-xs leading-3">
            {price} XTZ
          </h4>
        </div>
      </div>
    </div>
  </button>
)

const DetailPage = ({ nft, clear }: { nft: INFT; clear: () => void }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [qrCode, setQrCode] = useState<null | string>(null)
  const { generate } = useFetchNFTs()
  return (
    <>
      <div className="relative flex justify-center font-bold text-lg leading-5">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={clear}
            className="rounded-full bg-white h-8 w-8 inset-y-0 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        <h2 className="py-5">{nft.name}</h2>
      </div>
      <div className="p-4 rounded-lg bg-white flex justify-center gap-8">
        <div className="flex flex-col gap-8 items-start">
          <div className="relative h-[300px] w-[300px]">
            <Image
              src={nft.img}
              alt={nft.name}
              fill
              className="object-cover w-full rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2 self-start items-start">
            <h2 className="font-bold leading-3">{nft.name}</h2>
            <div className="flex items-center gap-1">
              <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E9F0FF]">
                <Image src="/tezos.svg" alt="tezos" width={15} height={18} />
              </div>
              <h4 className="text-[#0D61FF] font-bold text-xs leading-3">
                {'N/A'} XTZ
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold leading-5">Description</h4>
            <p className="font-medium text-sm leading-5">{nft.description}</p>
          </div>
          {qrCode ? (
            <div className="relative h-400 w-full">
              <Image alt="nft" src={qrCode} fill></Image>
            </div>
          ) : (
            <button
              onClick={() => {
                generate(nft.id).then((code) => {
                  setQrCode(code)
                }).catch(console.log)
              }}
              className="bg-[#3D00B7] rounded-2xl py-4 flex justify-center w-full text-white font-semibold text-sm leading-4"
            >
              Redeem
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
