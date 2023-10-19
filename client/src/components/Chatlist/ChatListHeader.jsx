import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useRouter } from "next/router";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ChatListHeader() {
	const router = useRouter();
	const [{ socket, userInfo }, dispatch] = useStateProvider();

	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX - 63, y: e.pageY + 38 });
		setIsContextMenuVisible(true);
	};

	const contextMenuOptions = [
		{
			name: "Logout",
			callback: async () => {
				setIsContextMenuVisible(false);
				socket?.current.emit("logout", userInfo?.id);
				dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
				router.push("/");
			},
		},
	];

	const handleAllContactsPage = () => {
		dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
	};

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center">
			<div className="cursor-pointer">
				<Avatar type="sm" image={userInfo?.profileImage} />
			</div>
			<div className="flex gap-6">
				<BsFillChatLeftTextFill
					className="text-panel-header-icon cursor-pointer text-xl"
					title="New Chat"
					onClick={handleAllContactsPage}
				/>
				<BsThreeDotsVertical
					className="text-panel-header-icon cursor-pointer text-xl"
					title="Menu"
					id="context-opener"
					onClick={(e) => showContextMenu(e)}
				/>

				{isContextMenuVisible ? (
					<ContextMenu
						options={contextMenuOptions}
						cordinates={contextMenuCordinates}
						contextMenu={isContextMenuVisible}
						setContextMenu={setIsContextMenuVisible}
					/>
				) : null}
			</div>
		</div>
	);
}

export default ChatListHeader;
