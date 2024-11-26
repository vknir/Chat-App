import { useEffect, useState } from "react";



export default function useSocket(connection:string ){
    const [socket, setSocket]= useState<WebSocket | null>(null)
 

    useEffect(()=>{
        const newSocket = new WebSocket(connection);
        newSocket.onopen =()=>{
            
            setSocket(newSocket)
            
            newSocket.onmessage= (event)=>{
                console.log(event.data)
            }           
        }
       

        return ()=> newSocket.close();
    },[])

    return socket;
}