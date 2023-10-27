import { reducerCases } from "./constants";

export const initialState = {
	userInfo: undefined,
	newUser: false,
	contactsPage: false,
	currentChatUser: undefined,
	messages: [],
	aiMessages: [],
	socket: undefined,
	messageSearch: false,
	refreshChatList: undefined,
	userContacts: [],
	onlineUsers: [],
	filteredContacts: [],
	voiceCall: undefined,
	videoCall: undefined,
	incomingVoiceCall: undefined,
	incomingVideoCall: undefined,
	aiMessagingCount: undefined,
};

const reducer = (state, action) => {
	switch (action.type) {
		case reducerCases.SET_USER_INFO:
			localStorage.setItem("signedInUserInfo", JSON.stringify(action.userInfo));
			localStorage.setItem("hasSignedIn", true);
			return {
				...state,
				userInfo: action.userInfo,
			};
		case reducerCases.SET_NEW_USER:
			return {
				...state,
				newUser: action.newUser,
			};
		case reducerCases.SET_ALL_CONTACTS_PAGE:
			return {
				...state,
				contactsPage: !state.contactsPage,
			};
		case reducerCases.CHANGE_CURRENT_CHAT_USER:
			return {
				...state,
				currentChatUser: action.user,
			};
		case reducerCases.SET_MESSAGES:
			return {
				...state,
				messages: action.messages,
			};
		case reducerCases.ADD_MESSAGE:
			return {
				...state,
				messages: [...state.messages, action.newMessage],
			};
		case reducerCases.ADD_AI_MESSAGES:
			return {
				...state,
				aiMessages: [...state.aiMessages, action.newMessage],
			};
		case reducerCases.DELETE_MESSAGE:
			const newMessageArray = state.messages.filter((message) => message.id !== action.deletedMessageId);
			return {
				...state,
				messages: newMessageArray,
			};
		case reducerCases.SET_SOCKET:
			return {
				...state,
				socket: action.socket,
			};
		case reducerCases.SET_MESSAGE_SEARCH:
			return {
				...state,
				messageSearch: !state.messageSearch,
			};
		case reducerCases.SET_REFRESH_CHAT_LIST:
			return {
				...state,
				refreshChatList: action.listValue,
			};
		case reducerCases.SET_USER_CONTACTS:
			return {
				...state,
				userContacts: action.userContacts,
			};
		case reducerCases.SET_ONLINE_USERS:
			return {
				...state,
				onlineUsers: action.onlineUsers,
			};

		case reducerCases.SET_CONTACT_SEARCH:
			const filteredContacts = state.userContacts.filter((contact) =>
				contact.name.toLowerCase().startsWith(action.contactSearch.toLowerCase())
			);
			return {
				...state,
				contactSearch: action.contactSearch,
				filteredContacts,
			};
		case reducerCases.SET_VOICE_CALL:
			return {
				...state,
				voiceCall: action.voiceCall,
			};
		case reducerCases.SET_VIDEO_CALL:
			return {
				...state,
				videoCall: action.videoCall,
			};
		case reducerCases.SET_INCOMING_VOICE_CALL:
			return {
				...state,
				incomingVoiceCall: action.incomingVoiceCall,
			};
		case reducerCases.SET_INCOMING_VIDEO_CALL:
			return {
				...state,
				incomingVideoCall: action.incomingVideoCall,
			};
		case reducerCases.END_CALL:
			return {
				...state,
				voiceCall: undefined,
				videoCall: undefined,
				incomingVoiceCall: undefined,
				incomingVideoCall: undefined,
			};
		case reducerCases.SET_EXIT_CHAT:
			return {
				...state,
				currentChatUser: undefined,
			};
		case reducerCases.SET_AI_CHAT_COUNT:
			return {
				...state,
				aiMessagingCount: action.newCount,
			};

		default:
			return state;
	}
};

export default reducer;
