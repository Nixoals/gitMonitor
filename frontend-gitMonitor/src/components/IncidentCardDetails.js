import { useEffect } from "react"
import {icones} from '../data/externalData'
import "./IncidentCardDetailsStyle.css"

const IncidentCardDetails = ({data}) => {
    const {author_name, date, filepath, presence, matches, url} = data

    useEffect(() => {
    }, [])
    
    return <>
        <div className="incident-details-container">
            <div>File: {filepath}</div>
            <div className="incident-details-name">Author name: <span style={{fontStyle: 'italic', fontWeight:600}}>{author_name}</span></div>
            <div>Date: {date.split('T')[0]}</div>
            <div>Type: {matches[0].name}</div>
            <div>Is present: {presence? 'true': 'false'}</div>
            <a href={url}>{icones.goto} Check source</a>
        </div>
    </>
}
export default IncidentCardDetails