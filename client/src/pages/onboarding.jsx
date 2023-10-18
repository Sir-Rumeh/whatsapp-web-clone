import React, { useEffect, useState } from "react";
import Image from "next/image";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Loader from "@/components/common/Loader";

function onboarding() {
	const router = useRouter();

	const [{ userInfo, newUser }, dispatch] = useStateProvider();
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [detailsValidated, setDetailsValidated] = useState(true);
	const [image, setImage] = useState("/default_avatar.png");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!newUser && !userInfo?.email) router.push("/login");
		else if (!newUser && userInfo?.email) router.push("/");
	}, [newUser, userInfo, router]);

	const onboardUserHandler = async () => {
		if (validateDetails()) {
			setDetailsValidated(true);
			const email = userInfo.email;
			try {
				setLoading(true);
				const { data } = await axios.post(ONBOARD_USER_ROUTE, {
					email,
					name,
					about,
					image,
				});
				if (data.status) {
					dispatch({
						type: reducerCases.SET_NEW_USER,
						newUser: false,
					});
					dispatch({
						type: reducerCases.SET_USER_INFO,
						userInfo: {
							id: data.user.id,
							name,
							email,
							profileImage: image,
							status: about,
						},
					});
					router.push("/");
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

	const validateDetails = () => {
		if (name.length < 3) {
			return false;
		}
		return true;
	};

	return (
		<>
			{loading ? (
				<div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
					<Loader loading={loading} />
				</div>
			) : (
				<div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
					<div className="flex items-center justify-center gap-2">
						<Image
							src="/whatsapp.gif"
							alt="whatsapp"
							height={300}
							width={300}
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<span className="text-7xl">Whatsapp</span>
					</div>
					<h2 className="text-2xl">Create your profile</h2>
					<div className="flex gap-6 mt-6">
						<div className="flex flex-col items-center justify-center mt-5 gap-6">
							<div>
								<Input name="Display Name" state={name} setState={setName} label />
								{!detailsValidated && (
									<p className="text-red-400">Display name / Username is required</p>
								)}
							</div>
							<Input name="About" state={about} setState={setAbout} label />
							<div className="flex items-center justify-center">
								<button
									className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
									onClick={onboardUserHandler}
								>
									Create Profile
								</button>
							</div>
						</div>
						<div>
							<Avatar type="xl" image={image} setImage={setImage} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default onboarding;
