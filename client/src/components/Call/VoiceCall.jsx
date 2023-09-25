import React from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";
const Container = dynamic(() => import("./Container"), { ssr: false });

function VoiceCall() {
	const [{ voiceCall, socket, userInfo }] = useStateProvider();
	return <Container data={voiceCall} />;
}

export default VoiceCall;
