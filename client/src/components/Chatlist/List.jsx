import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List({ refreshChatList }) {
	const [{ userInfo, currentChatUser, userContacts, filteredContacts }, dispatch] = useStateProvider();

	useEffect(() => {
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
		if (userInfo?.id) {
			getContacts();
		}
	}, [refreshChatList]);

	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar px-1">
			{filteredContacts && filteredContacts.length > 0
				? filteredContacts?.map((contact) => (
						<div className="" key={contact.id}>
							<ChatLIstItem data={contact} />
						</div>
				  ))
				: userContacts?.map((contact) => (
						<div
							className={`${currentChatUser?.id === contact.id ? " bg-[#2e3d4b] rounded-sm" : ""}`}
							key={contact.id}
						>
							<ChatLIstItem data={contact} />
						</div>
				  ))}
		</div>
	);
}

export default List;
