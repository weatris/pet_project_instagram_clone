const express=require('express');
const bodyParser = require("body-parser");
const cors  = require("cors");
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const {sequelize} = require('./models/index.js');


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use('/images', express.static('media/'))
app.use(bodyParser.urlencoded({extended: true}));

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
const  PORT = process.env.PORT||7000;


sequelize.sync().then(()=>{
    console.log('DB connected !')
})

app.use('/',router);

app.listen(PORT,() => {
    console.log("Started on PORT : "+PORT);
})

