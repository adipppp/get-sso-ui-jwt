const cookieParser = require('cookie-parser');
const express = require('express');
const { SSOJWTConfig } = require('@sefriano/sso-ui-jwt');
const { handleLogin, handleRoot } = require('./src/handlers');

const PORT = 9000;

function main() {
    const port = parseInt(PORT, 10);
    const config = new SSOJWTConfig(
        900,
        1800,
        '3605ad7f89611b93f1a331b1418014e1373afc59e5db7da8416bfc656ab9ade6',
        '3605ad7f89611b93f1a331b1418014e1373afc59e5db7da8416bfc656ab9ade6',
        `http://localhost:${port}/login`,
        `http://localhost:${port}`,
    );

    const app = express();
    app.use(cookieParser());

    app.get('/login', (req, res) => handleLogin(config, req, res));
    app.get('/', (req, res) => handleRoot(req, res));

    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    });
}

main();
