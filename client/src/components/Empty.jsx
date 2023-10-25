import React from "react";
import Image from "next/image";

function Empty() {
	return (
		<div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center">
			<Image
				src="/whatsapp.gif"
				alt="whatsapp"
				height={0}
				width={0}
				style={{ width: "300px", height: "300px" }}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				priority
			/>
		</div>
	);
}

export default Empty;
