(() => {
  'use strict';

  const env = process.env.NODE_ENV || 'development',
    dotenv = require('dotenv');
  if (env === 'development') {
    // Load all Environment Variables on development environment.
    dotenv.load();
  }

  const http = require('http'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    app = express();

  /**
   * Normalize a port into a number, string, or false.
   */
  var normalizePort = (val) => {
      let port = parseInt(val, 10);
      if (isNaN(port)) {
        // named pipe
        return val;
      }
      if (port >= 0) {
        // port number
        return port;
      }
      return false;
    },

    /**
     * Event listener for HTTP server "listening" event.
     */
    onListening = () => {
      let addr = server.address();
      let bind = typeof addr === 'string' ? `pipe ${addr}` :
        `port ${addr.port}`;
      console.log('Listening on ' + bind);
    },

    /**
     * Event listener for HTTP server "error" event.
     */
    onError = (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
      // handle specific listen errors with friendly messages
      switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
      }
    },

    /**
     * Get port from environment and store in Express.
     */
    port = normalizePort(process.env.PORT || '3000');

  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, './public')));
  app.route('/*').get(function (req, res) {
    return res.sendFile(path.join(__dirname, './public/index.html'));
  });

  /**
   * Create HTTP server.
   */
  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

})();
