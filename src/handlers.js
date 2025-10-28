const ssouijwt = require('@sefriano/sso-ui-jwt');
const {
    createTokens,
    isAuthenticated,
    setTokens,
    validateTicket,
} = require('./utils');

async function handleLogin(config, req, res) {
    if (isAuthenticated(req)) {
        const next = req.query.next ?? 'http://localhost:9000';
        res.redirect(next);
        return;
    }

    const ticket = req.query.ticket;
    if (ticket === undefined) {
        const next = 'http://localhost:9000/login';
        const loginUrl = `${config.casUrl}/login?service=${encodeURIComponent(next)}`;
        res.redirect(loginUrl);
        return;
    }

    let serviceRes;
    try {
        serviceRes = await validateTicket(config, ticket);
    } catch (err) {
        if (err instanceof ssouijwt.AuthenticationFailedError) {
            res.status(401).send('Authentication failed');
        } else {
            console.error('Error validating ticket:', err);
            res.status(500).send('Internal server error');
        }
        return;
    }

    const tokens = createTokens(config, serviceRes);

    setTokens(res, config, tokens);

    res.redirect(req.query.next ?? 'http://localhost:9000');
}

function handleRoot(req, res) {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    if (!(accessToken !== undefined && refreshToken !== undefined)) {
        res.redirect('/login');
        return;
    }

    res.json({ accessToken, refreshToken });
}

module.exports = { ...module.exports, handleLogin, handleRoot };
