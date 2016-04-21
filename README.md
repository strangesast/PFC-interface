# Interface for Phase Field Crystal (PFC) simulation code
## Installation
+ Install nodejs / npm
+ install global dependencies
  * bower (npm)
  * redis
  * mongodb (or use an existing instance)
+ run `npm install`
+ run `bower install`
+ configure `config.json` to specify the correct mongodb url and pfc installation directory

To start the code, first run `python3 daemon.py &` then start node with `npm start` or `node bin/www` or `pm2 start bin/www --name "PFC-interface"`

Screenshot
![screenshot](https://raw.githubusercontent.com/strangesast/PFC-interface/master/public/images/screenshot.png)
