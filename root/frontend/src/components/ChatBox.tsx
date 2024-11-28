import { chatState,roomCodeState} from "../store/atom";
import { useRecoilState,useRecoilValue } from "recoil";

interface Props{
    socket:WebSocket|null
  }

export default function ChatBox({socket}:Props)
{
    
    const roomCode =useRecoilValue(roomCodeState)
    const [chat, setChat]= useRecoilState(chatState)
  
 

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
        message:msg,
        roomId:roomCode
      }
    }
    
    socket?.send(JSON.stringify(dataSend))
    setChat((prev)=>[...prev, msg])
  }

    return <>
        <div className="h-full flex flex-col">
          <p>temporary room that expires after all users exit</p>
          <div className="flex p-1">
            <p>Room Code:{roomCode}</p>
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
    </>
}