export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  isTeacher?: boolean;
  text: string;
  timestamp: string;
  isMine: boolean;
  isSeen?: boolean;
}
