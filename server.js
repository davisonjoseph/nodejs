// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var jade = require('jade');
var mysql = require("mysql");
	

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {


response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

 
  //response.end("Hello World\n");
  var method = request.url;
  	if(method=="/home"){
  		//fs.readFile('views/home.html',function (err, html) {
	    /*if (err) {
	        throw err; 
	    } */  
		var greetings = require("./save.js");		
		var s = greetings.sayHelloInEnglish();

		/* normal html page rendering */
		fs.readFile('views/home.html',function (err, html) {
	    if (err) {
	        throw err; 
	    } 
        response.write(html);

        /* html page rendering using jade template engine */
        var data = {title:"my title", b:1, c:1};
        jade.renderFile('views/home.jade', data, function (err, html) {
    		response.write(html);
		});
        
         response.end();
     	});
	}
	else if(method=="/mysql_select"){
		
		var connection =  mysql.createConnection({
		  	host : "localhost",
		  	user : "root",
		  	password: ""
		  });
		connection.query("use test");

		var strQuery = "select * from my_table";			  
		  connection.query( strQuery, function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		console.log( rows );
		  		response.writeHead(200, {"Content-Type": "text/plain"});
		  		response.write(JSON.stringify(rows));
		  		connection.end(function(err){
				// Do something after the connection is gracefully terminated.

				});
		  		connection.destroy();
		  		response.end();
		  	}
		  });
	}
	else if(method=="/mysql_insert"){
		
        console.log(request.method);

		response.write("{messge:success}");
		response.end();
	}
	else{
		response.write("invalid input");
		response.end();
	}
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");