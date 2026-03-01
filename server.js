import { WebSocketServer, WebSocket } from "ws";

// Create a WebSocket server running on port 8000
const wss = new WebSocketServer({ port: 8000 });

/*
WebSocket Ready States:
0 -> CONNECTING  (Connection is not yet open)
1 -> OPEN        (Connection is open and ready to communicate)
2 -> CLOSING     (Connection is in the process of closing)
3 -> CLOSED      (Connection is closed)

IMPORTANT:
You can ONLY call .send() when readyState === WebSocket.OPEN
*/

// This event runs every time a new client connects
wss.on("connection", (socket, request) => {
  // Extract client's IP address from the upgrade request
  const ip = request.socket.remoteAddress;

  console.log(`New Client Connected: ${ip}`);

  // Listen for messages from this specific client
  socket.on("message", (buffer) => {
    // Messages arrive as Buffer objects
    console.log({ buffer });

    // Convert Buffer to string
    const message = buffer.toString();

    // Broadcast message to ALL connected clients
    wss.clients.forEach((client) => {
      // Only send message if client connection is OPEN
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server Broadcast : ${message}`);
      }
    });
  });

  // Handle connection errors
  socket.on("error", (err) => {
    console.log(`Error from ${ip}: ${err.message}`);
  });

  // Triggered when client disconnects
  socket.on("close", () => {
    console.log(`Client Disconnected: ${ip}`);
  });
});

// Log when server starts
console.log("WebSocket is live on ws://localhost:8000");
