import io from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL, {
    auth: { token }
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
};