import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import Input from "@/components/common/Input";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { BiLogInCircle } from "react-icons/bi";
import Loader from "@/components/common/Loader";

function login() {
	const router = useRouter();
	const [{ userInfo, newUser }, dispatch] = useStateProvider();
	const [userName, setUserName] = useState("");
	const [detailsValidated, setDetailsValidated] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (userInfo?.id && !newUser) router.push("/home");
	}, [userInfo, newUser]);

	const validateDetails = () => {
		if (userName.length < 3) {
			return false;
		}
		return true;
	};

	const handleLogin = async () => {
		if (validateDetails()) {
			setDetailsValidated(true);
			try {
				setLoading(true);
				const { data } = await axios.post(CHECK_USER_ROUTE, {
					email: `${userName.replace(" ", "")}@gmail.com`,
				});
				if (!data.status) {
					dispatch({
						type: reducerCases.SET_NEW_USER,
						newUser: true,
					});
					dispatch({
						type: reducerCases.SET_USER_INFO,
						userInfo: {
							name: userName,
							email: `${userName}@mail.com`,
							profileImage: "",
							status: "",
						},
					});
					router.push("/onboarding");
				} else {
					const { id, name, email, profilePicture: profileImage, status } = data.data;
					dispatch({
						type: reducerCases.SET_USER_INFO,
						userInfo: {
							id,
							name,
							email,
							profileImage,
							status,
						},
					});
					router.push("/home");
				}
				setLoading(false);
			} catch (err) {
				setLoading(false);
				return Promise.reject(err);
			}
		} else {
			setDetailsValidated(false);
		}
	};
	return (
		<>
			{loading ? (
				<div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col">
					<Loader loading={loading} />
				</div>
			) : (
				<div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
					<div className="md:flex items-center justify-center gap-2 text-white">
						<Image
							src="/whatsapp.gif"
							alt="Whatsapp"
							height={300}
							width={300}
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="scale-75 md:scale-100"
						/>
						<span className="flex justify-center w-full text-center text-5xl md:text-7xl">
							Whatsapp
						</span>
					</div>
					<div className="mt-2">
						<Input name="Enter username to continue" state={userName} setState={setUserName} label />
						{!detailsValidated && <p className="text-red-400">Username is required</p>}
					</div>
					<button
						className="flex items-center justify-center gap-4 bg-search-input-container-background p-3 md:p-5 rounded-lg"
						onClick={handleLogin}
					>
						<BiLogInCircle className="text-4x1 text-teal-light text-3xl" />

						<span className="text-white text-2x1">Login to your Account</span>
					</button>
				</div>
			)}
		</>
	);
}

export default login;
