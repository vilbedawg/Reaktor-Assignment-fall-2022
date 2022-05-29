import React from "react"

export const ObjectValue = (props) => {
    return (
        <div key={props._key} className="pkg inner">
            {Object.entries(props.pkg).map((x, i) => {
                return (
                    <div key={i}>
                    <div className="pkg-keys">
                        <p>{x[0]}</p>
                    </div>

                    <div className="pkg-values">
                        <p>{x[1]}</p>
                    </div>
                    </div>
                )
               

            })}
            
        </div>
    )
}
