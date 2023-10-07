import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
	const [{ currentChatUser, userInfo }] = useStateProvider();
	const [showImage, setShowImage] = useState(false);
	return (
		<>
			<div
				className={`p-1 rounded-lg ${
					message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"
				}`}
			>
				<div className="relative">
					<Image
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
							{message.senderId === userInfo.id && (
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
		</>
	);
}

export default ImageMessage;
