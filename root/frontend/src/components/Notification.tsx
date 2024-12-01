import { useEffect } from "react"
import {  useRecoilState } from "recoil"
import { displayNotificationState } from "../store/atom"



export default function Notification(){
    
    const [displayNotification,setDisplayNotification]=useRecoilState(displayNotificationState)
   
    useEffect(()=>{
        const ref= setTimeout(()=>{
            setDisplayNotification((prev)=>{
                return { type: prev.type, display:false}
            })
            clearTimeout(ref)
        },2500)
    },[displayNotification.display])
    
    return <div className={`${displayNotification.display ? 'opacity-1':'opacity-0'} mx-auto  absolute z-50 bottom-5 sm:right-10 transition-opacity duration-200  border border-black rounded p-2 bg-white shadow dark:bg-black dark:text-white dark:border-white`}>
    {
       displayNotification.type == 0 ? <p>Please enter a room code</p>:

       displayNotification.type== 1 ? <p>Room code copied to clipboard!</p> :

       displayNotification.type== 2 ? <p>Please enter your name</p>:

       displayNotification.type == 3 ? <p>Room not found</p>:

       displayNotification.type == 4 ? <p>User has joined</p> : 

       displayNotification.type== 5 ? <></>:<></>
    }
    </div>
}