import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

let data = [];
let id = 0;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/getAllUser", (req, res) => {
    res.send(data);
})

app.post("/addUser", (req, res) => {
    const {email, password} = req.body;
    data.push({id: id++, email, password});
    res.status(201).send(data);
})

app.put("/getPwd/:id", (req,res)=>{
    const id = req.params.id;
    const user =data.find((user)=> user.id==id);
    if(user){
        res.status(200).send(user);
    }else{
        res.status(404).send("User not found");
    }
})

app.delete("/deleteUser/:id", (req, res) => {
    const index = data.findIndex((user) => user.id == req.params.id);
    data.splice(index, 1);
    data.length == 0 ? res.status(404).send("User not found") : res.status(200).send(data);
})

// app.delete("/deleteUser/:id", (req, res) => {
//     const id = req.params.id;
//     data = data.filter((user) => user.id != id);
//     data.length == 0 ? res.status(404).send("User not found") : res.status(200).send(data);
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}...`);
})