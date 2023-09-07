import React from "react";
import { FaTrash } from "react-icons/fa";

function CaptureAudio({ hide }) {
	return (
		<div className="flex text-2xl w-full justify-end items-center">
			<div className="pt-1">
				<FaTrash className="text-panel-header-icon cursor-pointer" onClick={() => hide()} />
			</div>
			<div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center"></div>
		</div>
	);
}

export default CaptureAudio;
