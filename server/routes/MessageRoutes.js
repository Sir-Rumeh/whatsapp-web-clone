import { Router } from "express";
import {
	addAudioMessage,
	addImageMessage,
	addMessage,
	chatWithAi,
	deleteMessage,
	getInitialContactsWithMessages,
	getMessages,
} from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();
const uploadImage = multer({ dest: "/uploads/images" });
// process.env.ENV === "production"
// 	? multer({ dest: "https://whatsapp-web-clone-production.up.railway.app/uploads/images" })
// 	: multer({ dest: "/uploads/images" });
const uploadAudio = multer({ dest: "/uploads/recordings" });
// process.env.ENV === "production"
// 	? multer({ dest: "https://whatsapp-web-clone-production.up.railway.app/uploads/recordings" })
// 	: multer({ dest: "/uploads/recordings" });

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);
router.delete("/delete-message/:messageId/:from/:to", deleteMessage);
router.post("/chat-with-ai", chatWithAi);

export default router;
