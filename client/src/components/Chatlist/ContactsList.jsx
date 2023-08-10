import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";

function ContactsList() {
	const [{}, dispatch] = useStateProvider();
	const [allContacts, setAllContacts] = useState([]);

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					date: { users },
				} = await axios.get(GET_ALL_CONTACTS);
				setAllContacts(users);
			} catch (err) {
				console.log(err);
			}
		};
		getContacts();
	}, []);
	return (
		<div className="h-ful flex flex-col">
			<div className="h-24 flex items-end px-3 py-4">
				<div className="flex items-center gap-12 text-white">
					<BiArrowBack
						className="cursor-pointer text-xl"
						onClick={() => {
							dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default ContactsList;
