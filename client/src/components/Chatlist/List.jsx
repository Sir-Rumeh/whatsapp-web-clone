import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Loader from "../common/Loader";
import React, { useState, useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { useRouter } from "next/router";


function List() {
	const router = useRouter();
	const [{ userInfo, currentChatUser, userContacts, filteredContacts, refreshChatList }, dispatch] =
		useStateProvider();
	const [loading, setLoading] = useState(false);
	
	

	useEffect(() => {
		const getContacts = async () => {
			try {
				setLoading(true);
				const {
					data: { users, onlineUsers },
				} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`);
				dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
				dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
				setLoading(false);
			} catch (err) {
				setLoading(false);
				return Promise.reject(err);
			}
		};
		if (userInfo?.id) {
			getContacts();
		}
	}, [refreshChatList]);

	return (
		<>
			{loading ? (
				<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar px-1">
					<Loader loading={loading} />
				</div>
			) : (
				<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar px-1 relative">
						{filteredContacts && filteredContacts.length > 0
							? filteredContacts?.map((contact) => (
									<div className="" key={contact.id}>
										<ChatLIstItem data={contact} />
									</div>
							  ))
							: userContacts?.map((contact) => (
									<div
										className={`${
											currentChatUser?.id === contact.id ? " bg-[#2e3d4b] rounded-sm" : ""
										}`}
										key={contact.id}
									>
										<ChatLIstItem data={contact} />
									</div>
							  ))}
						<div className="absolute bottom-3 w-full px-3">
							<button
								className="w-full px-3 py-3 rounded-md font-bold bg-outgoing-background text-white text-xl"
								onClick={() => router.push("/aichat")}
							>
								Chat with AI Bot
							</button>
						</div>
				</div>
			)}
		</>
	);
}

export default List;
