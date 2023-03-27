import {useRef } from "react";
import "./HeartBeatStyle.css";


const HeartBeat = ({bpm, color, height}) => {
    const heartBeat = useRef(null);

    return (
        <div className="monitor-box" >
            <svg  x="0px" y="0px" viewBox="0 0 400 150" style={{enableBackground: 'new 0 0 400 150', maxHeight:`${height}px`}} xmlSpace="preserve" >
                <path
                    ref={heartBeat}
                    className="heart-beat"
                    style={{animation: `dash ${bpm}s cubic-bezier(.89,-0.01,.01,.99) infinite`}}
                    d="M69.3,77.6h64.6c0,0,9.8,4.7,11.8,9.6
                    c2,4.9,4,0,4,0l9.1-19.8c0,0,0.4-2.7,2-2.7c1.6,0,2.4,2.9,2.4,2.9l5.1,9.4c0,0,3.6,1.5,5.8,1.5s5.3-0.3,6-1.5
                    c0.7-1.2,3.6-11.4,3.8-14.1c0.2-2.7,3.3-38,3.3-38s-0.4-3.1,1.3-3.3s1.8,4.4,1.8,4.4l10.2,98.9c0,0,1.1,3.8,2.4,3.6
                    c1.3-0.2,2.4-9.8,2.4-9.8l8.7-63.6c0,0,0.4-3.6,2-3.8c1.6-0.2,2.4,3.8,2.4,3.8l2.7,16.2c0,0,0.7,3.8,2.2,3.7
                    c1.6-0.1,2.9-3.4,2.9-3.4l1.3-3c0,0,1.1-2.8,2.4-2.8c1.3,0,10.2,20,10.2,20s1.3,2.9,2.9,2.9c1.6,0,6.9-11.1,8.9-11.1
                    c2,0,78.7,0,78.7,0" stroke={color} fill="none" strokeWidth="10" strokeMiterlimit="10"
                />
            </svg>
        </div>
    );
  };
  
  export default HeartBeat;