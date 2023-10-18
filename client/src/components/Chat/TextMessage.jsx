import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import axios from "axios";
import { DELETE_MESSAGE_ROUTE, GET_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import ContextMenu from "../common/ContextMenu";
import { reducerCases } from "@/context/constants";

function TextMessage({ message }) {
	const [{ currentChatUser, userInfo, socket }, dispatch] = useStateProvider();
	const messageLengthBreak = 70;

	const [isSender, setIsSender] = useState(false);
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX - 43, y: e.pageY });
		setIsContextMenuVisible(true);
	};

	const deleteMessage = async () => {
		try {
			const {
				data: { deletedMessage },
			} = await axios.delete(`${DELETE_MESSAGE_ROUTE}/${message.id}/${userInfo?.id}/${currentChatUser?.id}`);
			if (deletedMessage) {
				const getMessages = async () => {
					try {
						const {
							data: { messages },
						} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
						dispatch({ type: reducerCases.SET_MESSAGES, messages });
					} catch (err) {
						return Promise.reject(err);
					}
				};
				if (currentChatUser?.id) {
					getMessages();
				}
				socket?.current.emit("delete-message", { ...deletedMessage });
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const contextMenuOptions = [
		{
			name: "Delete Message",
			callback: async () => {
				deleteMessage();
			},
		},
	];

	return (
		<>
			<div
				id="message-box"
				className={`text-white px-3  ${
					message?.message.length > messageLengthBreak ? "pb-[24px]" : "pb-[11px]"
				} pt-[9px] text-sm rounded-md flex gap-2 items-end max-w-[45%] relative ${
					message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"
				}`}
				onMouseOver={(event) => {
					event.preventDefault();
					if (message.senderId === userInfo?.id) {
						setIsSender(true);
					}
				}}
				onContextMenu={(event) => {
					event.preventDefault();
					if (isSender) {
						showContextMenu(event);
					}
				}}
			>
				<div id="message-box" className="">
					{message.message}
				</div>
				<div
					className={`flex gap-1 translate-y-[2.5%] ${
						message?.message.length > messageLengthBreak ? "absolute right-2 bottom-1" : ""
					} items-center`}
				>
					<span className="text-bubble-meta text-[11px] min-w-fit">
						{calculateTime(message.createdAt)}
					</span>
					<span className="">
						{message.senderId === userInfo.id && (
							<MessageStatus messageStatus={message.messageStatus} />
						)}
					</span>
				</div>
			</div>
			{isContextMenuVisible && (
				<ContextMenu
					options={contextMenuOptions}
					cordinates={contextMenuCordinates}
					contextMenu={isContextMenuVisible}
					setContextMenu={setIsContextMenuVisible}
				/>
			)}
		</>
	);
}

export default TextMessage;
