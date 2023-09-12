import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";

function VoiceMessage({ message }) {
	const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
	const [audioMessage, setAudioMessage] = useState(null);
	// const [recordedAudio, setRecordedAudio] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);

	const waveformRef = useRef(null);
	const waveform = useRef(null);

	const handlePlayRecording = () => {
		if (recordedAudio) {
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

	const formatTime = (time) => {
		if (isNaN(time)) return "00:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		if (waveform.current === null) {
			const WaveSurfer = import("wavesurfer.js").default;
			waveform.current = WaveSurfer?.create({
				container: waveformRef?.current,
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
		waveform.current.load(audioURL);
		waveform.current.on("ready", () => {
			setTotalDuration(waveform.current.getDuration);
		});
	}, [message.message]);

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
	return <div>VoiceMessage</div>;
}

export default VoiceMessage;
