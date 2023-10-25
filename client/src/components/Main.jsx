import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { GET_INITIAL_CONTACTS_ROUTE, HOST } from "@/utils/ApiRoutes";
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
		{ userInfo, currentChatUser, messageSearch, voiceCall, videoCall, incomingVoiceCall, incomingVideoCall },
		dispatch,
	] = useStateProvider();

	const [socketEvent, setSocketEvent] = useState(false);
	const socket = useRef();
	const [pageHeight, setPageHeight] = useState(undefined);

	useEffect(() => {
		const { innerHeight } = window;
		setPageHeight(innerHeight);
	}, []);

	useEffect(() => {
		const hasSignedIn = localStorage.getItem("hasSignedIn");
		if (hasSignedIn === "false") {
			router.push("/");
		}
		if (userInfo) {
			socket.current = io(HOST);
			socket.current.emit("add-user", userInfo?.id);
			dispatch({ type: reducerCases.SET_SOCKET, socket });
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
	}, []);

	const getContacts = async () => {
		try {
			const {
				data: { users, onlineUsers },
			} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`);
			dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
			dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
		} catch (err) {
			return Promise.reject(err);
		}
	};

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
				if (userInfo?.id) {
					getContacts();
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
		const localData =
			localStorage.getItem("signedInUserInfo") !== "undefined"
				? JSON.parse(localStorage.getItem("signedInUserInfo"))
				: null;
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
						className={`sm:hidden flex w-screen h-[${pageHeight}] max-w-full overflow-hidden relative`}
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
