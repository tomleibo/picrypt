const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));


app.get('/Worker.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'Worker.js'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


module.exports = app;
console.log("server up...");