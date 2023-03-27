const express = require('express');
const mongoose= require('mongoose');
require('dotenv').config()
const cors = require('cors');
const app = express();

//allow any of your client to access your API
app.use(cors());
app.use(express.json());


const gitGuardianRoutes= require('./routes/gitGuardianAPI');
app.use(gitGuardianRoutes)

app.all("*", (req, res) => {
    res.status(404).json({message: "Not Found"});
});


app.listen(4000, () => {
    console.log(`Server is running on port 4000` );
    }
);

