import express, { json } from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';


const app = express();
const httpServer = app.listen(8080);
app.use(cors())
const wss = new WebSocketServer({ server: httpServer });
const roomMap= new Map <string, WebSocket[]>();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  // ws.on("message", function message(data, isBinary) {
  //   wss.clients.forEach(function each(client) {
  //     if (client.readyState === WebSocket.OPEN && client != ws) {
  //       client.send(data, { binary: isBinary });
  //     }
  //   });
  // });

  ws.on('message',(data)=>{
    const dataObj = JSON.parse( data.toString())
    if( dataObj.type === 'join')
    {
      if( roomMap.get(`${dataObj.payload.roomId}`) !=undefined){
        roomMap.get(`${dataObj.payload.roomId}`)?.push(ws)
       
       
        ws.send(JSON.stringify({exist:true}))
      }
      else{
        ws.send(JSON.stringify({exist:false}))
        
      }
    }
    else if( dataObj.type === 'make')
    {
      
      roomMap.set(`${dataObj.payload.roomId}`, [])
      
    }
    else if( dataObj.type === 'message')
    {
     
      roomMap.get(`${dataObj.payload.roomId}`)?.forEach( (client)=>{
        if (client.readyState === WebSocket.OPEN && client != ws) 
        client.send(JSON.stringify( {message :`${dataObj.payload.message}`, username: dataObj.payload.username}))
      })
    }
  })

  ws.send("Hello! Message From Server!!");
});

app.get("/", (req, res) => {
  let users: WebSocket[]=[]
  wss.clients.forEach( client=>{
    users.push(client)
  })
  
  res.json({ number: users });
});
