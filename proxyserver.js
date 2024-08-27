const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
    console.log(`${new Date().toLocaleTimeString()}: ${url}`);
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});