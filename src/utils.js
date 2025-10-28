const ssouijwt = require('@sefriano/sso-ui-jwt');

function createTokens(config, serviceRes) {
    const accessToken = ssouijwt.createToken(
        config,
        ssouijwt.TokenType.AccessToken,
        serviceRes,
    );
    const refreshToken = ssouijwt.createToken(
        config,
        ssouijwt.TokenType.RefreshToken,
        serviceRes,
    );

    return { accessToken, refreshToken };
}

async function validateTicket(config, ticket) {
    const serviceRes = await ssouijwt.validateTicket(config, ticket);
    if (serviceRes.authenticationSuccess === undefined) {
        throw new Error('No authentication success in service response');
    }
    return serviceRes;
}

function isAuthenticated(req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken === undefined) {
        return false;
    }

    try {
        ssouijwt.decodeToken(
            config,
            ssouijwt.TokenType.AccessToken,
            accessToken,
        );
    } catch {
        return false;
    }

    return true;
}

function setTokens(res, config, tokens) {
    const accessTokenClaims = ssouijwt.decodeToken(
        config,
        ssouijwt.TokenType.AccessToken,
        tokens.accessToken,
    );
    const accessTokenExp = accessTokenClaims.exp;
    const accessTokenExpiryDate = new Date(Date.now() + accessTokenExp * 1000);

    const refreshTokenClaims = ssouijwt.decodeToken(
        config,
        ssouijwt.TokenType.RefreshToken,
        tokens.refreshToken,
    );
    const refreshTokenExp = refreshTokenClaims.exp;
    const refreshTokenExpiryDate = new Date(
        Date.now() + refreshTokenExp * 1000,
    );

    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        expires: accessTokenExpiryDate,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        expires: refreshTokenExpiryDate,
    });
}

module.exports = {
    ...module.exports,
    createTokens,
    validateTicket,
    isAuthenticated,
    setTokens,
};
