import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function TextMessage({ message }) {
	const [{ currentChatUser, userInfo }] = useStateProvider();
	return (
		<div
			className={`text-white px-3 pb-[11px] pt-[9px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
				message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"
			}`}
		>
			<div className="break-all">{message.message}</div>
			<div
				className={`flex gap-1 translate-y-[2.5%] ${
					message?.message.length > 70 ? "absolute right-2 bottom-2" : ""
				} items-center`}
			>
				<span className="text-bubble-meta text-[11px] min-w-fit">{calculateTime(message.createdAt)}</span>
				<span>
					{message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
				</span>
			</div>
		</div>
	);
}

export default TextMessage;
