import React from 'react';
import {Detector} from "react-detect-offline";
import WifiOffIcon from '@mui/icons-material/WifiOff';

const InternetConnection = (props) => {
    return(
        <div>
            <Detector
                render={
                    ({online}) => (
                        online ? props.childern:
                        <div style ={{
                            textAlign:"center",
                            fontSize:"11px",
                            padding: "1px",
                            marginTop:"3px",
                            backgroundColor:"#fecf6d",
                            borderRadius: "8px",
                            wordSpacing: "1px"
                        }} >
                            <div style = {{
                                display: "flex", 
                                justifyContent: "center", 
                                padding:"5px"
                                }}>
                                <span style={{ 
                                    fontSize: "25px", 
                                    marginRight: "10px", 
                                    fontWeight:"500"
                                }}> Olet offline-tilassa.</span>
                                <span> 
                                    <WifiOffIcon sx={{ 
                                        fontSize: "38px", 
                                        color:"#00BFFF" 
                                    }}></WifiOffIcon>
                                </span>
                            </div>
                        </div>
                    )
                }
            />
        </div>
   )
}
export default InternetConnection;