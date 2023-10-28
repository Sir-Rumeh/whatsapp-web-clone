import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { GET_INITIAL_CONTACTS_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
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
import axios from "axios";

const Main = () => {
	const router = useRouter();
	const [
		{
			userInfo,
			currentChatUser,
			messageSearch,
			voiceCall,
			videoCall,
			incomingVoiceCall,
			incomingVideoCall,
			socket,
		},
		dispatch,
	] = useStateProvider();

	const [pageHeight, setPageHeight] = useState(undefined);

	useEffect(() => {
		const { innerHeight } = window;
		setPageHeight(innerHeight);

		const hasSignedIn = localStorage.getItem("hasSignedIn");
		if (hasSignedIn === "false") {
			router.push("/");
		}

		const localData =
			localStorage.getItem("signedInUserInfo") !== "undefined"
				? JSON.parse(localStorage.getItem("signedInUserInfo"))
				: null;
		if (localData && !userInfo) {
			if (hasSignedIn === "true") {
				dispatch({
					type: reducerCases.SET_USER_INFO,
					userInfo: localData,
				});
			} else {
				router.push("/");
			}
		} else if (!userInfo && !localData) {
			router.push("/");
		}

		const getContactsAgain = async () => {
			try {
				const {
					data: { users, onlineUsers },
				} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${localData?.id}`);
				dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
				dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
			} catch (err) {
				return Promise.reject(err);
			}
		};
		getContactsAgain();
	}, []);

	useEffect(() => {
		// if (userInfo) {
		// 	socket.current = io(HOST);
		// 	socket.current.emit("add-user", userInfo?.id);
		// 	// dispatch({ type: reducerCases.SET_SOCKET, socket });
		// }
		const socketConnection = new WebSocket("ws://localhost:5002");
		dispatch({ type: reducerCases.SET_SOCKET, socket: socketConnection });
		if (socket?.readyState === 3) {
			socket?.close();
			const socketConnection = new WebSocket("ws://localhost:5002");
			dispatch({ type: reducerCases.SET_SOCKET, socket: socketConnection });
		}
		setTimeout(() => {
			socket?.send(
				JSON.stringify({
					type: "add-user",
					id: userInfo?.id,
					userName: `user${userInfo?.id}`,
				})
			);
		}, 1000);
	}, []);

	useEffect(() => {
		socket?.addEventListener("message", function (event) {
			const eventData = event.data.toString();
			const parsedData = JSON.parse(eventData);
			if (parseInt(parsedData.sendTo) === userInfo?.id) {
				if (parsedData.type === "msg-receive") {
					dispatch({
						type: reducerCases.ADD_MESSAGE,
						newMessage: {
							...parsedData.messageObject,
						},
					});
				} else if (parsedData.type === "message-deleted") {
					dispatch({ type: reducerCases.DELETE_MESSAGE, deletedMessageId: parsedData.messageId });
				} else if (parsedData.type === "incoming-voice-call") {
					const { from, roomId, callType } = parsedData;
					dispatch({
						type: reducerCases.SET_INCOMING_VOICE_CALL,
						incomingVoiceCall: { ...from, roomId, callType },
					});
				} else if (parsedData.type === "incoming-video-call") {
					const { from, roomId, callType } = parsedData;
					dispatch({
						type: reducerCases.SET_INCOMING_VIDEO_CALL,
						incomingVoiceCall: { ...from, roomId, callType },
					});
				} else if (parsedData.type === "call-rejected") {
					dispatch({
						type: reducerCases.END_CALL,
					});
				} else if (parsedData.type === "call-terminated") {
					dispatch({
						type: reducerCases.END_CALL,
					});
				}
			}
			// HERE FOR THE CURRENT BROADCAST STUFF ON CLIENT
			if (parsedData.type === "online-users") {
				dispatch({
					type: reducerCases.SET_ONLINE_USERS,
					onlineUsers,
				});
			}
		});

		socket?.addEventListener("error", console.error);
	}, [socket]);

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
				<>
					{/* DESKTOP VIEW */}
					<div className="hidden sm:grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
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
					{/* MOBILE VIEW */}
					<div
						className={`sm:hidden flex h-screen w-screen max-w-full overflow-hidden relative max-h-[${pageHeight}]`}
					>
						<ChatList />
						<div
							className={`fixed w-full ${
								currentChatUser ? "translate-x-0" : "translate-x-[100%]"
							} transition-all z-20`}
						>
							<div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
								<Chat />
								{messageSearch && <SearchMessages />}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Main;
