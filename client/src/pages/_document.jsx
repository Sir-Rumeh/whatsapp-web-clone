import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<Script src="https://unpkg.com/wavesurfer.js" />
			</Head>
			<body>
				<Main />
				<NextScript />
				<div id="photo-picker-element"></div>
			</body>
		</Html>
	);
}
