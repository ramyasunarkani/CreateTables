const express=require('express');
const connection=require('./util/db-connection');
const cors=require('cors');
const tableRoutes=require('./routes/tableRoutes');
const app=express();


app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.send('welcome')
})
app.use('/tables',tableRoutes)

connection.sync().then(() => {
    app.listen(4000,()=>{
    console.log('server running at port 4000')
})
}).catch((err) => {
    console.error('db not sync',err)
    
});
