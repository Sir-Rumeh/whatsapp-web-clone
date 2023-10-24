import { useStateProvider } from "@/context/StateContext";
import Avatar from "../common/Avatar";
import { useEffect } from "react";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";

const AIChatHeader = () => {
	const router = useRouter();
	const [{ aiMessagingCount }, dispatch] = useStateProvider();
	useEffect(() => {
		const handleStorage = () => {
			const aiChatCount = localStorage.getItem("ai-chat-count");
			if (aiChatCount) {
				dispatch({ type: reducerCases.SET_AI_CHAT_COUNT, newCount: aiChatCount });
			}
		};
		handleStorage();
	}, []);

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
			<div className="flex items-center justify-center gap-6">
				<Avatar type={"sm"} image="/gpt-logo.webp" />
				<div className="flex flex-col">
					<span className="text-primary-strong ">
						<p className="text-lg">Chat With Bot</p>
						<p className="hidden">
							10 tries per day ... {aiMessagingCount >= 0 ? parseInt(aiMessagingCount) + 1 : 0}
							{} remaining
						</p>
					</span>
				</div>
			</div>
			<div className="flex gap-6">
				<BiArrowBack
					className="text-panel-header-icon cursor-pointer text-xl scale-125"
					onClick={() => router.push("/home")}
				/>
			</div>
		</div>
	);
};

export default AIChatHeader;
