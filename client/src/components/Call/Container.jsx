import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
	const [{ socket, userInfo }, dispatch] = useStateProvider();
	const [callAccepted, setCallAccepted] = useState(false);
	const [token, setToken] = useState(undefined);
	const [zgVar, setZgVar] = useState(undefined);
	const [localStream, setLocalStream] = useState(undefined);
	const [publicStream, setPublicStream] = useState(undefined);

	useEffect(() => {
		if (data.type === "out-going") socket.current.on("accept-call", () => setCallAccepted(true));
		else {
			setTimeout(() => {
				setCallAccepted(true);
			}, 1000);
		}
	}, [data]);

	useEffect(() => {
		const getToken = async () => {
			try {
				const {
					data: { token: returnedToken },
				} = axios.get(`${GET_CALL_TOKEN}/${userInfo?.id}`);
				setToken(returnedToken);
			} catch (err) {
				console.log(err);
			}
		};
		getToken();
	}, [callAccepted]);

	useEffect(() => {
		const startCall = async () => {
			import("zego-express-engine-webrtc").then(async ({ ZegoExpressEngine }) => {
				const zg = new ZegoExpressEngine(
					process.env.NEXT_PUBLIC_ZEGO_APP_ID,
					process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
				);
				setZgVar(zg);
				zg.on("roomStreamUpdate", async (roomId, updateType, streamList, extendedDate) => {
					if (updateType === "ADD") {
						const rmVideo = document.getElementById("remote-video");
						const vd = document.createElement(data.callType === "video" ? "video" : "audio");
						vd.id = streamList[0].streamID;
						vd.autoplay = true;
						vd.muted = false;
						if (rmVideo) {
							rmVideo.appendChild(vd);
						}
						zg.startPlayingStream(streamList[0].streamID, {
							audio: true,
							video: true,
						}).then((stream) => (vd.srcObject = stream));
					} else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
						zg.destroyStream(localStream);
						zg.stopPublishingStream(streamList[0].streamID);
						zg.logoutRoom(data.roomId.toString());
						dispatch({ type: reducerCases.END_CALL });
					}
				});
			});
		};
	}, [token]);

	const endCall = () => {
		dispatch({ type: reducerCases.END_CALL });
		socket.current.emit("terminate-call", {
			from: data.id,
		});
	};

	return (
		<div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
			<div className="flex flex-col gap-3 items-center">
				<span className="text-5xl">{data.name}</span>
				<span className="text-lg mt-4">
					{callAccepted && data.callType !== "video" ? "On going call" : "Calling"}
				</span>
			</div>
			{(!callAccepted || data.callType === "audio") && (
				<div className="my-24">
					<Image
						src={data.profilePicture}
						alt="avatar"
						height={300}
						width={300}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="rounded-full"
					/>
				</div>
			)}
			<div className="my-5 relative" id="remote-video">
				<div className="absolute bottom-5 right-5" id="local-audio"></div>
			</div>
			<div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
				<MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
			</div>
		</div>
	);
}

export default Container;
