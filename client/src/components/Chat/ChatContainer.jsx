import { useStateProvider } from "@/context/StateContext";
import React, { useState, useEffect, useRef } from "react";
import ImageMessage from "./ImageMessage";
import TextMessage from "./TextMessage";
import dynamic from "next/dynamic";
import { GET_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import Loader from "../common/Loader";

const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
	const [{ messages, userInfo, currentChatUser, refreshChatList }, dispatch] = useStateProvider();
	const bottomRef = useRef(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getMessages = async () => {
			try {
				setLoading(true);
				const {
					data: { messages },
				} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
				dispatch({ type: reducerCases.SET_MESSAGES, messages });
				setLoading(false);
			} catch (err) {
				setLoading(false);
				return Promise.reject(err);
			}
		};
		if (currentChatUser?.id) {
			getMessages();
		}
	}, [currentChatUser, refreshChatList]);

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
					{loading ? (
						<div className="flex items-center justify-center h-[80vh] w-full ">
							<Loader loading={loading} />
						</div>
					) : (
						<div className="flex flex-col justify-end w-full gap-[6px] overflow-auto relative">
							{messages?.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.senderId === currentChatUser?.id
											? "justify-start"
											: "justify-end"
									}`}
								>
									{message.type === "text" && <TextMessage message={message} />}
									{message.type === "image" && <ImageMessage message={message} />}
									{message.type === "audio" && <VoiceMessage message={message} />}
								</div>
							))}
						</div>
					)}
					<div ref={bottomRef} />
				</div>
			</div>
		</div>
	);
}

export default ChatContainer;
