require("dotenv").config();
const connectDb = require('./connect/connectDB');
connectDb();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const dataRoute = require("./routes/dataRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000", ],
    credentials: true,
  })
)


// Routes
app.use("/api/users", userRoute);
app.use("/api/data", dataRoute);

const port = process.env.PORT || 8000;
app.listen(port , (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at port ${port}`);
    }
});


