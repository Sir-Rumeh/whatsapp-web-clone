export const HOST = "http://localhost:5002";
// export const HOST = process.env.NEXT_HOST;

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGE_ROUTE = `${HOST}/api/messages`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`;

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTE}/get-initial-contacts`;
export const DELETE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/delete-message`;
export const CHAT_WITH_AI_ROUTE = `${MESSAGE_ROUTE}/chat-with-ai`;
