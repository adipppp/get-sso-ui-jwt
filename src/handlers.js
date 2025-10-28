const ssouijwt = require('@sefriano/sso-ui-jwt');
const { ssoConfig } = require('../config');
const {
    createTokens,
    isAuthenticated,
    setTokens,
    validateTicket,
} = require('./utils');

async function handleLogin(req, res) {
    if (isAuthenticated(req)) {
        res.redirect(req.query.next ?? ssoConfig.originUrl);
        return;
    }

    const ticket = req.query.ticket;
    if (ticket === undefined) {
        const next = ssoConfig.serviceUrl;
        const loginUrl = `${ssoConfig.casUrl}/login?service=${encodeURIComponent(next)}`;
        res.redirect(loginUrl);
        return;
    }

    let serviceRes;
    try {
        serviceRes = await validateTicket(ticket);
    } catch (err) {
        if (err instanceof ssouijwt.AuthenticationFailedError) {
            res.status(401).send('Authentication failed');
        } else {
            console.error('Error validating ticket:', err);
            res.status(500).send('Internal server error');
        }
        return;
    }

    const tokens = createTokens(serviceRes);

    setTokens(res, tokens);

    res.redirect(req.query.next ?? ssoConfig.originUrl);
}

function handleRoot(req, res) {
    if (!isAuthenticated(req)) {
        res.redirect('/login');
        return;
    }

    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    if (refreshToken !== undefined) {
        res.json({ accessToken, refreshToken });
    }

    res.json({ accessToken });
}

module.exports = { ...module.exports, handleLogin, handleRoot };
