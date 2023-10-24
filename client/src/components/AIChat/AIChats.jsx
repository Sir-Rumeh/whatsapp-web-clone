import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";

const ChatContents = ({ message }) => {
	const [loading, setLoading] = useState(message.fromSelf ? false : true);

	useEffect(() => {
		const loadReply = async () => {
			try {
				let res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
				if (res) {
					res = null;
				}
				setLoading(false);
			} catch (error) {
				return Promise.reject(error);
			}
		};
		if (!message.fromSelf) {
			loadReply();
		}
	}, []);

	return (
		<>
			{loading ? (
				<div className="scale-75">
					<Loader />
				</div>
			) : (
				<div className="">{message.message}</div>
			)}
		</>
	);
};

const AIChatContainer = () => {
	const [{ aiMessages }] = useStateProvider();
	return (
		<div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
			<div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
			<div className="m-6 relative bottom-0 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-[6px] overflow-y-scroll overflow-x-hidden custom-scrollbar relative">
						{aiMessages?.map((message) => (
							<div
								key={message.id}
								className={`flex ${!message.fromSelf ? "justify-start" : "justify-end"}`}
							>
								<div
									className={`text-white px-3 pb-[11px] pt-[9px] text-sm rounded-md flex gap-2 items-end max-w-[45%] relative ${
										!message.fromSelf
											? "bg-incoming-background"
											: "bg-outgoing-background"
									}`}
								>
									{/* <div className="">{message.message}</div> */}
									<ChatContents message={message} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIChatContainer;
