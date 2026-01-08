import api from "./axios";

export const getChatHistory = (id) =>
  api.get(`chat/${id}/history/`);

export const sendMessage = (id, message) =>
  api.post(`chat/${id}/send/`, { message });

export const uploadChatFile = (id, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post(`chat/${id}/upload/`, fd);
};

export const markSeen = (id) =>
  api.post(`chat/${id}/mark-seen/`);

export const typingPing = (id) =>
  api.post(`chat/${id}/typing/`);

export const getTypingStatus = (id) =>
  api.get(`chat/${id}/typing/`);

export const getUnreadCount = () =>
  api.get(`chat/unread-count/`);
