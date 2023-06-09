import { useDisconnect, useIsConnected } from "@/contexts/Beacon"
import { useContract } from "@/contexts/Contract"
import { useTezosToolkit } from "@/contexts/Taquito"
import useFetchNFTs, { INFT } from "@/hooks/useFetchNFTs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

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
					<Image src={"/logo.svg"} alt="LFDINE" width={102} height={29} />
					<button
						onClick={() => {
							disconnect()
						}}
						className="rounded-md px-2 bg-red-500 text-white absolute right-0 inset-y-3 text-sm"
					>
						Disconnect
					</button>
				</div>
				<div className="grid grid-cols-2 gap-x-4 gap-y-8">
					{nftList ? (
						nftList.length > 0 ? (
							nftList.map((item, idx) => (
								<SmallCard
									key={idx}
									img={item.img}
									name={item.name}
									price={0.25}
									onclick={smallCardOnClickHandler(item)}
								/>
							))
						) : (
							<div className="flex flex-col gap-3 items-center col-span-2">
								<Image
									alt="participate now!"
									src={"/sad.png"}
									height={80}
									width={80}
								/>
								<h3 className="text-lg font-semibold">
									Currently you do not own any valid NFTs.
								</h3>
								<p className="text-sm text-center">
									Please participate in one of our lucky draw for a chance to
									win a LFDine NFT.🥳
								</p>
								<div className="flex flex-col gap-2 items-center">
									<Link
										target={"_blank"}
										rel={"noreferrer"}
										className="text-gray-600 text-sm underline"
										href={"https://lfdine.com/poc/thepizzaproject"}
									>
										Pizza Project
									</Link>
									<Link
										target={"_blank"}
										rel={"noreferrer"}
										className="text-gray-600 text-sm underline"
										href={"https://lfdine.com/poc/woodlands"}
									>
										Woodlands
									</Link>
									<Link
										target={"_blank"}
										rel={"noreferrer"}
										className="text-gray-600 text-sm underline"
										href={"https://lfdine.com/poc/mrmaki"}
									>
										Mr. Maki
									</Link>
								</div>
							</div>
						)
					) : (
						<div className="col-span-2 h-20 flex flex-col justify-center items-center">
							<svg
								className="h-full"
								version="1.1"
								id="L9"
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								x="0px"
								y="0px"
								viewBox="0 0 100 100"
								enable-background="new 0 0 0 0"
								xmlSpace="preserve"
							>
								<path
									fill="#3D00B7"
									d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
								>
									<animateTransform
										attributeName="transform"
										attributeType="XML"
										type="rotate"
										dur="1s"
										from="0 50 50"
										to="360 50 50"
										repeatCount="indefinite"
									/>
								</path>
							</svg>
							<p className="w-fit">Loading...</p>
						</div>
					)}
				</div>
			</>
		)
	}

	useEffect(() => {
		if (!isConnected) {
			router.push("/")
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
	const [isLoading, setIsLoading] = useState(false)
	const [qrCode, setQrCode] = useState<null | string>(null)
	const { generate } = useFetchNFTs()

	const [error, setError] = useState<null | string>(null)
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
								{"N/A"} XTZ
							</h4>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h4 className="font-bold leading-5">Description</h4>
						<p className="font-medium text-sm leading-5">{nft.description}</p>
					</div>
					{error ? (
						<div className="text-center text-red-400">{error}</div>
					) : qrCode ? (
						<div className="relative h-[200px] w-full">
							<Image
								className="object-contain"
								alt="nft"
								src={qrCode}
								fill
							></Image>
						</div>
					) : (
						<button
							onClick={() => {
								setIsLoading(true)
								generate(nft.id)
									.then((code) => {
										setIsLoading(false)
										setQrCode(code)
									})
									.catch((err) => {
										console.log(err)
										setError(() => {
											if (err instanceof Error) return err.message
											return "Error occurs"
										})
										setIsLoading(false)
									})
							}}
							className="bg-[#3D00B7] rounded-2xl py-4 flex justify-center w-full text-white font-semibold text-sm leading-4"
						>
							{isLoading ? "Loading..." : "Redeem"}
						</button>
					)}
				</div>
			</div>
		</>
	)
}

export default Home
