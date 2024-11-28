import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { roomCodeState, roomIdState } from "../store/atom";

interface Props {
  socket: WebSocket | null;
}

interface SendData {
  type: string;
  payload: {
    roomId?: string;
    message?: string;
  };
}
const getRandom = () =>
  [...Array(6)].map(() => Math.floor(Math.random() * 36).toString(36)).join("");

export default function Landing({ socket }: Props) {
  const [roomCode, setRoomCode] = useRecoilState(roomCodeState);
  const setRoomId = useSetRecoilState(roomIdState);
  const [inputRoomCode, setInputRoomCode] = useState("");

  const handleClickGenerate = () => {
    const currentRoomCode = getRandom().toUpperCase();

    setRoomCode(currentRoomCode);

    const dataSend: SendData = {
      type: "make",
      payload: {
        roomId: `${currentRoomCode}`,
      },
    };
    
    socket?.send(JSON.stringify(dataSend));   
  };

  const handleSubmitJoinRoom = (event: React.FormEvent) => {
    event.preventDefault();

   

    if (inputRoomCode.trim().toUpperCase().length === 6) {
      
      const dataSend: SendData = {
        type: "join",
        payload: {
          roomId: `${inputRoomCode.trim().toUpperCase()}`,
        },
      };
      if (socket != null) {
        socket?.send(JSON.stringify(dataSend));
        socket.onmessage = (event: MessageEvent) => {
         const response =(JSON.parse(event.data))
         if(response.exist )
         {
            setRoomId(true)
         }else{
          setRoomId(false)
         }
        };
      }
    }
  };

  const handleRoomCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputRoomCode(event.currentTarget.value);
  };

  return (
    <div className="border border-neutral-600 flex flex-col">
      <div>
        <p>Real Time Chat</p>
      </div>
      <p>temporary room that expires after all users exit</p>

      <button onClick={handleClickGenerate}>Create New Room</button>
      <input placeholder="Enter your name"></input>

      <form onSubmit={handleSubmitJoinRoom}>
        <input
          required
          placeholder="Enter Room Code"
          onChange={handleRoomCodeChange}
        ></input>
        <button>Join Room</button>
      </form>
      {roomCode === "" ? (
        <div></div>
      ) : (
        <div>
          <p>Share this code with your friends</p>
          <span>{roomCode}</span>
        </div>
      )}
    </div>
  );
}
