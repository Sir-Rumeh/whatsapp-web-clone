import { useStateProvider } from "@/context/StateContext";
import { DELETE_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import WaveSurfer from "wavesurfer.js";

function VoiceMessage({ message }) {
	const [{ userInfo, currentChatUser, socket, messages }, dispatch] = useStateProvider();
	const [audioMessage, setAudioMessage] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);

	const waveform = useRef(null);
	const waveformRef = useRef(null);

	const handlePlayAudio = () => {
		if (audioMessage) {
			waveform.current?.stop();
			waveform.current?.play();
			audioMessage?.play();
			setIsPlaying(true);
		}
	};
	const handlePauseAudio = () => {
		waveform.current?.stop();
		audioMessage?.pause();
		setIsPlaying(false);
	};

	const formatTime = (time) => {
		if (isNaN(time)) return "00:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		if (waveform.current === null) {
			waveform.current = WaveSurfer?.create({
				container: "#waveformref",
				waveColor: "#ccc",
				progressColor: "#4a9eff",
				cursorColor: "#7ae3c3",
				barWidth: 2,
				height: 30,
				responsive: true,
			});
			waveform.current?.on("finish", () => {
				setIsPlaying(false);
			});
		}

		return () => {
			waveform.current?.destroy();
		};
	}, []);

	useEffect(() => {
		const audioURL = `${HOST}/${message.message}`;
		const audio = new Audio(audioURL);
		setAudioMessage(audio);
		waveform.current?.load(audioURL);
		waveform.current?.on("ready", () => {
			setTotalDuration(waveform.current.getDuration());
		});
	}, [message.message]);

	useEffect(() => {
		if (audioMessage) {
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(audioMessage.currentTime);
			};
			audioMessage.addEventListener("timeupdate", updatePlaybackTime);
			return () => {
				audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
			};
		}
	}, [audioMessage]);

	const [isSender, setIsSender] = useState(false);
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX - 43, y: e.pageY });
		setIsContextMenuVisible(true);
	};

	const deleteMessage = async () => {
		try {
			const updateMessage = (msg) => {
			  return msg.id !== message.id;
			}
			dispatch({ type: reducerCases.SET_MESSAGES, messages:messages.filter(updateMessage)});
			const {
				data: { deletedMessage },
			} = await axios.delete(`${DELETE_MESSAGE_ROUTE}/${message.id}/${userInfo?.id}/${currentChatUser?.id}`);
			if (deletedMessage) {
				socket?.current.emit("delete-message", { ...deletedMessage });
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const contextMenuOptions = [
		{
			name: "Delete Message",
			callback: async () => {
				deleteMessage();
			},
		},
	];
	return (
		<>
			<div
				id="message-box"
				className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${
					message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"
				}`}
				onMouseOver={(event) => {
					event.preventDefault();
					if (message.senderId === userInfo?.id) {
						setIsSender(true);
					}
				}}
				onContextMenu={(event) => {
					event.preventDefault();
					if (isSender) {
						showContextMenu(event);
					}
				}}
			>
				<div id="message-box">
					<Avatar type="lg" image={currentChatUser?.profilePicture} />
				</div>
				<div id="message-box" className="cursor-pointer text-xl">
					{!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaPause onClick={handlePauseAudio} />}
				</div>
				<div id="message-box" className="relative ">
					<div id="waveformref" className="w-60 bg-re-400" ref={waveformRef} />
					<div className="text-bubble-meta text-[11px] pt-1 flex justify-between items-center absolute bottom-[-22px] w-full">
						<span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
						<div className="flex gap-1">
							<span>{calculateTime(message.createdAt)}</span>
							<span>
								{message.senderId === userInfo?.id && (
									<MessageStatus messageStatus={message.messageStatus} />
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
			{isContextMenuVisible && (
				<ContextMenu
					options={contextMenuOptions}
					cordinates={contextMenuCordinates}
					contextMenu={isContextMenuVisible}
					setContextMenu={setIsContextMenuVisible}
				/>
			)}
		</>
	);
}

export default VoiceMessage;
