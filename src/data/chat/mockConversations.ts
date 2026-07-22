export interface Conversation {
  id: string;
  name: string;
  teacherName: string;
  membersCount: number;
  image?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Physics 101",
    teacherName: "Dr. Aris",
    membersCount: 42,
    image: "", // Will trigger fallback: group.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}`
    lastMessage: "The lecture notes for Chapter 4 are uploaded",
    lastMessageTime: "10:42 AM",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-2",
    name: "Computer Science 302",
    teacherName: "Prof. Sarah",
    membersCount: 28,
    image: "",
    lastMessage: "Remember to submit the project proposal by tomorrow midnight.",
    lastMessageTime: "Yesterday",
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: "conv-3",
    name: "Advanced Mathematics",
    teacherName: "Dr. Elena",
    membersCount: 35,
    image: "",
    lastMessage: "The quiz will cover modules 1 through 3.",
    lastMessageTime: "Mon",
    unreadCount: 0,
    isOnline: true,
  },
];
