import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatLIstItem({ data, isContactsPage = false }) {
	const [{ userInfo, currentChatUser, messageSearch }, dispatch] = useStateProvider();
	const handleContactClick = () => {
		dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: { ...data } });
		if (isContactsPage) {
			dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
		}
		if (messageSearch) {
			dispatch({ type: reducerCases.SET_MESSAGE_SEARCH });
		}
	};
	return (
		<div
			className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
			onClick={handleContactClick}
		>
			<div className="min-w-fit px-5 pt-3 pb-1">
				<Avatar type="lg" image={data?.profilePicture} />
			</div>
			<div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
				<div className="flex justify-between">
					<div>
						<span className="text-white">{data?.name}</span>
					</div>
				</div>
				<div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
					<div className="flex justify-betweenw-full">
						<span className="text-secondary line-clamp-1 text-sm">{data?.about || "\u00A0"}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatLIstItem;
