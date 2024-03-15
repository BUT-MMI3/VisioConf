// generate random string
const randomString = (len) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = len; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = val => {
    const port = parseInt(val, 10);
    return isNaN(port) ? val : port >= 0 ? port : false;
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error, port) => {
    if (error.syscall !== "listen") throw error;

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = server => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
}

const { createHash } = require('crypto');

const sha256 = (data) => {
    console.log('data', data)
    if (typeof data === 'string') {
        return createHash('sha256').update(data).digest('hex');
    } else {
        return new Error('Invalid data type');
    }
}

module.exports = {
  randomString,
    normalizePort,
    onError,
    onListening,
    sha256
};