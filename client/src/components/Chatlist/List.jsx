import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
	const [{ userInfo, userContacts }, dispatch] = useStateProvider();

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					data: { users, onlineUsers },
				} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`);
				dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
				dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
			} catch (err) {
				console.log(err);
			}
		};
		if (userInfo.id) {
			getContacts();
		}
	});
	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
			{userContacts?.map((contact) => (
				<div className="mb-6" key={contact.id}>
					<ChatLIstItem data={contact} key={contact.id} />
				</div>
			))}
		</div>
	);
}

export default List;
