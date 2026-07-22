import api from './axios';

export const getGroupMessages = async (
  groupId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const response = await api.get(
    `/chat/messages/${groupId}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const sendMessage = async (groupId: string, content: string) => {
  const response = await api.post('/chat/messages', { groupId, content });
  return response.data;
};
