import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { HOST } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingVoiceCall from "./common/IncomingVoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import { useRouter } from "next/router";

function Main() {
	const router = useRouter();
	const [
		{ userInfo, currentChatUser, messageSearch, voiceCall, videoCall, incomingVoiceCall, incomingVideoCall },
		dispatch,
	] = useStateProvider();

	const [socketEvent, setSocketEvent] = useState(false);

	const socket = useRef();

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST);
			socket.current.emit("add-user", userInfo?.id);
			dispatch({ type: reducerCases.SET_SOCKET, socket });
		}
		if (!userInfo) {
			router.push("/");
		}
	}, [userInfo]);

	useEffect(() => {
		if (socket.current && !socketEvent) {
			socket.current.on("msg-receive", (data) => {
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...data.message,
					},
				});
				dispatch({ type: reducerCases.SET_REFRESH_CHAT_LIST });
				if (data.message.senderId === currentChatUser?.id) {
					dispatch({ type: reducerCases.SET_REFRESH_CHAT_LIST });
				}
			});

			socket.current.on("message-deleted", () => {
				dispatch({ type: reducerCases.SET_REFRESH_CHAT_LIST });
			});

			socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
				dispatch({
					type: reducerCases.SET_INCOMING_VOICE_CALL,
					incomingVoiceCall: { ...from, roomId, callType },
				});
			});

			socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
				dispatch({
					type: reducerCases.SET_INCOMING_VIDEO_CALL,
					incomingVideoCall: { ...from, roomId, callType },
				});
			});

			socket.current.on("voice-call-rejected", () => {
				dispatch({
					type: reducerCases.END_CALL,
				});
			});

			socket.current.on("video-call-rejected", () => {
				dispatch({
					type: reducerCases.END_CALL,
				});
			});

			socket.current.on("call-terminated", () => {
				dispatch({
					type: reducerCases.END_CALL,
				});
			});

			socket.current.on("online-users", ({ onlineUsers }) => {
				dispatch({
					type: reducerCases.SET_ONLINE_USERS,
					onlineUsers,
				});
			});

			setSocketEvent(true);
		}
	}, [socket.current]);

	return (
		<>
			{incomingVoiceCall && <IncomingVoiceCall />}
			{incomingVideoCall && <IncomingVideoCall />}

			{voiceCall && (
				<div className="h-screen w-screen max-h-full overflow-hidden">
					<VoiceCall />
				</div>
			)}

			{videoCall && (
				<div className="h-screen w-screen max-h-full overflow-hidden">
					<VideoCall />
				</div>
			)}

			{!voiceCall && !videoCall && (
				<div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
					<ChatList />
					{currentChatUser ? (
						<div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
							<Chat />
							{messageSearch && <SearchMessages />}
						</div>
					) : (
						<Empty />
					)}
				</div>
			)}
		</>
	);
}

export default Main;
