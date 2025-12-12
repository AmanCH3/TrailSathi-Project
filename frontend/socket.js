
import { io } from 'socket.io-client';


const URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5050';

export const socket = io(URL, {
});