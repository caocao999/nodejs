var http = require('http');
var url = require('url');
var fs = require('fs');
var ejs = require('ejs') ;
var qs = require('qs');

var index = fs.readFileSync('./index.ejs','UTF-8');
var style = fs.readFileSync('./style.css','UTF-8');
var jscript = fs.readFileSync('./jscript.js','UTF-8');


var messages = [] ;

// An array of route-object.
var pages = [
  {route:'/',handler:main_handler},
  {route:'/style.css',handler:stylesheet_handler}
  //{id:'3',route:'/script.js',handler:jscript_handler},
] ;


http.createServer(function(request,response){
  var pathname = url.parse(decodeURI(request.url)).pathname;
  console.log("path name"+pathname) ;
  if(pathname){
    pages.forEach(function(page){
      if(pathname === page.route){
        var handler = page.handler ;
        handler(request,response);
      }
    });
  }
}).listen(3000) ;


function main_handler(request,response){
  console.log('main here1');


  if(request.method === 'POST') {
    var reqBody = '';
    request.on('data',function(data){
      reqBody += data ;
    });
    request.on('end', function(){
      var form = qs.parse(reqBody) ;
      var dt = new Date();
      var currentTime = dt.getFullYear()+"/"+dt.getMonth()+"/"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
      var item = {'time':currentTime,'body':form.message};
      console.log('item');
      messages.push(item);
      var tmp = ejs.render(index,{title:"sample page",msg:"伝言をどうぞ",messages:messages}) ;
      response.writeHead(200,{'Content-type':'text/html'});
      response.write(tmp) ;
      response.end();
    });
  } else {
    var tmp = ejs.render(index,{title:"sample page",msg:"伝言をどうぞ",messages:messages}) ;
    response.writeHead(200,{'Content-type':'text/html'});
    response.write(tmp) ;
    response.end();
    console.log('main here2');
  }
}



function stylesheet_handler(request,response){
  response.setHeader('Content-type','text/css');
  console.log('stylesheet here1');
  response.write(style) ;
  response.end();
  console.log('stylesheet here2');
}

function jscript_handler(request,response){
  response.setHeader('Content-type : text/script');
  console.log('stylesheet here1');
  response.write(jscript) ;
  response.end();
  console.log('stylesheet here2');
}
