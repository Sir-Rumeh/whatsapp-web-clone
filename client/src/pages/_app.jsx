import StateProvider from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
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
