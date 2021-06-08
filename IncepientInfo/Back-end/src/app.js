const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 8888;


app.use(cors());

app.use(express.json())

/**
 method : GET 
 api   : /api/posts/:index
 */
app.get('/api/posts/:index',async(req,res)=>{
    
    let {index} = req.params
    index  = index>0? parseInt(index +"0") : index
    let arr = []

    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/posts')
        const data = await responce.json()
        for(let i=index;i<index+10;i++){
            arr.push(data[i])
        }
        res.status(200).json({posts:arr})
    } catch (error) {
        res.status(400).json({error:"something went wrong"})
    }
})

//listening port 
app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
});