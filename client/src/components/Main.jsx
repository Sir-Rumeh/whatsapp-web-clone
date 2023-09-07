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
import { data } from "autoprefixer";

function Main() {
	const router = useRouter();
	const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
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
			socket.current.emit("add-user", userInfo.id);
			dispatch({ type: reducerCases.SET_SOCKET, socket });
		}
	}, [userInfo]);

	useEffect(() => {
		if (socket.current && !socketEvent) {
			socket.current.on("msg-receive", (data) => {
				// if (currentChatUser?.id === data?.message.senderId) {
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...data.message,
						// messageStatus: "read",
						// MOST LIKELY CHANGE THE STATUS HERE FOR THAT SETTING IT TO READ IF USER HAS CHAT OPEN AND RECEIVED THE SENT MESSAGE IN REAL TIME
					},
				});
				// }
			});
			setSocketEvent(true);
		}
	}, [socket.current]);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const {
					data: { messages },
				} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser?.id}`);
				dispatch({ type: reducerCases.SET_MESSAGES, messages });
			} catch (err) {
				console.log(err);
			}
		};
		if (currentChatUser?.id) {
			getMessages();
		}
	}, [currentChatUser]);

	return (
		<>
			<div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
				<ChatList />
				{currentChatUser ? <Chat /> : <Empty />}
			</div>
		</>
	);
}

export default Main;
