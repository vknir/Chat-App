import {  roomIdState , roomCodeState} from "../store/atom";
import { useRecoilValue} from "recoil";
import Landing from "./Landing";
import ChatBox  from "./ChatBox";
import useSocket from '../hooks/useSocket'



export default function Home() {
  
  const socket =useSocket('ws://localhost:8080')
  const roomId = useRecoilValue(roomIdState);
 

  return (
    <div className="h-fit w-screen bg-white px-4 py-6 font-jetbrains flex ">
      {roomId ? (
        <ChatBox socket={socket}/>
      ) : (
       <Landing socket={socket}/>
      )}
    </div>
  );
}
