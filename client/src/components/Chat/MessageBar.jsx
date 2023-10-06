import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), { ssr: false });

function MessageBar() {
	const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [grabPhoto, setGrabPhoto] = useState(false);
	const [showAudioRecorder, setShowAudioRecorder] = useState(false);

	const emojiPickerRef = useRef(null);

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

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (event.target.id !== "emoji-open") {
				if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
					setShowEmojiPicker(false);
				}
			}
		};
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	const handleEmojiModal = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const handleEmojiClick = (emoji) => {
		setMessage((prevMessage) => (prevMessage += emoji.emoji));
	};

	const photoPickerChange = async (e) => {
		try {
			const file = e.target.files[0];
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
		try {
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
			dispatch({ type: reducerCases.ADD_MESSAGE, newMessage: { ...data?.message }, fromSelf: true });
			setMessage("");
		} catch (err) {
			return Promise.reject(err);
		}
	};
	return (
		<div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
			{!showAudioRecorder && (
				<>
					<div className="flex gap-6">
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
						<ImAttachment
							className="text-panel-header-icon cursor-pointer text-xl"
							title="Attach File"
							onClick={() => setGrabPhoto(true)}
						/>
					</div>
					<div className="w-full rounded-lg h-10 flex items-center">
						<input
							type="text"
							placeholder="Type a message"
							className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
							onChange={(e) => setMessage(e.target.value)}
							value={message}
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
			{grabPhoto ? <PhotoPicker onChange={photoPickerChange} /> : null}
			{showAudioRecorder ? <CaptureAudio setShowAudioRecorder={setShowAudioRecorder} /> : null}
		</div>
	);
}

export default MessageBar;
