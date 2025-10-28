const { SSOJWTConfig } = require('@sefriano/sso-ui-jwt');

const config = { port: '9000' };

const ssoConfig = new SSOJWTConfig(
    900,
    1800,
    '3605ad7f89611b93f1a331b1418014e1373afc59e5db7da8416bfc656ab9ade6',
    '3605ad7f89611b93f1a331b1418014e1373afc59e5db7da8416bfc656ab9ade6',
    `http://localhost:${config.port}/login`,
    `http://localhost:${config.port}`,
);

module.exports = { ...module.exports, config, ssoConfig };
