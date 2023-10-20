import React from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { BiSearchAlt2 } from "react-icons/bi";

function SearchBar() {
	const [{}, dispatch] = useStateProvider();

	return (
		<div className="bg-search-input-container-background flex py-3 px-3 items-center gap-3 h-14">
			<div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
				<div>
					<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
				</div>
				<div>
					<input
						type="text"
						placeholder="Search chat list"
						className="bg-transparent text-sm focus:outline-none text-white w-full"
						onChange={(e) => {
							dispatch({
								type: reducerCases.SET_CONTACT_SEARCH,
								contactSearch: e.target.value,
							});
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default SearchBar;
