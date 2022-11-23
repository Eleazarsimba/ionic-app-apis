const express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

const port = process.env.PORT;

app.use(cors({
  // origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const apiroute = require('./src/routes/apiRoutes');
app.use(apiroute)

app.listen(port || 3001, () => {
    console.log(`The app is running in port ${port}`);
})