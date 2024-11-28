import {  roomIdState , roomCodeState} from "../store/atom";
import { useRecoilValue} from "recoil";
import Landing from "./Landing";
import ChatBox  from "./ChatBox";
import useSocket from '../hooks/useSocket'



export default function Home() {
  
  const socket =useSocket('ws://localhost:8080')
  const roomId = useRecoilValue(roomIdState);
 

  return (
    <div className="h-screen w-screen bg-white">
      {roomId ? (
        <ChatBox socket={socket}/>
      ) : (
       <Landing socket={socket}/>
      )}
    </div>
  );
}
