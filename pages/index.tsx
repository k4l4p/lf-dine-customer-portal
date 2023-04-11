import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='bg-[#F7F9FB] font-dm-sans'>
      <div className='max-w-sm mx-auto w-full flex flex-col px-3 py-2 h-screen'>
        <div className='flex justify-center py-5'>
          <Image src={'/logo.svg'} alt='LFDINE' width={102} height={29} />
        </div>
        <div className='flex flex-col justify-center items-center gap-8 grow'>
          <Image src={'/front.svg'} alt='front' width={120} height={120} />
          <button className='bg-[#3D00B7] py-4 px-7 text-white rounded-2xl'>
          Connect your wallet
          </button>
        </div>
      </div>
    </div>
  )
}
