import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPause, FaPlay, FaStopCircle, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ setShowAudioRecorder }) {
	const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [recordedAudio, setRecordedAudio] = useState(null);
	const [waveform, setWaveform] = useState(null);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [renderedAudio, setRenderedAudio] = useState(null);

	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const usewaveform = useRef(null);
	const waveformRef = useRef(null);

	const handleStartRecording = () => {
		setRecordingDuration(0);
		setCurrentPlaybackTime(0);
		setTotalDuration(0);
		setRecordedAudio(null);
		setIsRecording(true);
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				if (mediaRecorderRef.current === null) {
					mediaRecorderRef.current = mediaRecorder;
				}
				if (audioRef.current === null) {
					audioRef.current.srcObject = stream;
				}

				const chunks = [];

				mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
				mediaRecorder.onstop = () => {
					const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
					const audioUrl = URL.createObjectURL(blob);
					const audio = new Audio(audioUrl);
					setRecordedAudio(audio);
					waveform?.load(audioUrl);
				};
				mediaRecorder.start();
			})
			.catch((error) => {
				return Promise.reject("Error accessing microphone:", error);
			});
	};

	const handleStopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef?.current.stop();
			setIsRecording(false);
			waveform?.stop();

			const audioChunks = [];
			mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
				audioChunks.push(event.data);
			});

			mediaRecorderRef.current.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
				const audioFile = new File([audioBlob], "recording.mp3");
				setRenderedAudio(audioFile);
			});
		}
	};

	const handlePlayRecording = () => {
		if (recordedAudio) {
			waveform?.stop();
			waveform?.play();
			recordedAudio?.play();
			setIsPlaying(true);
		}
	};

	const handlePauseRecording = () => {
		waveform?.stop();
		recordedAudio?.pause();
		setIsPlaying(false);
	};

	const sendRecording = async () => {
		if (isRecording) {
			handleStopRecording();
		}
		try {
			const formData = new FormData();
			formData.append("audio", renderedAudio);
			const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				params: {
					from: userInfo?.id,
					to: currentChatUser?.id,
				},
			});
			if (response.status === 201) {
				setShowAudioRecorder(false);
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

	const formatTime = (time) => {
		if (isNaN(time)) return "00:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		if (isRecording) {
			const interval = setInterval(() => {
				setRecordingDuration((prevDuration) => {
					setTotalDuration(prevDuration + 1);
					return prevDuration + 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [isRecording]);

	useEffect(() => {
		if (usewaveform.current === null) {
			usewaveform.current = WaveSurfer?.create({
				container: "#waveformcontainer",
				waveColor: "#ccc",
				progressColor: "#4a9eff",
				cursorColor: "#7ae3c3",
				barWidth: 2,
				height: 30,
				responsive: true,
			});
			setWaveform(usewaveform.current);
			usewaveform.current?.on("finish", () => {
				setIsPlaying(false);
			});
		}

		return () => {
			usewaveform.current?.destroy();
		};
	}, []);

	useEffect(() => {
		if (waveform) handleStartRecording();
	}, [waveform]);

	useEffect(() => {
		if (recordedAudio) {
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(recordedAudio.currentTime);
			};
			recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
			return () => {
				recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
			};
		}
	}, [recordedAudio]);

	return (
		<div className="flex text-2xl w-full justify-end items-center overflow-x-hidden relative px-1">
			<div className="">
				<FaTrash className="text-panel-header-icon cursor-pointer" onClick={() => setShowAudioRecorder()} />
			</div>
			<div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
				{isRecording ? (
					<div className="text-red-500 animate-pulse text-center flex gap-x-2">
						Recording<span className="">{recordingDuration}</span>
					</div>
				) : (
					<div>
						{recordedAudio && (
							<>
								{!isPlaying ? (
									<FaPlay onClick={handlePlayRecording} className="cursor-pointer" />
								) : (
									<FaPause onClick={handlePauseRecording} className="cursor-pointer" />
								)}
							</>
						)}
					</div>
				)}
				<div
					id="waveformcontainer"
					className="w-[100px] min-w-[60px] sm:w-60 flex justify-end"
					ref={waveformRef}
					hidden
				>
					{recordedAudio && isPlaying && <span>{formatTime(currentPlaybackTime)}</span>}
					{recordedAudio && !isPlaying && !isRecording && <span>{formatTime(totalDuration)}</span>}
					<audio ref={audioRef} hidden />
				</div>

				<div className="mr-4">
					{!isRecording ? (
						<FaMicrophone className="text-red-500 cursor-pointer" onClick={handleStartRecording} />
					) : (
						<FaStopCircle className="text-red-500 cursor-pointer" onClick={handleStopRecording} />
					)}
				</div>
				<div>
					{!isRecording && (
						<MdSend
							className="text-panel-header-icon cursor-pointer mr-4"
							title="Send"
							onClick={sendRecording}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default CaptureAudio;
