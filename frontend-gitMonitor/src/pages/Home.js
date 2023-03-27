import { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import RepoCard from "../components/RepoCard";
import IncidentCard from "../components/IncidentCard";
import './HomeStyle.css'

const url= "http://localhost:4000/"

const theme = createTheme({
	palette: {
		primary: {
			main: '#2272FF',
		},
		mode: 'dark',
		text: {
			primary: '#2272FF',
			secondary: 'rgba(255,255,255,1)',
		},
		divider: 'rgba(255,255,255,0.12)',
	},
	typography: {
		fontFamily: 'rigid-square',
		fontSize: 15,
	},
	transitions: {
		duration: { complex: '500' },
	},
});


const Home = () => {
    const [api, setApi]= useState('')
    const [validAPI, setValidAPI]= useState(false)
    const [error, setError]= useState('')
    const [isLoaded, setIsLoaded] = useState(false);
    const [dataIncident, setDataIncident] = useState();
    const [repoData, setRepoData] = useState();
    const [refresh, setRefresh] = useState(false)
    const [publicChecked, setPublicChecked] = useState(true);
    const [privateChecked, setPrivateChecked] = useState(true);
    const [incidentChecked, setIncidentChecked] = useState(true);


    useEffect(() => {
        if (api && api.length > 50){
            const fetchCheckHealth = async () => {
                try {
                    const headers = {
                        headers: {
                            'authorization': 'token ' +api
                        }
                    }
                    const response = await axios.get(url+`health`, headers)
                    console.log(response.data)
                    if (response.data==="ok check"){
                        setValidAPI(true)
                        setError('')
                        console.log("API KEY VALID")

                    }
                } catch (error) {
                    setValidAPI(false)
                    setDataIncident('')
                    setRepoData('')
                }
            }
            fetchCheckHealth()
            return 
        } 
    }, [api])

    useEffect(() => {
        if (validAPI && refresh){
            if (repoData.data?.length > 0){
                console.log(repoData.data)
                fetchRepositories()
            } else if (dataIncident.length>0){
                fetchIncident()
            }
            setRefresh(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])


    //retreive incident
    const fetchIncident = async () => {
        if (validAPI){
            setError('')
            const headers = {
                headers:{
                    "authorization": "token " +api
                }
            }
            const response= await axios.get(url+`incidents/secrets`, headers)
            const data = response.data
            setPublicChecked(true)
            setPrivateChecked(true)
            setIncidentChecked(true)
            setDataIncident(data)
            setRepoData('')
            setIsLoaded(false)
            
        } else {
            setError('An error occured with your API KEY')
        }
    }
    

    //retrieve list of repositories
    const fetchRepositories = async () => {
        if (validAPI){
            setError('')
            try {
                const pages= 100;
                const headers = {
                    headers: {
                    'Authorization': 'token ' +api
                    }
                }
                const response= await axios.get(url+`sources?per_page=${pages?pages:20}`, headers)
                const data = response.data
                if (response.status===200){
                    
                    const result= {repoCount:data.length, data}
                    
                    setRepoData(result)
                    setDataIncident('')
                    setIsLoaded(false)
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

    const handlePublic = (e) => {
        setPublicChecked(e.target.checked)
    }
    const handlePrivate = (e) => {
        setPrivateChecked(e.target.checked)
    }
    const handleIncident = (e) => {
        setIncidentChecked(e.target.checked)   
    }



    return <>
        <section className="home-conainer">
            <ThemeProvider theme={theme}>
                
                <div className="api-input-container">
                    <div className="api-input-value">
                        <TextField
                            className="api-input"
                            required
                            label="GGSHIELD API KEY"
                            onChange={(e) => setApi(e.target.value)}
                            fullWidth
                        ></TextField>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <Stack spacing={2} direction={'row'}>
                    <Button variant="contained" onClick={() => {
                        if (!dataIncident){
                            setIsLoaded(true)
                            fetchIncident()
                        }
                        }
                    }
                    >Retrieve Incidents</Button>
                    <Button variant="contained" onClick={() =>{
                        if (!repoData){
                            setIsLoaded(true)
                            fetchRepositories()
                        }
                        }

                    }
                    >List all sources</Button>

                </Stack>
            </ThemeProvider>
        
        {repoData && !isLoaded &&
        <>
            <div className="occurence-count">
                <h1>Source count: {repoData.repoCount}</h1>
            </div>
            <section className="source-list-container">
                <div className="checkbox-container">
                    <ThemeProvider theme={theme}>
                        <div className="public-checkbox">
                            <Checkbox onChange={
                                (e) => {
                                    handlePublic(e)
                                }
                            } defaultChecked></Checkbox>
                        </div>
                        <label htmlFor="public-checkbox"> Public</label>
                        <div className="private-checkbox">
                            <Checkbox onChange={
                                (e) => {
                                    handlePrivate(e)
                                }
                            } defaultChecked></Checkbox>
                        </div>
                        <label htmlFor="private-checkbox"> Private</label>
                        <div className="incident-checkbox">
                            <Checkbox onChange={
                                (e) => {
                                    handleIncident(e)
                                }
                            } defaultChecked></Checkbox>
                        </div>
                        <label htmlFor="incident-checkbox"> Incident</label>
                    </ThemeProvider>
                </div>
                {repoData.data.map((repo) => (
                    <RepoCard key={repo.id} 
                    repoData={repo} 
                    publicChecked={publicChecked} 
                    privateChecked={privateChecked} 
                    incidentChecked={incidentChecked}
                    api={api} 
                    validAPI={validAPI} 
                    setError={setError} 
                    refresh={setRefresh}
                />
                ))}
            </section>
        </>
        }
        {dataIncident && !isLoaded &&
        <>
            <div>
                <div className="occurence-count">
                    <h1 >Incident count: {dataIncident.length}</h1>
                </div>
                <div className="incident-card-container">
                    {dataIncident.map((incidents) => (
                        <IncidentCard key={incidents.id} 
                        incidents={incidents} 
                        api={api} 
                        validAPI={validAPI} 
                        setError={setError} 
                        refresh={setRefresh}></IncidentCard>
                    ))}
                </div>
            </div>
        </>
        }
        </section>
    </>
}

export default Home
