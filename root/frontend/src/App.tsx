import { RecoilRoot } from "recoil"
import ChatBox from "./components/ChatBox" 
import List from "./components/List";

export default function App(){
    
  
    
    
    
    return( <div className="h-full">
    <RecoilRoot>
      <ChatBox/>
    </RecoilRoot>
    
    </div>);
}