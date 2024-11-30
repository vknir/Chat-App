import { chatState, roomCodeState } from "../store/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { displayNotificationState } from "../store/atom";
import Notification from "./Notification";

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

export default function ChatBox({ socket }: Props) {
  const roomCode = useRecoilValue(roomCodeState);
  const [chat, setChat] = useRecoilState(chatState);
  const setDisplayNotification = useSetRecoilState(displayNotificationState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value;
    const myMsg = { msg: msg, mine: true };

    const dataSend: SendData = {
      type: "message",
      payload: {
        message: msg,
        roomId: roomCode,
      },
    };

    if (socket != null) {
      socket.onmessage = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        const otherMsg = { msg: response.message, mine: false };
        console.log(otherMsg);
        setChat((prev) => [...prev, otherMsg]);
      };

      socket.send(JSON.stringify(dataSend));
    }
    setChat((prev) => [...prev, myMsg]);
  };

  return (
    <>
      <div className="h-full flex flex-col border p-5 gap-2 rounded-md">
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

        <div className="flex justify-between items-center text-sm text-neutral-500 rounded-md p-4 bg-neutral-100 dark:bg-zinc-800 transition-all duration-200">
          <div className="flex items-center gap-2">
            <p>
              Room Code:
              <span className="font-bold text-md ml-1">{roomCode}</span>
            </p>
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
                  className="size-4 hover:cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
              </>
            </div>
          </div>

          <div className="">
            <p>Users:</p>
            {""}
          </div>
        </div>
        <div className="overflow-auto border h-full rounded-md">
          {chat.map((singleChat, index) => {
            return (
              <p key={index + "" + singleChat.msg.length}>{singleChat.msg}</p>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4 justify-between">
          <input
            className="border rounded-md text-lg w-full p-2 outline-none focus:border-black dark:bg-black dark:text-white dark:focus:border-white transition-all duration-200"
            placeholder="Type a message..."
          ></input>
          <button className="text-nowrap bg-black rounded py-1 px-4 text-white dark:bg-white dark:text-black transition-all duration-200">
            Send
          </button>
        </form>
      </div>
      <>
        <Notification />
      </>
    </>
  );
}
