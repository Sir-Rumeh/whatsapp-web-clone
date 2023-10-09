import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function TextMessage({ message }) {
	const [{ currentChatUser, userInfo }] = useStateProvider();
	const messageLengthBreak = 70;
	return (
		<div
			className={`text-white px-3  ${
				message?.message.length > messageLengthBreak ? "pb-[24px]" : "pb-[11px]"
			} pt-[9px] text-sm rounded-md flex gap-2 items-end max-w-[45%] relative ${
				message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"
			}`}
		>
			<div className="">{message.message}</div>
			<div
				className={`flex gap-1 translate-y-[2.5%] ${
					message?.message.length > messageLengthBreak ? "absolute right-2 bottom-1" : ""
				} items-center`}
			>
				<span className="text-bubble-meta text-[11px] min-w-fit">{calculateTime(message.createdAt)}</span>
				<span className="">
					{message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
				</span>
			</div>
		</div>
	);
}

export default TextMessage;
