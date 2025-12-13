
import { socket } from '../../socket';
import { getMessagesForGroup } from '../api/chatApplicationApi';

const connect = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

const disconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ** THE FIX IS HERE **
const getMessages = async (groupId) => {

  return getMessagesForGroup(groupId);
};

const joinGroup = (groupId) => {
  socket.emit('joinGroup', groupId);
};

const leaveGroup = (groupId) => {
  socket.emit('leaveGroup', groupId);
};

const sendMessage = (messageData) => {
  socket.emit('sendMessage', messageData);
};

const onNewMessage = (callback) => {
  socket.on('newMessage', callback);
  return () => socket.off('newMessage', callback);
};

const onMessageError = (callback) => {
  socket.on('messageError', callback);
  return () => socket.off('messageError', callback);
};

export const chatService = {
  connect,
  disconnect,
  getMessages, // Use the corrected function
  joinGroup,
  leaveGroup,
  sendMessage,
  onNewMessage,
  onMessageError,
};