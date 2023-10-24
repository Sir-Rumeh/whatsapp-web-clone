import React from "react";
import Sidebar from "@/components/AIChat/Sidebar";
import AIChatWrapper from "@/components/AIChat/AIChatWrapper";

function aichat() {
	return (
		<>
			{/* DESKTOP VIEW */}
			<div className="hidden md:grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
				<Sidebar />
				<AIChatWrapper />
			</div>
			{/* MOBILE VIEW */}
			<div className="flex md:hidden h-screen w-screen max-h-screen max-w-full overflow-hidden">
				<AIChatWrapper />
			</div>
		</>
	);
}

export default aichat;
