import React from "react"
import { ObjectValue } from "./ObjectValue"

export const ArrayValue = (props) => {

  if(Array.isArray(props.item)) {
    return (
      <>
        {
        props.item.map((x, i) => {
            return ( 
              typeof x === 'object' ? <span key={i}><ObjectValue pkg={x} _key={i} state={1}/></span> : <p key={i}>{x}</p> 
            )
        }) 
        }
      </>
    )
  }
  return (
      <>
        {

        // props.pkg[1].map((a, i) => {
          // if (typeof a === 'object') {
          //   return (
          //     <ObjectValue pkg={a} _key={i}/>
          //   )
          // }
        // })
        }
      </>
  )
}
