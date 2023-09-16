import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";

export const getMessages = async (req, res, next) => {
	try {
		const prisma = getPrismaInstance();
		const { from, to } = req.params;

		const messages = await prisma.messages.findMany({
			where: {
				OR: [
					{
						senderId: parseInt(from),
						receiverId: parseInt(to),
					},
					{
						senderId: parseInt(to),
						receiverId: parseInt(from),
					},
				],
			},
			orderBy: {
				id: "asc",
			},
		});

		const unreadMessages = [];

		messages.forEach((message, index) => {
			if (message.messageStatus !== "read" && message.senderId === parseInt(to)) {
				messages[index].messageStatus = "read";
				unreadMessages.push(message.id);
			}
		});
		await prisma.messages.updateMany({
			where: {
				id: {
					in: unreadMessages,
				},
			},
			data: {
				messageStatus: "read",
			},
		});

		res.status(200).json({ messages });
	} catch (err) {
		next(err);
	}
};

export const addMessage = async (req, res, next) => {
	try {
		const prisma = getPrismaInstance();
		const { message, from, to } = req.body;
		const getUser = onlineUsers.get(to);
		if (message && from && to) {
			const newMessage = await prisma.messages.create({
				data: {
					message,
					sender: { connect: { id: parseInt(from) } },
					receiver: { connect: { id: parseInt(to) } },
					messageStatus: getUser ? "delivered" : "sent",
				},
				include: { sender: true, receiver: true },
			});
			return res.status(201).send({ message: newMessage });
		}
		return res.status(400).send("From, to and Message is required.");
	} catch (err) {
		next(err);
	}
};

export const addImageMessage = async (req, res, next) => {
	try {
		if (req.file) {
			const prisma = getPrismaInstance();
			const { from, to } = req.query;

			const date = Date.now();
			let fileName = "uploads/images/" + date + req.file?.originalname;
			renameSync(req.file?.path, fileName);

			if (from && to) {
				const message = await prisma.messages.create({
					data: {
						message: fileName,
						sender: { connect: { id: parseInt(from) } },
						receiver: { connect: { id: parseInt(to) } },
						type: "image",
					},
				});
				return res.status(201).json({ message });
			}
			return res.status(400).send("From, to is required.");
		}
		return res.status(400).send("Image is required.");
	} catch (err) {
		next(err);
	}
};

export const addAudioMessage = async (req, res, next) => {
	try {
		if (req.file) {
			const prisma = getPrismaInstance();
			const { from, to } = req.query;

			const date = Date.now();
			let fileName = "uploads/recordings/" + date + req.file?.originalname;
			renameSync(req.file?.path, fileName);

			if (from && to) {
				const message = await prisma.messages.create({
					data: {
						message: fileName,
						sender: { connect: { id: parseInt(from) } },
						receiver: { connect: { id: parseInt(to) } },
						type: "audio",
					},
				});
				return res.status(201).json({ message });
			}
			return res.status(400).send("From, to is required.");
		}
		return res.status(400).send("Audio is required.");
	} catch (err) {
		next(err);
	}
};

export const getInitialContactsWithMessages = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.from);
		const prisma = getPrismaInstance();
		const user = await prisma.user.findMany({
			where: { id: userId },
			include: {
				sentMessages: {
					include: {
						receiver: true,
						sender: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
				receivedMessages: {
					include: {
						receiver: true,
						sender: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});
		const messages = [...user.sentMessages, ...user.receivedMessages];
		messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		const users = new Map();
		const messageStatusChange = [];

		messages.forEach((msg) => {
			const isSender = msg.senderId === userId;
			const calculatedId = isSender ? msg.receiverId : msg.senderId;
			if (msg.messageStatus === "sent") {
				messageStatusChange.push(msg.id);
			}

			if (!users.get(calculatedId)) {
				const { id, type, message, messageStatus, createdAt, senderId, receiverId } = msg;
				let user = { messageId: id, type, message, messageStatus, createdAt, senderId, receiverId };
				if (isSender) {
					user = {
						...user,
						...msg.receiver,
						totalUnreadMessages: 0,
					};
				} else {
					user = {
						...user,
						...msg.sender,
						totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
					};
				}
				users.set(calculatedId, { ...user });
			} else if (messageStatus !== "read" && !isSender) {
				const user = users.get(calculatedId);
				users.set(calculatedId, {
					...user,
					totalUnreadMessages: user.totalUnreadMessages + 1,
				});
			}
		});
		if (messageStatusChange.length) {
			await prisma.messages.updateMany({
				where: {
					id: {
						in: messageStatusChange,
					},
				},
				data: {
					messageStatus: "delivered",
				},
			});
		}
		return response.status(200).json({
			users: Array.from(users.values()),
			onlineUsers: Array.from(onlineUsers.keys()),
		});
	} catch (err) {
		next(err);
	}
};
