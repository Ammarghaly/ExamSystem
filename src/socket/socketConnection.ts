import { socket } from "./socket";

export const connectSocket = (token: string) => {
  if (socket.connected) return;

  socket.auth = {
    token,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  if (!socket.connected) return;

  socket.disconnect();
};
