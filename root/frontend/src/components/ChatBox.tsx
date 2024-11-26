import {othersChatState, myChatState} from '../store/atom'
import {  useRecoilState } from "recoil"
import useSocket from '../hooks/useSocket'

export default function ChatBox(){
    const [myChat, setMyChat] = useRecoilState(myChatState)
    const [othersChat , setOthersChat]= useRecoilState(othersChatState)
    const socket= useSocket('ws://localhost:8080')



    if(socket !=null)
    {
        socket.onmessage =(event :MessageEvent)=>{
            console.log(event.data)
            setOthersChat((prev)=> [...prev, event.data])
        }
    }

    
    function handleSubmit (event: React.FormEvent){
        event.preventDefault()
        if(socket != null)
        {
            setMyChat(prev=>[
                ...prev, ((event.target as HTMLFormElement)[0] as HTMLInputElement).value
            ])
            socket.send( ((event.target as HTMLFormElement)[0] as HTMLInputElement).value)
        }
    }

    return <div>
        {othersChat.map((chat, index)=><p key={index}>{chat}</p>)}

        {myChat.map((chat, index)=><p key={index}>{chat}</p>)}
        <form onSubmit={handleSubmit}>
            <input></input>
            <button type='submit'>send!</button>
        </form>
    </div>
}