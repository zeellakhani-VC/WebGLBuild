const express = require('express');
const request = require('request');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const publicfoldername = 'CuenectWebGLBuild';

app.use(cors());

const options = {
    key: fs.readFileSync(path.join(__dirname, 'certs/server.key')), // replace with your key path
    cert: fs.readFileSync(path.join(__dirname, 'certs/server.crt')) // replace with your certificate path
};

app.use(express.static(path.join(__dirname, publicfoldername)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, publicfoldername, 'index.html'));
    console.log(`${new Date().toLocaleTimeString()} - Served index.html`);
});

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL query parameter is required');
    }
    request(url)
        .on('error', (err) => {
            console.error(`${new Date().toLocaleTimeString()} - Error proxying request: ${err.message}`);
            res.status(500).send('Error proxying request');
        })
        .pipe(res);
    console.log(`${new Date().toLocaleTimeString()} - Proxied request to: ${url}`);
});

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
});

https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
});

// If only port 443 is needed, you can comment out the port 3000 server:
// https.createServer(options, app).listen(port, () => {
//     console.log(`Proxy server running at https://localhost:${port}`);
// });