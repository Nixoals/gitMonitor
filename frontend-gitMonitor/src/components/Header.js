import HeartBeat from './HeartBeat'
import './HeaderStyle.css'

const Header = () => {
    return <>
        <section className='header-container'>
            <HeartBeat color={'green'} bpm={5} height={200}></HeartBeat>
            <h1>GitMonitor</h1>
            <div className='header-info'>
                <p>Use your gitGuardian API key to display incident data.</p>
                <p>Your API key is never stored</p>
            </div>
        </section>
    </>
}

export default Header