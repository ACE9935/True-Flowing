/*import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { db } from '@/firebase/firebase';// Firestore instance
import { doc, onSnapshot } from 'firebase/firestore';
import { customInitApp } from "@/firebase/firebase-admin";

customInitApp();

// Socket server handler
export default async function handler(req: Request, res: Response) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server for user updates...');

    const httpServer: HttpServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket-user',
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected for user updates:', socket.id);

      // Listen for a request to start tracking a specific user document
      socket.on('trackUser', (userId: string) => {
        console.log(`Tracking user with id: ${userId}`);

        // Firestore real-time listener for the specified user document
        const userDocRef = doc(db, 'users', userId);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            console.log('User document updated:', userData);

            // Emit the updated user document to the connected client
            socket.emit('userUpdate', { id: userId, ...userData });
          } else {
            console.log('No such document!');
          }
        });

        // Clean up Firestore listener when the client disconnects
        socket.on('disconnect', () => {
          console.log('Client disconnected. Stopping tracking for user:', userId);
          unsubscribe();
        });
      });
    });
  }

  res.end();
}*/
