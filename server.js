const express=require('express');
const mongoose=require('mongoose');
const app=express();
const routes=require("./routes/route")
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/event_ticketing_system').then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})
app.use('/',routes);


const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})