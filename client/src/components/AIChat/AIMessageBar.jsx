import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";

const AIMessageBar = () => {
	const [{}, dispatch] = useStateProvider();
	const [message, setMessage] = useState("");
	const [localCount, setLocalCount] = useState(0);
	const [lockChat, setLockChat] = useState(false);

	useEffect(() => {
		const lockAIChat = localStorage.getItem("ai-chat-lock");
		if (lockAIChat === "true") {
			setLockChat(true);
		} else if (lockAIChat === "false") {
			setLockChat(false);
		}
	}, [localCount]);

	const sendAIMessage = async () => {
		if (!message.length) {
			return;
		}
		const aiChatCount = localStorage.getItem("ai-chat-count");
		if (!aiChatCount) {
			localStorage.setItem("ai-chat-count", 4);
		} else {
			if (parseInt(aiChatCount) > 0) {
				localStorage.setItem("ai-chat-count", parseInt(aiChatCount) - 1);
			} else {
				localStorage.setItem("ai-chat-lock", true);
				localStorage.setItem("ai-chat-lock-time", Date.now());
			}
		}

		setLocalCount((prev) => prev + 1);

		const options = {
			method: "POST",
			url: "https://api.edenai.run/v2/text/chat",
			headers: {
				authorization: `Bearer ${process.env.NEXT_EDEN_API_KEY}`,
			},
			data: {
				show_original_response: false,
				fallback_providers: "",
				providers: "openai",
				text: "Hello i need your help ! ",
				chatbot_global_action: "Act as an assistant",
				previous_history: [],
				temperature: 0.0,
				max_tokens: 150,
			},
		};

		try {
			dispatch({
				type: reducerCases.ADD_AI_MESSAGES,
				newMessage: { id: Date.now(), message, fromSelf: true },
			});
			setMessage("");
			axios.request(options)
				.then((response) => {
					dispatch({
						type: reducerCases.ADD_AI_MESSAGES,
						newMessage: {
							id: Date.now(),
							message: response.data.openai.generated_text,
							fromSelf: false,
						},
					});
				})
				.catch((error) => {
					return Promise.reject(error);
				});
		} catch (err) {
			return Promise.reject(err);
		}
	};

	return (
		<div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
			{lockChat ? (
				<div className="w-full flex rounded-lg bg-input-background p-2 ">
					<p className="text-white text-xl text-center leading-12 w-full tracking-wider">
						Sorry, you have reached your chat limit for the day Try again after 24 hours.
					</p>
				</div>
			) : (
				<>
					<div className="w-full rounded-lg h-10 flex items-center">
						<input
							type="text"
							placeholder="Type a message"
							className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							autoComplete="off"
						/>
					</div>
					<div className="flex w-10 items-center justify-center">
						<button>
							<MdSend
								className="text-panel-header-icon cursor-pointer text-xl"
								title="Send Message"
								onClick={sendAIMessage}
							/>
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default AIMessageBar;
