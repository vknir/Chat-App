import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  roomCodeState,
  roomIdState,
  displayNotificationState,
  userNameState,
  usersState
} from "../store/atom";
import Notification from "./Notification";

interface Props {
  socket: WebSocket | null;
}

interface SendData {
  type: string;
  payload: {
    roomId?: string;
    message?: string;
    username?:string
  };
}
const getRandom = () =>
  [...Array(6)].map(() => Math.floor(Math.random() * 36).toString(36)).join("");

export default function Landing({ socket }: Props) {
  const [roomCode, setRoomCode] = useRecoilState(roomCodeState);
  const setRoomId = useSetRecoilState(roomIdState);
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [username, setUsername] = useRecoilState(userNameState);
  const setUsers= useSetRecoilState(usersState)
  const  setDisplayNotification = useSetRecoilState(
    displayNotificationState
  );
  

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
    if (inputRoomCode.trim() === "") {
      setDisplayNotification({ type: 0, display: true });
      setInputRoomCode("");
    }

    if (username.trim() === "") {
      setDisplayNotification({ type: 2, display: true });
      setUsername("");
    } else {
      if (inputRoomCode.trim().toUpperCase().length === 6) {
        const dataSend: SendData = {
          type: "join",
          payload: {
            roomId: `${inputRoomCode.trim().toUpperCase()}`,
            username: username,
          },
        };
        if (socket != null) {
          socket?.send(JSON.stringify(dataSend));

          socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);
            if (response.exist) {
              setRoomCode(inputRoomCode.trim().toUpperCase());
              setUsers(response.length)
              setRoomId(true);
            } else {
              setRoomId(false);
              setDisplayNotification({ type: 3, display: true });
            }
          };
        }
      }
    }
  };

  const handleRoomCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputRoomCode(event.currentTarget.value);
  };

  return (
    <>
      <div className="border w-fit mx-auto border-neutral-300 h-fit p-5 flex flex-col gap-2 rounded-md">
        <div className="flex items-center text-2xl font-semibold gap-2 dark:text-white transition-all duration-200">
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
        <p className="text-base text-neutral-400">
          temporary room that expires after all users exit
        </p>

        <button
          className="bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-500 text-white rounded-md py-2 text-xl mt-4 hover:bg-neutral-800 md:px-48 transition-all duration-200 hover:scale-105"
          onClick={handleClickGenerate}
        >
          Create New Room
        </button>
        <input
          onChange={(event) => setUsername(event.target.value)}
          className="border rounded text-xl p-2 outline-none focus:border-black dark:bg-black dark:text-white dark:focus:border-white transition-all duration-200"
          placeholder="Enter your name"
        ></input>

        <form className="flex gap-2" onSubmit={handleSubmitJoinRoom}>
          <input
            className="border rounded-md text-xl w-full p-2 outline-none focus:border-black dark:bg-black dark:text-white dark:focus:border-white transition-all duration-200"
            placeholder="Enter Room Code"
            onChange={handleRoomCodeChange}
          ></input>
          <button className="w-fit bg-black text-white whitespace-nowrap px-9 rounded-md py-2 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-500 transition-all duration-200 hover:scale-105">
            Join Room
          </button>
        </form>
        {roomCode === "" ? (
          <div></div>
        ) : (
          <div className="bg-neutral-100 text-center p-4 text-neutral-500 dark:bg-zinc-800 rounded-md transition-all duration-200">
            <p>Share this code with your friends</p>
            <span className="text-black dark:text-white font-medium text-2xl bg-none flex justify-center mt-2 items-center gap-2">
              <>
                {roomCode}
                <div
                  onClick={() => {  
                    navigator.clipboard.writeText(roomCode);
                    setDisplayNotification({ type: 1, display: true });
                  }}
                >
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 hover:cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                      />
                    </svg>
                  </>
                </div>
              </>
            </span>
          </div>
        )}
      </div>
      <>
        <Notification />
      </>
    </>
  );
}
