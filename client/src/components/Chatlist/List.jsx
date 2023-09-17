import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";

function List() {
	const [{ userInfo }] = useStateProvider();

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					data: { users, onlineUsers },
				} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
			} catch (err) {
				console.log(err);
			}
		};
	});
	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
			List
		</div>
	);
}

export default List;
