import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";

function Container({ data }) {
	const [{ socket, userInfo }, dispatch] = useStateProvider();
	const [callAccepted, setCallAccepted] = useState(false);
	return (
		<div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
			Container
		</div>
	);
}

export default Container;
