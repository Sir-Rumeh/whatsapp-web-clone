import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
	const [{ messages, currentChatUser, userInfo }] = useStateProvider();
	return (
		<div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
			<div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
			<div className="m-6 relative bottom-0 z-40 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-1 overflow-auto">
						{messages.map((message, index) => (
							<div
								key={message.id}
								className={`flex ${
									message.senderId === currentChatUser?.id ? "justify-start" : "justify-end"
								}`}
							>
								{message.type === "text" && (
									<div
										className={`text-white px-3 pb-[11px] pt-[9px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
											message.senderId === currentChatUser?.id
												? "bg-incoming-background"
												: "bg-outgoing-background"
										}`}
									>
										<div className="break-all">{message.message}</div>
										<div
											className={`flex gap-1 translate-y-[2.5%] ${
												message?.message.length > 70
													? "absolute right-2 bottom-2"
													: ""
											} items-center`}
										>
											<span className="text-bubble-meta text-[11px] min-w-fit">
												{calculateTime(message.createdAt)}
											</span>
											<span>
												{message.senderId === userInfo.id && (
													<MessageStatus messageStatus={message.messageStatus} />
												)}
											</span>
										</div>
									</div>
								)}
								{message.type === "image" && <ImageMessage message={message} />}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatContainer;
