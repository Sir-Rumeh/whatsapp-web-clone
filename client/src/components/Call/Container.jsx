import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";

function Container({ data }) {
	const [{ socket, userInfo }, dispatch] = useStateProvider();
	const [callAccepted, setCallAccepted] = useState(false);
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
						className="rounded-full"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			)}
		</div>
	);
}

export default Container;
