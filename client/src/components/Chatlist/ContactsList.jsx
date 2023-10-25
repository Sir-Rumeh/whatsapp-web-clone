import React, { useState, useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import Loader from "../common/Loader";

function ContactsList() {
	const [{ userInfo }, dispatch] = useStateProvider();
	const [allContacts, setAllContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedContacts, setSearchedContacts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm.length) {
			const filteredData = {};
			Object.keys(allContacts)?.forEach((key) => {
				filteredData[key] = allContacts[key].filter((obj) =>
					obj.name.toLowerCase().startsWith(searchTerm.toLowerCase())
				);
			});
			setSearchedContacts(filteredData);
		} else {
			setSearchedContacts(allContacts);
		}
	}, [searchTerm]);

	useEffect(() => {
		const getContacts = async () => {
			try {
				setLoading(true);
				const {
					data: { users },
				} = await axios.get(`${GET_ALL_CONTACTS}/${userInfo?.id}`);
				setAllContacts(users);
				setSearchedContacts(users);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				return Promise.reject(err);
			}
		};
		getContacts();
	}, []);
	return (
		<div className="h-full flex flex-col">
			<div className="h-16  flex items-end px-3 py-4">
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
				<div className="flex py-0 items-center gap-3 h-14">
					<div className="bg-panel-header-background flex items-center gap-5 px-3 py-2 rounded-lg flex-grow mx-3">
						<div>
							<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
						</div>
						<div>
							<input
								id="html-form-field"
								name="html-form-field"
								type="text"
								placeholder="Search Contacts"
								className="bg-transparent text-sm focus:outline-none text-white w-full"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
				</div>
				{loading ? (
					<Loader loading={loading} />
				) : (
					<>
						{Object.entries(searchedContacts).map(([initialLetter, userList]) => {
							return (
								<div key={Date.now() + initialLetter}>
									{userList.length && (
										<>
											<div className="text-teal-light pl-10 py-4">{initialLetter}</div>
											<div className="flex flex-col">
												{userList.map((contact) => {
													return (
														<ChatLIstItem
															data={{ ...contact }}
															key={contact.id}
															isContactsPage={true}
														/>
													);
												})}
											</div>
										</>
									)}
								</div>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}

export default ContactsList;
