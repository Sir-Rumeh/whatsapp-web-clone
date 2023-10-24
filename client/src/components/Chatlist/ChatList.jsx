import React, { useState, useEffect } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";
import { useRouter } from "next/router";

function ChatList() {
	const router = useRouter();
	const [{ contactsPage }] = useStateProvider();
	const [pageType, setPageType] = useState("default");

	useEffect(() => {
		if (contactsPage) {
			setPageType("all-contacts");
		} else {
			setPageType("default");
		}
	}, [contactsPage]);

	return (
		<div className="bg-panel-header-background flex flex-col h-screen w-full md:w-auto min-w-[250px] z-20 relative">
			{pageType === "default" && (
				<>
					<ChatListHeader />
					<SearchBar />
					<List />
					<div className="absolute bottom-3 w-full px-3">
						<button
							className="w-full px-3 py-3 rounded-md font-bold bg-outgoing-background text-white text-xl"
							onClick={() => router.push("/aichat")}
						>
							Chat with AI Bot
						</button>
					</div>
				</>
			)}
			{pageType === "all-contacts" && (
				<>
					<ContactsList />
				</>
			)}
		</div>
	);
}

export default ChatList;
