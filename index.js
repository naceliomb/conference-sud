import express from "express";
import fs, { createReadStream, read, readFile, readFileSync, writeFile, writeFileSync } from "fs";
import Orator from "./src/models/Orator.js";
import Music from "./src/models/Music.js";
import Ata from "./src/models/Ata.js";
import path from "path";
const oratorsFile = "./orators.json";
const musicsFile = "./musics.json";
const ataFile = "./ata.json";

const app = express();
const PORT = 5000;  

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    return res.sendFile(path.join(path.resolve()+"/src/views/index.html"));
});

app.get("/dashboard", (req, res) => {
    return res.sendFile(path.join(path.resolve()+"/src/views/dashboard.html"));
});

app.get("/orators", (req, res) => {
    readFile(oratorsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }

        const parsedData = JSON.parse(data);

        return res.status(200).json(parsedData);
        
    });
});

app.post("/orators", (req,res) => {
    const { id } = req.body;
    const { name } = req.body;
    const { role } = req.body;
    const { active } = req.body || false;
    const { firstPray } = req.body || false;
    const { lastPray } = req.body || false;

    if (!name || !role){
        return res.status(400).json("Invalid input data");
    }

    const orator = new Orator(id, name, role, active, firstPray, lastPray);

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
    return res.status(200).json(orator);

});

app.put("/orators/:oratorId", (req, res) => {
    const { oratorId } = req.params;
    const { name } = req.body;
    const { role } = req.body;
    const { active } = req.body || false;
    const { firstPray } = req.body || false;
    const { lastPray } = req.body || false;

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
                const newOrator = new Orator(Number(oratorId), name, role, active, firstPray, lastPray);
                parsedData.splice(foundOratorIndex, 1, newOrator);
            }
            if(firstPray){
                parsedData.forEach((orator) => {
                    orator.firstPray = false;
                });
                const newOrator = new Orator(Number(oratorId), name, role, active, firstPray, lastPray);
                parsedData.splice(foundOratorIndex, 1, newOrator);
            }
            if(lastPray){
                parsedData.forEach((orator) => {
                    orator.lastPray = false;
                });
                const newOrator = new Orator(Number(oratorId), name, role, active, firstPray, lastPray);
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


app.get("/musics", (req,res) => {
    readFile(musicsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }
        const parsedData = JSON.parse(data);
        return res.status(200).json(parsedData);
    });
});

app.post("/musics", (req,res) => {
    const { id } = req.body;
    const { name } = req.body;
    const { page } = req.body;
    if (!name || !page){
        return res.status(400).json("Invalid input data");
    }
    const music = new Music(id, name, page);
    readFile(musicsFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }
        const parsedData = JSON.parse(data);
        const newData = [...parsedData, music];
        writeFile(musicsFile, JSON.stringify(newData, null, 2), (err) => {
            if(err){
                console.log("Filed to write updated data to file");
                return res.status(500).json("Filed to write updated data to file");
            }
            console.log("Updated file sucessfully");
        });
    });
    return res.status(200).json(music);
});

app.get("/ata", (req, res) =>{
    readFile(ataFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }
        const parsedData = JSON.parse(data);
        return res.status(200).json(parsedData);
    });
});
    
app.post("/ata", (req, res) => {
    const { title } = req.body;
    readFile(ataFile, (error, data) => {
        if(error){
            console.log(error);
            return res.status(400).json("Filed read file");
        }
        let parsedData = JSON.parse(data);
        readFile(oratorsFile, (error, data) => {
            if(error){
                console.log(error);
                return res.status(400).json("Filed read file");
            }
            const parsedOrators = JSON.parse(data);
            const firstPrayIndex = parsedOrators.findIndex( (orator) => orator.firstPray == true );
            const lastPrayIndex = parsedOrators.findIndex( (orator) => orator.lastPray == true );
            readFile(musicsFile, (error, data) =>{
                if(error){
                    console.log(error);
                    return res.status(400).json("Filed read file");
                }
                const parsedMusics = JSON.parse(data);
                const newData = new Ata(title, parsedOrators, parsedOrators[firstPrayIndex], parsedOrators[lastPrayIndex], parsedMusics);
                parsedData = [newData]
                writeFile(ataFile, JSON.stringify(parsedData, null, 2), (err) => {
                    if(err){
                        console.log("Filed to write updated data to file");
                        return res.status(500).json("Filed to write updated data to file");
                    }
                    console.log("Updated file sucessfully");
                    return res.status(200).json({
                        message: 'Ata created successfully',
                        success: true,
                        ata: parsedData
                    });
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`SERVIDOR INICIADO NA PORTA ${PORT}`);
});