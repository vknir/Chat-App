import { roomIdState, roomCodeState } from "../store/atom";
import { useRecoilValue } from "recoil";
import Landing from "./Landing";
import ChatBox from "./ChatBox";
import useSocket from "../hooks/useSocket";
import Mode from "./Mode";

export default function Home() {
  const socket = useSocket("https://chat-app-hax4.onrender.com");
  const roomId = useRecoilValue(roomIdState);

  return (
    <div className="h-screen w-screen bg-white dark:bg-black px-4 py-7 font-jetbrains flex items-center justify-center transition-all duration-500 ">
      {roomId ? <ChatBox socket={socket} /> : <Landing socket={socket} />}
      <Mode />
    </div>
  );
}
