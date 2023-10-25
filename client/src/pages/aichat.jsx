import React, { useEffect, useState } from "react";
import Sidebar from "@/components/AIChat/Sidebar";
import AIChatWrapper from "@/components/AIChat/AIChatWrapper";

function aichat() {
	const [pageHeight, setPageHeight] = useState(undefined);

	useEffect(() => {
		const { innerHeight } = window;
		setPageHeight(innerHeight);
	}, []);

	return (
		<>
			{/* DESKTOP VIEW */}
			<div className="hidden md:grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
				<Sidebar />
				<AIChatWrapper />
			</div>
			{/* MOBILE VIEW */}
			<div className={`flex md:hidden h-screen w-screen max-h-[${pageHeight}] max-w-full overflow-hidden`}>
				<AIChatWrapper />
			</div>
		</>
	);
}

export default aichat;
