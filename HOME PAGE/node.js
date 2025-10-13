const http =require('http');
 

const server=http.createServer((req ,res) =>{
   console.log(req,url , req.methond);
   
})


const port =3000;
server.listen(port ,()=>{
   console.log(`server is running on http//localhost{port}`);
});