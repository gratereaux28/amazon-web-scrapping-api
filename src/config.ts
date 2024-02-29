import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    appListenPort: process.env.APP_LISTEN_PORT,
    amazonUrlDomain: process.env.AMAZON_URL_DOMAIN,
  };
});
