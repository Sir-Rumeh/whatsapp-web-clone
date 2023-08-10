import React, { useState, useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";

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
					<span>New Chat</span>
				</div>
			</div>
			<div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
				<div className="flex py-3 items-center gap-3 h-14">
					<div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
						<div>
							<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
						</div>
						<div>
							<input
								type="text"
								placeholder="Search or start a new chat"
								className="bg-transparent text-sm focus:outline-none text-white w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContactsList;
