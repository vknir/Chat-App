import { RecoilRoot } from "recoil"
import Home from "./components/Home" 


export default function App(){
    
  
    
    
    
    return( <div className="h-screen flex justify-center items-center">
    <RecoilRoot>
      <Home/>
    </RecoilRoot>
    
    </div>);
}