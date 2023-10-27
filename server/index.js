import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
import { WebSocket, WebSocketServer } from "ws";
import { BSON } from "bson";

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

const PORT = process.env.PORT | 5002;
// const PORT = process.env.PORT | 5002;

app.get("/", (req, res) => {
	res.send("Hey this is my API running 🥳");
});

const server = app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server started on port ${PORT}`);
});
const wss = new WebSocketServer({
	server: server,
});

const Users = {};

// const object = JSON.parse("[name]");
// console.log(object);

wss.on("connection", function connection(ws, req) {
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
		try {
			const eventData = event.toString();
			const parsedData = JSON.parse(eventData);
			const to = parsedData.to;
			Users[to] = ws;
			// const eventData = JSON.parse(event.toString());
			// const eventData = JSON.parse(event);

			if (parsedData.type === "add-user") {
				console.log("userr");
			} else if (parsedData.type === "send-message") {
				wss.clients.forEach((client) => {
					client.send(
						JSON.stringify({
							type: "msg-receive",
							to: parsedData.to,
							from: parsedData.from,
							message: parsedData.message,
						})
					);
				});

				// console.log(wss.clients);
				// Users[to].send(
				// 	JSON.stringify({
				// 		type: "msg-receive",
				// 		from: eventData.from,
				// 		message: eventData.message,
				// 	})
				// );
			}
		} catch (error) {
			console.log(error);
		}
	});
	// {onlineUsers: Array.from(wss.clients.keys())}
	// {onlineUsers: Array.from(wss.clients)}
	ws.on("error", console.error);

	// wss.broadcast = function broadcast(data) {
	// 	wss.clients.forEach(function each(client) {
	// 		client.send(data);
	// 	});
	// };
});

const io = new Server(server, {
	cors: {
		origin: [
			"https://whatsapp-web-clone-client.vercel.app",
			"https://whatsapp-web-clone.up.railway.app",
			"http://localhost:3000",
		],
	},
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
	global.chatSocket = socket;

	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
		socket.broadcast.emit("online-users", {
			onlineUsers: Array.from(onlineUsers.keys()),
		});
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-receive", {
				from: data.from,
				message: data.message,
			});
		}
	});

	socket.on("delete-message", (data) => {
		const sendUserSocket = onlineUsers.get(data.receiverId);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("message-deleted", {
				id: data.id,
			});
		}
	});

	socket.on("outgoing-voice-call", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("incoming-voice-call", {
				from: data.from,
				roomId: data.roomId,
				callType: data.callType,
			});
		}
	});

	socket.on("outgoing-video-call", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("incoming-video-call", {
				from: data.from,
				roomId: data.roomId,
				callType: data.callType,
			});
		}
	});

	socket.on("reject-voice-call", (data) => {
		const sendUserSocket = onlineUsers.get(data.from);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("voice-call-rejected");
		}
	});

	socket.on("reject-video-call", (data) => {
		const sendUserSocket = onlineUsers.get(data.from);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("video-call-rejected");
		}
	});

	socket.on("accept-incoming-call", ({ id }) => {
		const sendUserSocket = onlineUsers.get(id);
		socket.to(sendUserSocket).emit("accept-call");
	});

	socket.on("terminate-call", (data) => {
		const sendUserSocket = onlineUsers.get(data.from);

		socket.to(sendUserSocket).emit("call-terminated");
	});
});

export default app;
