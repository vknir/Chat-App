import {atom} from 'recoil'

interface Msg{
    msg:string,
    username:string,
    mine:boolean
}

interface Chat{
    key:string,
    default: Msg[]
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

export const displayNotificationState= atom({
    default:{
        type:0,
        display:false
    },
    key:'display notification state'
})