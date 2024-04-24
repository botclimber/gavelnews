import createServer from "./server"
import ServerConfig from '../../CommonStuff/src/types/types';

const PORT = process.env.SERVER_PORT || 80;

const serverConfig: ServerConfig = {
    useHTTPS: process.env.USE_HTTPS || false,
    certPath: process.env.CERT_PATH,
    keyPath: process.env.KEY_PATH
};

const server = createServer(serverConfig);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
