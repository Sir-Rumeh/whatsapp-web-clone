import React, { useState, useEffect } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactsPage = false }) {
	const [{ userInfo, messageSearch, contactsPage, refreshChatList }, dispatch] = useStateProvider();
	const [unreadMessages, setUnreadMessages] = useState(0);
	const handleContactClick = () => {
		data.totalUnreadMessages = 0;
		setUnreadMessages(0);
		if (!isContactsPage) {
			dispatch({
				type: reducerCases.CHANGE_CURRENT_CHAT_USER,
				user: {
					name: data.name,
					about: data.about,
					profilePicture: data.profilePicture,
					email: data.email,
					id: userInfo?.id === data.senderId ? data.receiverId : data.senderId,
				},
			});
		} else {
			dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: { ...data } });
		}
		if (contactsPage) {
			dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
		}
		if (messageSearch) {
			dispatch({ type: reducerCases.SET_MESSAGE_SEARCH });
		}
	};
	useEffect(() => {
		setUnreadMessages(data.totalUnreadMessages);
	}, [refreshChatList]);
	return (
		<div
			className={`flex cursor-pointer items-center hover:bg-background-default-hover ${
				isContactsPage ? "py-1" : ""
			}`}
			onClick={handleContactClick}
		>
			<div className="min-w-fit px-3 lg:px-5 py-1">
				<Avatar type="lg" image={data?.profilePicture} />
			</div>
			<div className="min-h-full flex flex-col justify-center mt-3 pr-4 w-full ">
				<div className="flex justify-between">
					<div>
						<span className="text-white">{data?.name}</span>
					</div>
					{!isContactsPage && (
						<div>
							<span
								className={`${
									!unreadMessages > 0 ? "text-secondary" : "text-icon-green"
								} text-sm`}
							>
								{calculateTime(data.createdAt)}
							</span>
						</div>
					)}
				</div>
				<div className="flex border-b border-conversation-border pb-2 pt-1 pr-2 ">
					<div className="flex items-center justify-between w-full ">
						<span className="text-secondary line-clamp-1 text-sm ">
							{isContactsPage ? (
								data?.about || "\u00A0"
							) : (
								<div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px] ">
									{data.senderId === userInfo?.id && (
										<MessageStatus messageStatus={data.messageStatus} />
									)}
									{data.type === "text" && (
										<span className="truncate md:-pr-4 w-[9rem]">{data.message}</span>
									)}
									{data.type === "image" && (
										<span className="flex gap-1 items-center">
											<FaCamera className="text-panel-header-icon" />
											Image
										</span>
									)}
									{data.type === "audio" && (
										<span className="flex gap-1 items-center">
											<FaMicrophone className="text-panel-header-icon" />
											Audio
										</span>
									)}
								</div>
							)}
						</span>
						{unreadMessages > 0 ? (
							<span className="bg-icon-green px-[5px] rounded-full text-sm">{unreadMessages}</span>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatLIstItem;
