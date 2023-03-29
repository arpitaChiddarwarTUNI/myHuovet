import React from 'react';
import {Detector} from "react-detect-offline";

const ConnectionStatus = (props) => {
    return(
        <div>
            <Detector
                render={
                    ({online}) => (
                        online ? props.childern:
                        <div style = {{
                            fontSize:"18px",
                            color: "#FFFFFF",
                            textAlign: "left",
                            marginTop:"1px",
                            marginBottom:"1px",
                            fontWeight:"bold"
                            }}>
                            <p style={{color:"#8B0000"}}>You are disconnected, form will not be saved.</p>
                            
                        </div>
                    )
                     
                }
            />
        </div>
   )
}
export default ConnectionStatus;