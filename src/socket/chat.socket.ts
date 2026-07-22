import { socket } from "./socket";
import { CHAT_EVENTS } from "./events";

export const joinGroup = (groupId: string, callback?: (ack: any) => void) => {
  socket.emit(CHAT_EVENTS.JOIN, { groupId }, callback);
};

export const leaveGroup = (groupId: string, callback?: (ack: any) => void) => {
  socket.emit(CHAT_EVENTS.LEAVE, { groupId }, callback);
};

export const sendMessage = (
  groupId: string,
  content: string,
  callback?: (ack: any) => void,
) => {
  socket.emit(
    CHAT_EVENTS.SEND,
    {
      groupId,
      content,
    },
    callback,
  );
};

export const startTyping = (groupId: string) => {
  socket.emit(CHAT_EVENTS.TYPING, { groupId });
};

export const stopTyping = (groupId: string) => {
  socket.emit(CHAT_EVENTS.STOP_TYPING, { groupId });
};

export const seenMessage = (groupId: string, messageId: string) => {
  socket.emit(CHAT_EVENTS.SEEN, {
    groupId,
    messageId,
  });
};

export const onReceiveMessage = (callback: (message: any) => void) => {
  socket.on(CHAT_EVENTS.RECEIVE, callback);
};

export const offReceiveMessage = (callback: (message: any) => void) => {
  socket.off(CHAT_EVENTS.RECEIVE, callback);
};
