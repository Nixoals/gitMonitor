import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { icones } from '../data/externalData'

import './RepoCardStyle.css'

const RepoCard = ({ repoData, publicChecked, privateChecked, incidentChecked, refresh }) => {
    const {full_name, open_incidents_count, url, type, visibility} = repoData
    const cardRef = useRef(null)
    const [displayPublic, setDisplayPublic] = useState()
    const [displayPrivate, setDisplayPrivate] = useState()
    const [displayIncident, setDisplayIncident] = useState()
    const [displayAll, setDisplayAll] = useState(true)


    useEffect(() => {
        refresh()
        if (publicChecked && privateChecked && incidentChecked){
            return setDisplayAll(true)
        }
        if (publicChecked === true && visibility==='public'){
            setDisplayPublic(publicChecked)
        } else{
            setDisplayPublic(false)
        }
        if (privateChecked === true && visibility==='private'){
            setDisplayPrivate(privateChecked)
        } else {
            setDisplayPrivate(false)
        }
        if (incidentChecked === true && open_incidents_count > 0){
            setDisplayIncident(incidentChecked)
        } else {
            setDisplayIncident(false)
        }
        
        if (publicChecked === false || privateChecked === false || incidentChecked === false){
            return setDisplayAll(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicChecked, privateChecked, incidentChecked ])

    useLayoutEffect(() => {
        const card = cardRef.current
        card.addEventListener("mousemove", function(e) {
            const divRect = card.getBoundingClientRect();
            const angleY = (e.clientX - divRect.left) / divRect.width * 10 - 5;
            const angleX = (e.clientY - divRect.top) / divRect.height * 10 - 5;
            card.style.transform = `perspective(1000px) rotateY(${angleY}deg) rotateX(${-angleX}deg)`;
          });
        card.addEventListener("mouseout", function(e) {
            card.style.transform = `rotate(0deg)`;
            
          }
        )
    }, [])


    return <>
        <section ref={cardRef} className={`repo-card-wrapper ${displayAll ? "repo-card-all": ''} ${displayPublic ? 'repo-card-public' : ''} ${displayPrivate ? 'repo-card-private': ''} ${displayIncident ? 'repo-card-incident': ''}`}>
            <div className="repo-card">
                <div className='repo-full-name'>
                    <h2 >{full_name}</h2>
                </div>
                <div>Incidents: {open_incidents_count}</div>
                <a href={url} target='_blank' rel="noreferrer">Source Url</a>
                <div>Visibility: {visibility}</div>
                <div>Source: {type} <span>{icones[type]}</span> </div>
            </div>
        </section>
    </>
}

export default RepoCard