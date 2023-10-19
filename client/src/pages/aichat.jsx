import React from "react";
import Sidebar from "@/components/AIChat/Sidebar";
import AIChatWrapper from "@/components/AIChat/AIChatWrapper";

function aichat() {
	return (
		<>
			<div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
				<Sidebar />
				<AIChatWrapper />
			</div>
		</>
	);
}

export default aichat;
