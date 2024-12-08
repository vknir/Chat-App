import express from "express";
import "dotenv/config";
import { WebSocket, WebSocketServer } from "ws";
import cors from "cors";
import { v4 as uuid, v4 } from "uuid";

const app = express();
const port = process.env.PORT || 8080;

const roomMap = new Map<string, string[]>();
const clientMap = new Map<string, WebSocket>();

app.use(cors());

const httpserver = app.listen(port, () => {
  console.log(`Server listening on port `);
});

const wss = new WebSocketServer({ server: httpserver });

async function main() {
  wss.on("connection", function connection(ws: WebSocket) {
    const clientId = v4();
    clientMap.set(clientId, ws);

    ws.on("message", (request) => {
      const data = JSON.parse(request.toString());

      switch (data.type) {
        case "make": {
          const roomId = data.payload.roomId;

          roomMap.set(roomId, []);

          ws.send("Room created");
          break;
        }
        case "join": {
          const roomId = data.payload.roomId;

          const roomExists = roomMap.get(roomId);

          if (roomExists) {
            const username = data.payload.username;

            roomMap.get(roomId)?.push(clientId);

           

            ws.send(JSON.stringify({ exists: true }));
          } else {
            ws.send(JSON.stringify({ exists: false }));
          }
          break;
        }
        case "message": {
          const message = data.payload.message;
          const roomId = data.payload.roomId;
          const username = data.payload.username;
          const room = roomMap.get(roomId);
          console.log(room)

          room?.forEach((member) => {
            if (member != clientId) {
              const socket = clientMap.get(member);
              if (socket?.readyState === WebSocket.OPEN)
                socket.send(
                  JSON.stringify({ username: username, message: message })
                );
            }
          });

          break;
        }
      }
    });

    ws.on("close", (request) => {
      clientMap.delete(clientId);

      roomMap.forEach((room, roomId) => {
        
        

        const index = room.indexOf(clientId);
        if (index >= 0) {
          room.splice(index, 1);
          
          room.forEach((member)=>{
            const socket = clientMap.get(member)
            if( socket?.readyState === WebSocket.OPEN)
              socket.send('a user has left the chat')
          })

         
        }
        if( roomMap.get(roomId)?.length == 0){
          roomMap.delete(roomId);
          console.log('room was empty so it was deleted :(')
        }
      });



    });
  });
}

app.get("/", async (req, res) => {
  main().then(() => {
    res.json({
      message: "server has started",
    });
  });
});
