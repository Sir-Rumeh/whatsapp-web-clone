import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingVoiceCall from "./common/IncomingVoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";

function Main() {
	const router = useRouter();
	const [
		{ userInfo, currentChatUser, messageSearch, voiceCall, videoCall, incomingVoiceCall, incomingVideoCall },
		dispatch,
	] = useStateProvider();
	const [redirectLogin, setRedirectLogin] = useState(false);
	const [socketEvent, setSocketEvent] = useState(false);

	const socket = useRef();

	onAuthStateChanged(firebaseAuth, async (currentUser) => {
		if (!currentUser) setRedirectLogin(true);
		if (!userInfo && currentUser?.email) {
			const { data } = await axios.post(CHECK_USER_ROUTE, {
				email: currentUser.email,
			});

			if (!data.status) {
				router.push("/login");
			}
			if (data?.data) {
				const { id, name, email, profilePicture: profileImage, status } = data.data;
				dispatch({
					type: reducerCases.SET_USER_INFO,
					userInfo: {
						id,
						name,
						email,
						profileImage,
						status,
					},
				});
			}
		}
	});

	useEffect(() => {
		if (redirectLogin) router.push("/login");
	}, [redirectLogin]);

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST);
			socket.current.emit("add-user", userInfo?.id);
			dispatch({ type: reducerCases.SET_SOCKET, socket });
		}
	}, [userInfo]);

	const [refreshChatList, setRefreshChatList] = useState(false);

	useEffect(() => {
		if (socket.current && !socketEvent) {
			socket.current.on("msg-receive", (data) => {
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...data.message,
					},
				});
				setRefreshChatList((prev) => !prev);
				// HERE
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

	useEffect(() => {
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
	}, [currentChatUser]);

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
					<ChatList refreshChatList={refreshChatList} />
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
