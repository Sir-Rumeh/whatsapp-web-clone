import React, { useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
	const contextMenuRef = useRef(null);
	return (
		<div className="bg-dropdown-background fixed py-2 z-[100]" ref={contextMenuRef}>
			ContextMenu
		</div>
	);
}

export default ContextMenu;
