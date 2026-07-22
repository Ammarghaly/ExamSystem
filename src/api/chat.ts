import api from './axios';

export const getGroupMessages = async (groupId: string) => {
  const response = await api.get(`/chat/messages/${groupId}`);
  return response.data;
};

export const sendMessage = async (groupId: string, content: string) => {
  const response = await api.post('/chat/messages', { groupId, content });
  return response.data;
};
