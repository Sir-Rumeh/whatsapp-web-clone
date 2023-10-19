import { useStateProvider } from "@/context/StateContext";

const AIChatContainer = () => {
	const [{ aiMessages }] = useStateProvider();
	return (
		<div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
			<div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
			<div className="m-6 relative bottom-0 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-[6px] overflow-auto relative">
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
									<div className="">{message.message}</div>
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
