import { Server } from "socket.io";
import prisma from "../prisma/prisma.js";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Join user room based on their userId
    socket.on("join-user-room", ({ userId }) => {
      socket.join(userId.toString());
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      const { content, senderId, receiverId, tempId } = data;
      // Create the message in the database
      const message = await prisma.directMessage.create({
        data: {
          content,
          senderId,
          receiverId,
          status: "SENT",
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              role: true,
              personalInfo: {
                select: {
                  basicInfo: {
                    select: {
                      name: true,
                      fatherName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      message.tempId = tempId;
      socket.emit("messageSent", { tempId, message: message });

      // Emit message to receiver's room with sender info
      io.to(receiverId.toString()).emit("newMessage", message);
    });

    // Admin users join their individual room based on their userId
    socket.on("join-admin-room", ({ userId }) => {
      socket.join(userId.toString());
    });
  });
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
