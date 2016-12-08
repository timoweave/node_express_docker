const express = require('express');
const http = require('http');
const chalk = require('chalk');
const util = require('util');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const upload = require('multer')();

class Server {

  constructor(host = '0.0.0.0', port = 8081) {
    this.config = {
      host: host,
      port: port
    };
    this.app = this.init_express();
    this.default_run_ok = this.default_run_ok.bind(this);
  }

  init_express() {
    const app = express();
    app.use(morgan('dev'));
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.post('/upload', upload.array(), function(req, res, next) {
      console.log(req.body);
      res.json(req.body);
    });
    app.get('/info', function(req, res) {
      res.json({
        info: "info"
      });
    });
    app.get('/', function(req, res) {
      res.json({
        index: "index"
      });
    });
    return app;
  }

  add_express_router(path, router) {
    this.app.use(path, router);
    return this.app;
  }

  run(run_ok) {
    const port = this.config.port;
    const host = this.config.host;
    this.server = this.app.listen(port, host, run_ok || this.default_run_ok);
  }

  default_run_ok() {
    var host = this.server.address().address;
    var port = this.server.address().port;
    const ok = chalk.green("OK");
    const msg = util.format("express http://%s:%s", host, port);
    console.log(ok, msg);
  }
}

class HelloRouter {

  constructor() {
    const router = express.Router();
    router.use(this.timeLog.bind(this));
    router.get('/', this.get_index.bind(this));
    router.get('/about', this.get_about.bind(this));
    router.get('/hello', this.get_hello.bind(this));
    this.router = router;
  }

  timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next();
  }

  get_hello(req, res) {
    res.send('Hello there');
  }

  get_about(req, res) {
    res.send('About me');
  }

  get_index(req, res) {
    res.send('index here');
  }
}

module.exports = Server;

if (require.main === module) {
  const hello = new HelloRouter();
  const server = new Server('0.0.0.0', process.env.PORT || 8081);
  server.add_express_router('/hello', hello.router);
  server.run();
}
