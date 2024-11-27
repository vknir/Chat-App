import {atom} from 'recoil'



interface Chat{
    key:string,
    default: string[]
}

const chatStateInit : Chat={
    key:'chat state',
    default:[]
} 

export const chatState= atom( chatStateInit)

export const roomIdState = atom({
    key:'roomdId state',
    default:false
})

export const roomCodeState =atom({
    key:'room code state',
    default:''
})

export const userNameState= atom({
    key:'user name state ',
    default:''
})