var http = require('http');
var url = require('url');
var fs = require('fs');
var ejs = require('ejs') ;


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

  if(!response.finished){
    response.writeHead(404);
    response.end('Page is not found!');
  }
}).listen(3000) ;


function main_handler(request,response){
  response.writeHead(200,{'Content-type':'text/html'});
  console.log('main here1');

  var tmp = "";

  if(request.method === 'GET'){
    tmp = ejs.render(index,{title:"Sample Page",msg:"Hello,World!!"}) ;
  } else if(request.method === 'POST') {
    tmp = ejs.render(index,{title:"POST Page",msg:"Hello,World!!"}) ;
  } else {
    tmp = ejs.render(index,{title:"エラーページ",msg:"Hello,World!!"}) ;
  }
  response.write(tmp) ;
  response.end();
  console.log('main here2');
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
