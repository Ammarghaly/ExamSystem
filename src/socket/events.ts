export const CHAT_EVENTS = {
  JOIN: "chat:join",
  LEAVE: "chat:leave",
  SEND: "chat:send",
  RECEIVE: "chat:receive",
  TYPING: "chat:typing",
  STOP_TYPING: "chat:stop-typing",
  SEEN: "chat:seen",
  ERROR: "chat:error",
} as const;

export const SOCKET_EVENTS = {
  CONNECT: "connection",
  DISCONNECT: "disconnect",
} as const;

export const CHAT_ACK = {
  SUCCESS: "success",
  FAILED: "failed",
} as const;
