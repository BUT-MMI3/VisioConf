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

const sha256 = async (text) => {
    // Encode le texte en un Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Utilise l'API SubtleCrypto pour générer le hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertit le buffer en une chaîne hexadécimale
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

module.exports = {
    randomString,
    normalizePort,
    onError,
    onListening,
    sha256
};