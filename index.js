import express from "express";

const app = express();
const PORT = 5000;  

app.get("/", (req, res) => {
    return res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
    console.log(`SERVIDOR INICIADO NA PORTA ${PORT}`);
});