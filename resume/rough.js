const http = require('http');

const ap =(req ,res)=>{
   console.log(req);
}



const server = http.createServer((req ,res )=>{
console.log(req.url ,req.methond ,req.headers);

if(req.url === "/"){
   console.log();
}
else if(req.url === "cart"){
   res.write("<h1>welcome o </h1>")
}




});



const port =3000 ;
server.listen(port ,()=>{
   console.log(`server running on port ${3000}`);
})