const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static('./public/index.html'));
app.use(express.static(path.join('./public/index.html', 'build')));
app.get('/ping', function (req, res) {
return res.send('pong');
});
app.get('/*', function (req, res) {
 res.sendFile(path.join('./public/index.html', 'build', 'index.html'));
});
app.listen(port);