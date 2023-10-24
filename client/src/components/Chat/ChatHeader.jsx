import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall, MdArrowBack, MdArrowCircleLeft } from "react-icons/md";
import { IoVideocam, IoArrowBack, IoArrowBackCircle } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

const OnlineStatus = () => {
	return (
		<span className="flex items-center justify-start gap-x-1">
			<p>online</p> <span className="h-2 w-2 bg-green-400 rounded-full mt-[1px]"></span>
		</span>
	);
};

const OfflineStatus = () => {
	return (
		<span className="flex items-center justify-start gap-x-1">
			<p>offline</p> <span className="h-2 w-2 bg-gray-400 rounded-full "></span>
		</span>
	);
};

function ChatHeader() {
	const [{ currentChatUser, onlineUsers }, dispatch] = useStateProvider();

	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX - 43, y: e.pageY + 33 });
		setIsContextMenuVisible(true);
	};

	const contextMenuOptions = [
		{
			name: "Exit",
			callback: async () => {
				dispatch({ type: reducerCases.SET_EXIT_CHAT });
			},
		},
	];

	const handleVoiceCall = () => {
		dispatch({
			type: reducerCases.SET_VOICE_CALL,
			voiceCall: {
				...currentChatUser,
				type: "out-going",
				callType: "voice",
				roomId: Date.now(),
			},
		});
	};

	const handleVideoCall = () => {
		dispatch({
			type: reducerCases.SET_VIDEO_CALL,
			videoCall: {
				...currentChatUser,
				type: "out-going",
				callType: "video",
				roomId: Date.now(),
			},
		});
	};

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
			<div className="flex items-center justify-center gap-6">
				<Avatar type={"sm"} image={currentChatUser?.profilePicture} />
				<div className="flex flex-col">
					<span className="text-primary-strong">{currentChatUser?.name}</span>
					<span className="text-secondary text-sm">
						{onlineUsers.includes(currentChatUser?.id) ? <OnlineStatus /> : <OfflineStatus />}
					</span>
				</div>
			</div>
			<div className="flex gap-6">
				<MdCall className="text-panel-header-icon cursor-pointer text-xl" onClick={handleVoiceCall} />
				<IoVideocam className="text-panel-header-icon cursor-pointer text-xl" onClick={handleVideoCall} />
				<BiSearchAlt2
					className="text-panel-header-icon cursor-pointer text-xl"
					onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
				/>
				<BsThreeDotsVertical
					className="text-panel-header-icon cursor-pointer text-xl hidden sm:flex"
					id="context-opener"
					onClick={(e) => showContextMenu(e)}
				/>
				<IoArrowBackCircle
					className="text-panel-header-icon cursor-pointer text-xl sm:hidden scale-125"
					onClick={() => dispatch({ type: reducerCases.SET_EXIT_CHAT })}
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

export default ChatHeader;
