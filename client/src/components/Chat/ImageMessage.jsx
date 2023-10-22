import { useStateProvider } from "@/context/StateContext";
import { DELETE_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ImageMessage({ message }) {
	const [{ currentChatUser, userInfo, socket, messages }, dispatch] = useStateProvider();
	const [showImage, setShowImage] = useState(false);
	const [isSender, setIsSender] = useState(false);

	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX - 43, y: e.pageY });
	};

	const deleteMessage = async () => {
		try {
			const updateMessage = (msg) => {
			  return msg.id !== message.id;
			}
			dispatch({ type: reducerCases.SET_MESSAGES, messages:messages.filter(updateMessage)});
			const {
				data: { deletedMessage },
			} = await axios.delete(`${DELETE_MESSAGE_ROUTE}/${message.id}/${userInfo?.id}/${currentChatUser?.id}`);
			if (deletedMessage) {
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
				className={`p-1 rounded-lg ${
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
				<div id="message-box" className="relative">
					<Image
						id="message-box"
						src={`${HOST}/${message.message}`}
						className="rounded-lg h-auto max-w-full aspect-auto cursor-pointer"
						alt="asset"
						height={0}
						width={0}
						style={{ width: "300px", height: "300px" }}
						loading="lazy"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						onClick={() => setShowImage(true)}
					/>
					<div className="absolute bottom-1 right-1 flex items-end gap-1">
						<span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
							{calculateTime(message.createdAt)}
						</span>
						<span>
							{message.senderId === userInfo?.id && (
								<MessageStatus messageStatus={message.messageStatus} />
							)}
						</span>
					</div>
				</div>
			</div>
			{showImage && (
				<div
					className="fixed inset-0 w-full h-[100vh] flex items-center justify-center z-40"
					onClick={() => setShowImage(false)}
				>
					<Image
						src={`${HOST}/${message.message}`}
						className="rounded-sm z-50 absolute right-0 mr-14"
						alt="asset"
						height={0}
						width={0}
						style={{ width: "1000px", height: "550px" }}
						loading="lazy"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						onClick={() => setShowImage(false)}
					/>
				</div>
			)}

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

export default ImageMessage;
