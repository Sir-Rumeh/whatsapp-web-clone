import AIChatHeader from "./AIChatHeader";
import AIChats from "./AIChats";
import AIMessageBar from "./AIMessageBar";

const AIChatWrapper = () => {
	return (
		<div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10">
			<AIChatHeader />
			<AIChats />
			<AIMessageBar />
		</div>
	);
};

export default AIChatWrapper;
