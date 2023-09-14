import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
	const [{}, dispatch] = useStateProvider();
	return (
		<div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
			<div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
				<IoClose
					className="cursor-pointer text-icon-lighter text-2xl"
					onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
				/>
				<span>Search Messages</span>
			</div>
			<div className="overflow-auto custom-scrollbar h-full">
				<div className="flex items-center flex-col w-full">
					<div className="flex px-5 items-center gap-3 h-14 w-full">
						<div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
							<div>
								<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
							</div>
							<div>
								<input
									type="text"
									placeholder="Search or start a new chat"
									className="bg-transparent text-sm focus:outline-none text-white w-full"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchMessages;
