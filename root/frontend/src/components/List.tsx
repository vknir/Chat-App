interface Content{
    title:String,
    status:boolean
}

interface ListContent {
    item: Content
}
  
export default function List( {item} :ListContent ){
    return <><div>{item.title}</div><div>{item.status}</div></>
  }