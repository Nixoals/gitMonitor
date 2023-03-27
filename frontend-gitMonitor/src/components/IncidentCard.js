import { useEffect, useState, useRef, useLayoutEffect } from "react"
import axios from "axios"
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import HeartBeat from "./HeartBeat"
import IncidentCardDetails from "./IncidentCardDetails"

import './IncidentCardStyle.css'

const url= "http://localhost:4000/"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'white',
    color: 'black',
    border: '2px solid #fff',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
  };


const IncidentCard = ({ incidents, api, validAPI, setError, refresh }) => {

    const cardRef = useRef(null)
    const {occurrences_count, date, status, tags, id} = incidents
    const [puclic, SetPublic] = useState(false)
    const [historical, SetHistorical] = useState(false)
    const [dataIncidentID, setDataIncidentID] = useState()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i] === "PUBLIC") {
                SetPublic(true)
            } else if (tags[i] === "FROM_HISTORICAL_SCAN") {
                SetHistorical(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchIncidentById = async (id) => {
        if (validAPI){
            setError('')
            try {
                const headers = {
                    headers:{
                        "authorization": "token " +api
                    }
                }
                const response= await axios.get(url+`incidents/secrets/${id}`, headers)
                const data = response.data
                if (response.status===200){
                    setDataIncidentID(data)
                    handleOpen()
                } else {
                    setError('Not Authorized')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setError('An error occured with your API KEY')
        }
    }

    const resolveIncident = async (id) => {
        
        if (validAPI){
            setError('')
            try {
                const headers = {
                    headers:{
                        "authorization": "token " +api
                    }
                }
                const body= {
                    "secret_revoked": true
                }
                const response= await axios.post(url+`incidents/secrets/${id}/resolve`, body, headers)
                //const data = response.data
                if (response.status===200){
                    refresh(true)
                } else {
                    setError('Not Authorized')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setError('An error occured with your API KEY')
        }
    }

    const reopenIncident = async (id) => {
        
        if (validAPI){
            setError('')
            try {
                const headers = {
                    headers:{
                        'authorization': 'token ' +api
                    }
                }
                const response= await axios.post(url+`incidents/secrets/${id}/reopen`,{}, headers)
                //const data = response.data
                if (response.status===200){
                    refresh(true)
                } else {
                    setError('Not Authorized')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setError('An error occured with your API KEY')
        }
    }



    useLayoutEffect(() => {
        const card = cardRef.current
        card.addEventListener("mousemove", function(e) {
            const divRect = card.getBoundingClientRect();
            const angleY = (e.clientX - divRect.left) / divRect.width * 10 - 5;
            const angleX = (e.clientY - divRect.top) / divRect.height * 10 - 5;
            card.style.transform = `perspective(800px) rotateY(${angleY}deg) rotateX(${-angleX}deg)`;
          });

        card.addEventListener("mouseout", function(e) {
            card.style.transform = `rotate(0deg)`;
          }
        )

    }, [])




    return <>
        <section 
            ref={cardRef} 
            className="card-incident-wrapper"
            >
                
            <div 
                className="card-incident"
                onClick={() => {
                    fetchIncidentById(id)
                }}
            >
                <div>Incident ID: {id}</div>
                <div>Occurences in source: {occurrences_count}</div>
                <div className={status==="RESOLVED"?"incident-card-status-revoked":"incident-card-status-triggered"}>{status}</div>
                {puclic && <div>Public Source</div>}
                {historical && <div>Historical source</div>}
                {/* {secret_revoked && <div>secret_revoked</div>} */}
                <div>Date: {date.split('T')[0]}</div>
                <div className="heart-beat-container">
                    <h2>{occurrences_count>1? <div>Check all incidents</div> : <div>Check incident</div>}</h2>
                    <HeartBeat bpm={4*(1*1/occurrences_count*1.5)} height={150} color={`hsla(${Math.round(50/occurrences_count)}, 100%, 50%, 1)`}></HeartBeat>
                </div>
            </div>
        </section>
        {dataIncidentID &&
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <h1 className="card-details-title">{dataIncidentID.occurrences_count > 1 ? `${dataIncidentID.occurrences_count} occurences found`: `${dataIncidentID.occurrences_count} occurence found`}</h1>
                {dataIncidentID.occurrences.map((occurrence) => {
                    return <IncidentCardDetails key={occurrence.id} data={occurrence}></IncidentCardDetails>
                })}
                <div className="resolve-reopen-button">
                    <Button onClick={()=>{
                        if (dataIncidentID.status==='TRIGGERED'){
                            resolveIncident(id)
                            handleClose()
                        } else {
                            reopenIncident(id)
                            handleClose()
                        }

                    }}>{dataIncidentID.status==='TRIGGERED' ? 'Mark as resolved': 'reopen'}</Button>
                </div>
              </Box>
            </Fade>
          </Modal>

        }

    </>
}

export default IncidentCard