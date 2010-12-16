


var Redisio = function(options){
	this.host = options.host;
	this.port = options.port;
	
	this.socket = new io.Socket(this.host,
    {rememberTransport: false, port: this.port, secure: this.options.secure}
  );
}