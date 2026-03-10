import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-event-room", (eventId) => {
      socket.join(`event-${eventId}`);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const getIO = () => io;