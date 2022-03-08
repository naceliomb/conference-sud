import express from "express";
import fs, { read, readFile, readFileSync, writeFile, writeFileSync } from "fs";
import Orator from "./src/models/Orator.js";
import path from "path";
const oratorsFile = "./orators.json";

const app = express();
const PORT = 5000;  

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    return res.sendFile(path.join(path.resolve()+"/src/views/index.html"));
});


app.get("/orators", (req, res) => {
    readFile(oratorsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }

        const parsedData = JSON.parse(data);

        res.status(200).json(parsedData);
        
    });
});

app.post("/orators", (req,res) => {
    const { name } = req.body;
    const { role } = req.body;

    if (!name || !role){
        res.status(400).json("Invalid input data");
    }

    const orator = new Orator(name, role);

    readFile(oratorsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }

        const parsedData = JSON.parse(data);
        const newData = [...parsedData, orator];

        writeFile(oratorsFile, JSON.stringify(newData, null, 2), (err) => {
            if(err){
                console.log("Filed to write updated data to file");
                return res.status(500).json("Filed to write updated data to file");
            }

            console.log("Updated file sucessfully");
        });
    });
    res.status(200).json(orator);

});


app.listen(PORT, () => {
    console.log(`SERVIDOR INICIADO NA PORTA ${PORT}`);
});