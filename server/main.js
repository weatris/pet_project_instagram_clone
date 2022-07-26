const express=require('express');
const bodyParser = require("body-parser");
const cors  = require("cors");
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const {sequelize} = require('./models/index.js');
const http = require('http');
const {Server} = require('socket.io');
const {HandleComment, HandleLike} = require('./controllers/watch');

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
app.use('/',router);
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods: ['GET','POST']
  }
})

io.on('connection',(socket)=>{
  console.log(`User connected : ${socket.id}`);
  socket.on('handle_comment',(data)=>{
    HandleComment(data,socket);
  })
  socket.on('handle_like',(data)=>{
    HandleLike(data,socket);
  })
})

sequelize.sync().then(()=>{
    console.log('DB connected !')
})


const  PORT = process.env.PORT||7000;
server.listen(PORT,() => {
    console.log("Started on PORT : "+PORT);
})

