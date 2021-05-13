// import express from 'express';
// const app = express();
// import http from 'http';
// const server = http.createServer();
// import { Server } from 'socket.io';
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });
import http from 'http';
import { Server } from 'socket.io';
import {
  IConnected,
  IStateUpdate,
  SocketEvent,
} from '../../src/shared/interfaces';
import GameServer from './GameServer';
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const gameServer = new GameServer(io);

io.on('connection', (socket) => {
  socket.on('userConnected', (message: IConnected) => {
    gameServer.addSocket(socket, message.username);
    gameServer.broadcastIncomingUser(socket, message.username);
  });

  socket.on('disconnect', () => {
    gameServer.removeSocket(socket.id);
  });

  socket.on(SocketEvent.UPDATE_STATE, (state: IStateUpdate) => {
    gameServer.updateState(socket.id, state);
  });
});

httpServer.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
