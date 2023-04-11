import { useIsConnected } from '@/contexts/Beacon'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ntfs = [
  {
    name: 'test1',
    img: '/logo.svg',
    price: 0.25,
    addr: 'fadsfdsaf',
  },
]

const Home = () => {
  const [selectedNFT, setSelectedNFT] = useState<null | string>(null)
  const isConnected = useIsConnected()()
  const router = useRouter()
  const smallCardOnClickHandler = (addr: string) => () => {
    setSelectedNFT(addr)
  }

	useEffect(()=> {
		if (!isConnected) {
      router.push('/')
    }
	}, [isConnected, router])
  return (
    <div className="bg-[#F7F9FB] font-dm-sans">
      <div className="max-w-sm mx-auto w-full flex flex-col px-3 py-2 h-screen">
        <div className="flex justify-center py-5">
          <Image src={'/logo.svg'} alt="LFDINE" width={102} height={29} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {ntfs.map((item, idx) => (
            <SmallCard
              key={idx}
              img={item.img}
              name={item.name}
              price={item.price}
              onclick={smallCardOnClickHandler(item.addr)}
            />
          ))}
        </div>
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
    className="bg-white rounded-lg p-2 flex flex-col gap-3 items-center"
  >
    <div className="rounded-lg relative h-[145px] w-[145px]">
      <Image alt="nft" src={img} fill />
    </div>
    <div className="flex flex-col gap-2 self-start">
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
  </button>
)

export default Home
