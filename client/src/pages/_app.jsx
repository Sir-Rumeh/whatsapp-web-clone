import StateProvider from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
	function diff_hours(dt2, dt1) {
		var diff = Math.abs(new Date(dt2).getTime() - new Date(dt1).getTime()) / 3600000;
		return diff;
	}

	useEffect(() => {
		const interval = setInterval(() => {
			const lockValue = localStorage.getItem("ai-chat-lock");
			const dateSet = localStorage.getItem("ai-chat-lock-time");
			if (lockValue === "true") {
				const timePassed = diff_hours(Date.now(), parseInt(dateSet));
				if (timePassed > 0.04) {
					localStorage.setItem("ai-chat-lock", false);
					localStorage.setItem("ai-chat-count", 4);
				}
			}
		}, 8000);
		// }, 18 * 60 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<StateProvider initialState={initialState} reducer={reducer}>
			<Head>
				<title>Whatsapp Clone</title>
				<link rel="shortcut icon" href="/favicon.png" />
				<meta name="whatsapp-web-clone" content="Whatsapp web clone" key="desc" />
			</Head>
			<Component {...pageProps} />
		</StateProvider>
	);
}
