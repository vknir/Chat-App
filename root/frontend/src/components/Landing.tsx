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
          const response = JSON.parse(event.data);
          if (response.exist) {
            setRoomCode(inputRoomCode.trim().toUpperCase());
            setRoomId(true);
          } else {
            setRoomId(false);
          }
        };
      }
    }
  };

  const handleRoomCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputRoomCode(event.currentTarget.value);
  };

  return (
    <div className="border border-neutral-300 h-full p-5 flex flex-col gap-2 rounded-md">
      <div className="flex items-center text-2xl font-semibold gap-2">
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
        </>
        <p>Real Time Chat</p>
      </div>
      <p className="text-base text-neutral-400">temporary room that expires after all users exit</p>

      <button className="bg-black text-white rounded py-2 text-xl mt-4 " onClick={handleClickGenerate}>Create New Room</button>
      <input className="border rounded text-xl p-2" placeholder="Enter your name"></input>

      <form className="flex gap-2" onSubmit={handleSubmitJoinRoom}>
        <input className="border rounded-md text-xl w-full p-2"
          required
          placeholder="Enter Room Code"
          onChange={handleRoomCodeChange}
        ></input>
        <button className="w-fit bg-black text-white whitespace-nowrap px-9 rounded py-2">Join Room</button>
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
