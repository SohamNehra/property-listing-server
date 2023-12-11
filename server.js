require('dotenv').config()

const express=require("express");
const app=express();
const db = require('./database')
const port=process.env.PORT||5000
const cors = require("cors");

app.use(express.json());
const corsOptions = {
  origin: 'https://property-listing-client.vercel.app',
};

app.use(cors(corsOptions));

require('./model/user');
db.model("User");
require('./model/property');
db.model("Property");

app.use(require('./routes/property'))

app.use(require('./routes/auth'));

app.listen(port, () => {
  console.log(`The Server is running on port: ${port}`);
})
