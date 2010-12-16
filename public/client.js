
require("fs").readdirSync("./vendor").forEach(function(name){
  require.paths.unshift("./vendor/" + name + "/lib");  
});

var Redisio = function(options){
	this.host = options.host;
	this.port = options.port;
	
	this.socket = new io.Socket(this.host,
    {rememberTransport: false, port: this.port, secure: this.options.secure}
  );
}

Redisio.fn = Redisio.prototype;
Redisio.fn.proxy = function(func){
  var thisObject = this;
  return(function(){ return func.apply(thisObject, arguments); });
};