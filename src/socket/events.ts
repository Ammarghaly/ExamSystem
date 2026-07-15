export const SOCKET_EVENTS = {
  CHAT_JOIN: "chat:join",
  CHAT_LEAVE: "chat:leave",

  CHAT_SEND: "chat:send",
  CHAT_RECEIVE: "chat:receive",

  CHAT_TYPING: "chat:typing",
  CHAT_STOP_TYPING: "chat:stop-typing",

  CHAT_SEEN: "chat:seen",

  CHAT_ERROR: "chat:error",
} as const;
