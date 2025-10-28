const cookieParser = require('cookie-parser');
const express = require('express');
const { config } = require('./config');
const { handleLogin, handleRoot } = require('./src/handlers');

function main() {
    const port = parseInt(config.port, 10);

    const app = express();
    app.use(cookieParser());

    app.get('/login', handleLogin);
    app.get('/', handleRoot);

    app.listen(port, () => {
        console.log(`Listening on port ${config.port}`);
    });
}

main();
