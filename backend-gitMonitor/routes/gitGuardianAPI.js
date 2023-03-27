const express = require('express');
const axios = require('axios');


const router = express.Router();
// const API_KEY = process.env.TOKEN_GGSHIELD; => test token

//health check
router.get('/health', async (req, res) => {
    try {
        const api= req.headers.authorization;
        const result = await axios.get(`https://api.gitguardian.com/v1/health`, {
            headers: {
                'Authorization': api
            }
        });
        if (result.data.detail=== "Valid API key.") {
            res.status(200).json('ok check');
        } 
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


// get all incidents
router.get('/incidents/secrets', async (req, res) => {
    try {
        const api= req.headers.authorization;
        const result = await axios.get(`https://api.gitguardian.com/v1/incidents/secrets`, {
            headers: {
                'Authorization': api
            }
        });
        if (result.status === 200) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ msg: 'no results' });
        }
        
    } catch (error) {
        res.status(400).json({ msg: error.message });

    }
});
// get incident by id
router.get('/incidents/secrets/:id', async (req, res) => {
    try {
        const api= req.headers.authorization;
        const incidentId = req.params.id;
        const result = await axios.get(`https://api.gitguardian.com/v1/incidents/secrets/${incidentId}`, {
            headers: {
                "Authorization": api
            }
        });
        if (result.status === 200) {
            res.status(200).json(result.data );
        } else {
            res.status(400).json({ response: 'Error' });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// resolve incident by id
router.post('/incidents/secrets/:id/resolve', async (req, res) => {
    try {
        const api= req.headers.authorization;
        const incidentId = req.params.id;
        
        const body= {
            "secret_revoked": true
        }

        
        const result = await axios.post(`https://api.gitguardian.com/v1/incidents/secrets/${incidentId}/resolve`, body, {
            headers: {
                "Authorization": api
            }
        });
        
        if (result.status === 200) {
            res.status(200).json(result.data );
        } else {
            res.status(400).json({ msg: 'Error' });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
//reopen incident by id
router.post('/incidents/secrets/:id/reopen', async (req, res) => {
    try {
        const api= req.headers.authorization;
        const incidentId = req.params.id;
        const result = await axios.post(`https://api.gitguardian.com/v1/incidents/secrets/${incidentId}/reopen`, {},{
            headers: {
                "Authorization": api
            }
        });
        if (result.status === 200) {
            res.status(200).json(result.data );
        } else {
            res.status(400).json({ msg: 'Error' });
        }
    } catch (error) {
        res.status(403).json({ msg: error.message });
    }

});

/* return list of all repo private/public */
router.get('/sources', async (req, res) => {
    try {
        const api= req.headers.authorization
        
        const pages= req.query.per_page;
        
        
        const result = await axios.get(`https://api.gitguardian.com/v1/sources?per_page=${pages?pages:20}`, {
            headers: {
                "Authorization": api
            }
        });
        
        if (result.status === 200) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ msg: 'Error' });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });

    }
});



module.exports = router;