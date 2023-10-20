import Avatar from "../common/Avatar";

const AIChatHeader = () => {
	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
			<div className="flex items-center justify-center gap-6">
				<Avatar type={"sm"} image="/gpt-logo.webp" />
				<div className="flex flex-col">
					<span className="text-primary-strong text-lg">Chat With Bot ( 10 tries per day )</span>
				</div>
			</div>
		</div>
	);
};

export default AIChatHeader;
