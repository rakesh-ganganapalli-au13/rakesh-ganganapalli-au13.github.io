import fetch from 'node-fetch'

//first function
function c1(c) {
    console.log("2.hello im a call back function");          
}
function m1(c) {
    console.log("FIRST FUNCTION OUTPUT IS")
    console.log("1.hello im a main function")
    c(c1);           //callback fun
}
m1(c1); //function calling


//second function (using fetch)
fetch('http://jsonplaceholder.typicode.com/comments')
 .then((res)=>res.json())
 .then((res)=>{
    console.log("SECOND FUNCTION OUTPUT IS")
    console.log(res)})
 .catch((error)=>console.log(error))