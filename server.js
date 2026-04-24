const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

// Use the Port Render gives us, or 3000 for local testing
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Tell the server where your HTML file is
app.use(express.static(path.join(__dirname, '.')));

// The Proxy Engine
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('No URL provided');

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' } // Tricks sites into thinking you're a real browser
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
