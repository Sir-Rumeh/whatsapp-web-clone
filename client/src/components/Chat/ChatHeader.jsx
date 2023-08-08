import React from "react";
import Avatar from "../common/Avatar";

function ChatHeader() {
	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
			<div className="flex items-center justify-center gap-6">
				<Avatar type={"sm"} image={"./profile"} />
				<div className="flex flex-col">
					<span className="text-primary-strong">DEMO</span>
					<span className="text-secondary text-sm">online/offline</span>
				</div>
			</div>
			<div className="flex gap-6"></div>
		</div>
	);
}

export default ChatHeader;
