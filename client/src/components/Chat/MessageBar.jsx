import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE, GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), { ssr: false });

function MessageBar() {
	const [{ userInfo, currentChatUser, socket, messages }, dispatch] = useStateProvider();
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [grabPhoto, setGrabPhoto] = useState(false);
	const [showAudioRecorder, setShowAudioRecorder] = useState(false);
	const [enterTrigger, setEnterTrigger] = useState(undefined);
	const fileRef = useRef(null);

	const emojiPickerRef = useRef(null);

	useEffect(() => {
		setMessage("");
	}, [currentChatUser]);

	useEffect(() => {
		if (grabPhoto) {
			const data = document.getElementById("photo-picker");
			data.click();
			document.body.onfocus = (e) => {
				setTimeout(() => {
					setGrabPhoto(false);
				}, 100);
			};
		}
	}, [grabPhoto]);

	const handleEmojiModal = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const handleEmojiClick = (emoji) => {
		setMessage((prevMessage) => (prevMessage += emoji.emoji));
	};

	const photoPickerChange = async (e) => {
		const file = e.target.files[0];
		try {
			const formData = new FormData();
			formData.append("image", file);
			const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				params: {
					from: userInfo?.id,
					to: currentChatUser?.id,
				},
			});
			if (response.status === 201) {
				socket?.current.emit("send-msg", {
					from: userInfo?.id,
					to: currentChatUser?.id,
					message: response.data.message,
				});
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: { ...response.data.message },
					fromSelf: true,
				});
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const sendMessage = async () => {
		if (!message.length) {
			return;
		}
		try {
			dispatch({
				type: reducerCases.ADD_MESSAGE,
				newMessage: {
					id: "temp",
					senderId: userInfo?.id,
					receiverId: currentChatUser?.id,
					type: "text",
					message,
					messageStatus: "sent",
					createdAt: Date.now(),
				},
				fromSelf: true,
			});
			setMessage("");
			const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
				to: currentChatUser?.id,
				from: userInfo?.id,
				message,
			});
			socket?.current.emit("send-msg", {
				to: currentChatUser?.id,
				from: userInfo?.id,
				message: data?.message,
			});
			dispatch({
				type: reducerCases.SET_MESSAGES,
				messages: messages.filter((msg) => {
					return msg.id !== "temp";
				}),
			});
			dispatch({ type: reducerCases.ADD_MESSAGE, newMessage: { ...data?.message }, fromSelf: true });
			const getContacts = async () => {
				try {
					const {
						data: { users, onlineUsers },
					} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`);
					dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
					dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
				} catch (err) {
					return Promise.reject(err);
				}
			};
			if (data) {
				if (userInfo?.id) {
					getContacts();
				}
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};

	useEffect(() => {
		sendMessage();
	}, [enterTrigger]);

	useEffect(() => {
		let input = document.getElementById("text_input");
		const handleEnterTrigger = (event) => {
			if (event.code === "Enter") {
				setEnterTrigger(Date.now());
			}
		};

		const handleOutsideClick = (event) => {
			if (event.target.id !== "emoji-open") {
				if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
					setShowEmojiPicker(false);
				}
			}
		};

		input.addEventListener("keypress", handleEnterTrigger);
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
			input.removeEventListener("keypress", handleEnterTrigger);
		};
	}, []);

	return (
		<div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative" id="text_input">
			{!showAudioRecorder && (
				<>
					<div className="flex items-center gap-6">
						<BsEmojiSmile
							className="text-panel-header-icon cursor-pointer text-xl"
							title="Emoji"
							id="emoji-open"
							onClick={handleEmojiModal}
						/>
						{showEmojiPicker && (
							<div ref={emojiPickerRef} className="absolute bottom-24 left-4 z-40">
								<EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
							</div>
						)}
						<div className="relative">
							<input
								id="html-form-field"
								name="html-form-field"
								type="file"
								ref={fileRef}
								className="absolute inset-0 z-10 hidden"
								onChange={photoPickerChange}
							/>
							<button
								type="button"
								className="cursor-pointer p-1 rounded-lg flex items-center justify-center"
								onClick={() => {
									if (fileRef.current) {
										fileRef.current.click();
									}
								}}
							>
								<ImAttachment
									className="text-panel-header-icon cursor-pointer text-xl"
									title="Attach File"
								/>
							</button>
						</div>
					</div>
					<div className="w-full rounded-lg h-10 flex items-center">
						<input
							id="html-form-field"
							name="html-form-field"
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
							{message.length ? (
								<MdSend
									className="text-panel-header-icon cursor-pointer text-xl"
									title="Send Message"
									onClick={sendMessage}
								/>
							) : (
								<FaMicrophone
									className="text-panel-header-icon cursor-pointer text-xl"
									title="Record"
									onClick={() => setShowAudioRecorder(true)}
								/>
							)}
						</button>
					</div>
				</>
			)}
			{showAudioRecorder ? <CaptureAudio setShowAudioRecorder={setShowAudioRecorder} /> : null}
		</div>
	);
}

export default MessageBar;
