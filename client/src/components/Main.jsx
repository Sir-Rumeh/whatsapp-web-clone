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
// import { data } from "autoprefixer";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
	const router = useRouter();
	const [{ userInfo, currentChatUser, messageSearch }, dispatch] = useStateProvider();
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
				// if (currentChatUser && (currentChatUser?.id === data?.message?.senderId && userInfo?.id === data?.message?.receiverId)) {
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...data.message,
					},
				});
				// }
				setRefreshChatList((prev) => !prev);
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
		</>
	);
}

export default Main;
