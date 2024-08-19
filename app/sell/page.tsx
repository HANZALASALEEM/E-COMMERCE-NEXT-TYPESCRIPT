"use client"
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
function Sell() {
	const router = useRouter()
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [brand, setBrand] = useState<string>("");
	const [sellerName, setSellerName] = useState<string>("");
	const [price, setPrice] = useState<number>(0);

	const handleSellProduct = async (e: FormEvent<HTMLFormElement>) => {
        // e: React.ChangeEvent<HTMLInputElement>
        // e: FormEvent<HTMLFormElement>
		e.preventDefault();
		try {
			const response = await fetch("/api/sellProduct", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, description, brand, sellerName, price }),
			});

			if (response.status === 201) {
				const data = await response.json();
				alert("New Product Added In Database")
			} else {
				console.log(response.status);
				console.log("Product not saved in DB");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleGoHome = () => {
        router.back()
		
	};
	return (
		<div className="w-screen h-screen">
			<div className="w-3/4 h-3/4 mx-auto lg:w-1/3">
				{/* logo */}
				<div className="w-64 h-16 mx-auto">
					
                    <Image src="/images/amazon-logo.png" alt="amazon logo" width={128} height={64} className="mx-auto py-4"/>
				</div>
				{/* container */}
				<div className="py-6 px-4 border-2 border-gray-300 rounded-xl">
					<h1 className="text-2xl mb-2 font-semibold">Sell Something</h1>

					<form
						className="flex flex-col"
						onSubmit={handleSellProduct}
					>
						<label className="text-sm font-semibold py-1">Title</label>
						<input
							type="text"
							className="rounded-sm border-2"
							required
							onChange={(e) => setTitle(e.target.value)}
						/>
						<label className="text-sm font-semibold py-1">Description</label>
						<input
							type="text"
							className="rounded-sm border-2"
							required
							onChange={(e) => setDescription(e.target.value)}
						/>
						<label className="text-sm font-semibold py-1">Brand</label>
						<input
							type="text"
							className="rounded-sm border-2"
							required
							onChange={(e) => setBrand(e.target.value)}
						/>
						<label className="text-sm font-semibold py-1">Seller Name</label>
						<input
							type="text"
							className="rounded-sm border-2"
							required
							onChange={(e) => setSellerName(e.target.value)}
						/>
						<label className="text-sm font-semibold py-1">Price</label>
						<input
							type="number"
							className="rounded-sm border-2"
							required
							onChange={(e) => setPrice(parseInt(e.target.value))}
						/>
						<button
							className="bg-yellow-500 my-2 text-sm py-1 rounded-sm"
							type="submit"
						>
							Continue
						</button>
					</form>
				</div>

				{/* Sign In Button */}
				<div className="w-full">
					<button
						className="bg-white border-gray-400 border-2 rounded-xl my-2 text-sm py-1 rounded-sm w-full"
						onClick={handleGoHome}
					>
						Back to Home
					</button>
				</div>
			</div>
		</div>
	);
}

export default Sell;
