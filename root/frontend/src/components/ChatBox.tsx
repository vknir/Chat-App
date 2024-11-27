import { chatState, roomIdState , roomCodeState, userNameState} from "../store/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useRef } from "react";
import useSocket from '../hooks/useSocket'


export default function ChatBox() {
  const roomId = useRecoilValue(roomIdState);
  const socket =useSocket('ws://localhost:8080')
  const [chat, setChat]= useRecoilState(chatState)
  const [roomCode, setRoomCode]=useRecoilState(roomCodeState)
  const inputUserNameRef= useRef(null)

  interface SendData{
    type:string,
    payload:{
      roomId?:string,
      message?:string
    }
  }
  
  const handleSubmit= (e : React.FormEvent)=>{
    e.preventDefault()
    const msg = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value 

    const dataSend : SendData= {
      type:'message',
      payload:{
        message:msg
      }
    }
    setChat((prev)=>[...prev, msg])
  }

  const handleClickGenerate=()=>{
    
    const getRandom = () => [...Array(6)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');
    setRoomCode(getRandom().toUpperCase())
  }

  return (
    <div className="h-screen w-screen bg-white">
      {roomId ? (
        <div className="h-full flex flex-col">
          <p>temporary room that expires after all users exit</p>
          <div className="flex p-1">
            <p>Room Code:{''}</p>
          </div>
          <div className="overflow-auto">
            {chat.map((singleChat, index)=>{
              return <p key={index}>{singleChat}</p>
            })}
          </div>
          <form onSubmit={handleSubmit} className="">
            <input placeholder="Type a message..."></input>
            <button >Send</button>
          </form>
        </div>
      ) : (
        <div className="border border-neutral-600 flex flex-col">
          <div>
            <p>Real Time Chat</p>
          </div>
          <p>temporary room that expires after all users exit</p>
          <button onClick={handleClickGenerate}>Create New Room</button>
          <input ref={inputUserNameRef} placeholder="Enter your name"></input>
          <div>
            <input placeholder="Enter Room Code"></input>
            <button>Join Room</button>
          </div>
          {
            (roomCode === '')?
            <div></div>
            :
          <div>
            <p>Share this code with your friends</p>
            <span>{roomCode}</span>
          </div>
          }
        </div>
      )}
    </div>
  );
}
