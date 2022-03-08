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
    const { id } = req.body;
    const { name } = req.body;
    const { role } = req.body;
    const { active } = req.body || false;

    if (!name || !role){
        res.status(400).json("Invalid input data");
    }

    const orator = new Orator(id, name, role, active);

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

app.put("/orators/:oratorId", (req, res) => {
    const { oratorId } = req.params;
    const { name } = req.body;
    const { role } = req.body;
    const { active } = req.body || false;

    readFile(oratorsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }

        let parsedData = JSON.parse(data);

        const foundOratorIndex = parsedData.findIndex( (orator) => orator.id == oratorId );

        if( foundOratorIndex === -1 ){
            return res.status(404).json({
                message: 'Orator not found',
                success: false,
                orators: parsedData
            });
        }else{
            if(active){
                parsedData.forEach((orator) => {
                    orator.active = false;
                });
                const newOrator = new Orator(Number(oratorId), name, role, active);
                parsedData.splice(foundOratorIndex, 1, newOrator);
            }
        }
        writeFile(oratorsFile, JSON.stringify(parsedData, null, 2), (err) => {
            if(err){
                console.log("Filed to write updated data to file");
                return res.status(500).json("Filed to write updated data to file");
            }
            
            console.log("Updated file sucessfully");
            return res.status(200).json({
                message: 'Orator found and updated',
                success: true,
                orators: parsedData
            });

        });
    });

    
});

app.listen(PORT, () => {
    console.log(`SERVIDOR INICIADO NA PORTA ${PORT}`);
});