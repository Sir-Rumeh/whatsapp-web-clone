import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script src="https://unpkg.com/wavesurfer.js" />
				{/* <script src="path-to-waveform-js/waveplayer.js"></script> */}
			</Head>
			<body>
				<Main />
				<NextScript />
				<div id="photo-picker-element"></div>
			</body>
		</Html>
	);
}
