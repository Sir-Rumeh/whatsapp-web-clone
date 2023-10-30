import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { stringify } from "./utils/helper.js";
import { WebSocketServer } from "ws";

dotenv.config();
const app = express();
app.use(
	cors({
		origin: [
			"https://whatsapp-web-clone-client.vercel.app",
			"https://whatsapp-web-clone.up.railway.app",
			"http://localhost:3000",
		],
	})
);

app.use(express.json());

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

const PORT = process.env.PORT || 5002;

app.get("/", (req, res) => {
	res.send("Hey this is my API app running 🥳");
});

const server = app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server started on port ${PORT}`);
});

global.onlineUsers = [];

const wss = new WebSocketServer({
	server: server,
});

wss.on("connection", function connection(ws) {
	ws.isAlive = true;

	ws.timer = setInterval(() => {
		ws.ping();
		ws.deathTimer = setTimeout(() => {
			ws.isAlive = false;
			clearInterval(ws.timer);
			ws.terminate();
		}, 1000);
	}, 5000);

	ws.on("pong", () => {
		clearTimeout(ws.deathTimer);
	});

	ws.on("message", function message(event) {
		const eventData = event.toString();
		const parsedData = JSON.parse(eventData);

		if (parsedData.type === "add-user") {
			const { id } = parsedData;
			if (!onlineUsers.includes(id)) {
				onlineUsers.push(id);
			}
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "online-users",
						onlineUsers,
					})
				);
			});
		} else if (parsedData.type === "logout-user") {
			const { id } = parsedData;
			onlineUsers.filter((userId) => {
				return userId !== id;
			});
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "online-users",
						onlineUsers: onlineUsers.filter((userId) => {
							return userId !== id;
						}),
					})
				);
			});
		} else if (parsedData.type === "send-message") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "msg-receive",
						cameFrom: parsedData.from,
						sendTo: parsedData.to,
						messageObject: parsedData.sentMessage,
					})
				);
			});
		} else if (parsedData.type === "delete-message") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "message-deleted",
						cameFrom: parsedData.from,
						sendTo: parsedData.to,
						messageId: parsedData.deletedMessageId,
					})
				);
			});
		} else if (parsedData.type === "outgoing-voice-call") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "incoming-voice-call",
						from: { ...parsedData.from },
						sendTo: parsedData.to,
						roomId: parsedData.roomId,
						callType: parsedData.callType,
					})
				);
			});
		} else if (parsedData.type === "outgoing-video-call") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "incoming-video-call",
						from: { ...parsedData.from },
						sendTo: parsedData.to,
						roomId: parsedData.roomId,
						callType: parsedData.callType,
					})
				);
			});
		} else if (parsedData.type === "accept-incoming-call") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "call-accepted",
						sendTo: parsedData.id,
					})
				);
			});
		} else if (parsedData.type === "reject-call") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "call-rejected",
						sendTo: parsedData.id,
					})
				);
			});
		} else if (parsedData.type === "terminate-call") {
			wss.clients.forEach((client) => {
				client.send(
					stringify({
						type: "call-terminated",
						sendTo: parsedData.id,
					})
				);
			});
		}
	});
	ws.on("error", console.error);

	wss.broadcast = function broadcast(msg) {
		wss.clients.forEach(function each(client) {
			client.send(stringify(msg));
		});
	};
});

export default app;
