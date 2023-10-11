import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef } from "react";
import ImageMessage from "./ImageMessage";
import TextMessage from "./TextMessage";
import dynamic from "next/dynamic";

const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
	const [{ messages, currentChatUser, userInfo, socket }, dispatch] = useStateProvider();
	const bottomRef = useRef(null);

	useEffect(() => {
		if (messages.length) {
			bottomRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [messages.length]);

	return (
		<div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
			<div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
			<div className="m-6 relative bottom-0 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-[6px] overflow-auto relative">
						{messages?.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.senderId === currentChatUser?.id ? "justify-start" : "justify-end"
								}`}
							>
								{message.type === "text" && <TextMessage message={message} />}
								{message.type === "image" && <ImageMessage message={message} />}
								{message.type === "audio" && <VoiceMessage message={message} />}
							</div>
						))}
					</div>
					<div ref={bottomRef} />
				</div>
			</div>
		</div>
	);
}

export default ChatContainer;
