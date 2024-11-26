import {atom} from 'recoil'

export const othersChatState= atom({
    key:'others chat state',
    default: ['']
})

export const myChatState = atom({
    key:'my chat state',
    default :['']
})