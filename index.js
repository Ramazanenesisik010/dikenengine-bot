import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "Ramazanenesisik010"; // örn: dikenengine-bot
const REPO_NAME = "DikenEngine"; // hata raporlarının açılacağı repo

app.use(bodyParser.json());

app.post("/report", async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: "title ve body gerekli." });
    }

    try {
        const response = await axios.post(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
            { title, body },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                    "User-Agent": "dikenengine-bot"
                }
            }
        );

        return res.status(201).json({
            success: true,
            issue_url: response.data.html_url
        });
    } catch (err) {
        console.error("Issue oluşturulamadı:", err.response?.data || err.message);
        return res.status(500).json({ error: "Issue oluşturulamadı." });
    }
});

app.get("/", (_, res) => {
    res.send("DikenEngine Issue Bot API çalışıyor!");
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
