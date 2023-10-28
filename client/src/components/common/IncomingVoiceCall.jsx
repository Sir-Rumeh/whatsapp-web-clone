import React, { useState, useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";

function IncomingCall() {
	const [{ incomingVoiceCall, socket }, dispatch] = useStateProvider();
	const [ringtone] = useState(new Audio("/call-sound.mp3"));

	useEffect(() => {
		ringtone.play();
		socket?.addEventListener("message", function (event) {
			const eventData = event.data.toString();
			const parsedData = JSON.parse(eventData);
			if (parseInt(parsedData.sendTo) === userInfo?.id) {
				if (parsedData.type === "call-terminated") {
					ringtone.pause();
					ringtone.currentTime = 0;
				}
			}
		});
		// socket?.current.on("call-terminated", () => {
		// 	ringtone.pause();
		// 	ringtone.currentTime = 0;
		// });
	}, []);

	const acceptCall = () => {
		ringtone.pause();
		ringtone.currentTime = 0;
		dispatch({
			type: reducerCases.SET_VOICE_CALL,
			voiceCall: { ...incomingVoiceCall, type: "in-coming" },
		});
		// socket?.current.emit("accept-incoming-call", { id: incomingVoiceCall.id });
		dispatch({
			type: reducerCases.SET_INCOMING_VOICE_CALL,
			incomingVoiceCall: undefined,
		});
	};

	const rejectCall = () => {
		ringtone.pause();
		ringtone.currentTime = 0;
		// socket?.current.emit("reject-voice-call", { from: incomingVoiceCall.id });
		dispatch({
			type: reducerCases.SET_INCOMING_VOICE_CALL,
			incomingVoiceCall: undefined,
		});
		dispatch({ type: reducerCases.END_CALL });
	};

	return (
		<div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
			<div className="h-[70px] relative">
				<Image
					src={
						incomingVoiceCall?.profilePicture
							? incomingVoiceCall?.profilePicture
							: "/default_avatar.png"
					}
					alt="avatar"
					height={0}
					width={0}
					style={{ width: "70px", height: "100%" }}
					className="rounded-full"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<div>
				<div>{incomingVoiceCall.name}</div>
				<div className="text-xs">Incoming Video Call</div>
				<div className="flex gap-2 mt-2">
					<button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>
						Reject
					</button>
					<button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
						Accept
					</button>
				</div>
			</div>
		</div>
	);
}

export default IncomingCall;
