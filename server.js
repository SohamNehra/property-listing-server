require('dotenv').config()

const express=require("express");
const app=express();
const db = require('./database')
const port=process.env.PORT||5000
const bcrypt = require('bcryptjs');
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.json());

require('./model/user');
db.model("User");

app.use(require('./routes/property'))

app.use(require('./routes/auth'));

const corsOptions = {
  origin: 'https://property-listing-client.vercel.app',
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`The Server is running on port: ${port}`);
})


