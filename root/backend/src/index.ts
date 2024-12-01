import express, { json } from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import "dotenv/config";
import { v4 as uuid, v4 } from "uuid";

const app = express();
const httpServer = app.listen(process.env.PORT || 8080);
app.use(cors());
const wss = new WebSocketServer({ server: httpServer });
const roomMap = new Map<string, string[]>();
const allConnections = new Map<string, WebSocket>();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  const uuid = v4();
  allConnections.set(uuid, ws);

  ws.on("message", (data) => {
    const dataObj = JSON.parse(data.toString());
    if (dataObj.type === "join") {
      if (roomMap.get(`${dataObj.payload.roomId}`) != undefined) {
        roomMap.get(`${dataObj.payload.roomId}`)?.push(uuid);

        ws.send(
          JSON.stringify({
            exist: true,
            length: roomMap.get(`${dataObj.payload.roomId}`)?.length,
          })
        );
      } else {
        ws.send(JSON.stringify({ exist: false }));
      }
    } else if (dataObj.type === "make") {
      roomMap.set(`${dataObj.payload.roomId}`, []);
    } else if (dataObj.type === "message") {
      const sender = allConnections.get(uuid);
      roomMap.get(dataObj.payload.roomId)?.forEach((client) => {
        const websocket = allConnections.get(client);
        if (websocket != sender && websocket?.readyState === WebSocket.OPEN)
          websocket.send(
            JSON.stringify({
              message: dataObj.payload.message,
              username: dataObj.payload.username,
            })
          );
      });
    }
  });

  ws.on("close", (data) => {
    const socket = allConnections.get(uuid);
    allConnections.delete(uuid);

    roomMap.forEach((room) => {
      room.splice(room.indexOf(uuid, 0), 1);
    });

    roomMap.forEach((room, index) => {
      if (room.length < 1) roomMap.delete(index);
    });
  });
});

app.get("/", (req, res) => {
  let users: WebSocket[] = [];
  wss.clients.forEach((client) => {
    users.push(client);
  });

  res.json({ number: users });
});
