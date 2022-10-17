// libraires
fs = require("fs");
const fastify = require("fastify")({
  logger: false,
});

// Declare  routes
fastify.get("/images/:name", (req, res) => {
  //images folder images sending
  fs.readFile("images/" + req.params.name, function (err, result) {
    if (err) {
      res.status(404);
      return;
    }
    res.send(result);
  });
});

fastify.get("/", function (request, res) {
  //home file
  fileResponse("index.html", res, function (err, res) {
    if(err)throw err;
  });
});
fastify.get("/courses", function (request, res) {
  //courses file
  fileResponse("courses.html", res, function (err, res) {
    if(err)throw err;
    
  });
});


//functions
function fileResponse(file, reply, callback) {
  //responding with the header file this function is used to simplify the routes code
  if (!callback) {
    callback = function () {};
  }
  
  fs.readFile("public/" + file, "utf8", function (err, res) {
    if (err) {
      callback("Error in file reading");
      return;
    }
    if (res.includes("<!-- header -->")) {
      fs.readFile("public/header.html", "utf8", function (err, res1) {
        if (err) {
          callback("Error in file reading");
          return;
        }
        reply.type("text/html").send(res.replace("<!-- header -->", res1));
        callback(false,"successful response");
      });
    } else {
      reply.type("text/html").send(res);
      callback(false,"successful response");
    }
  });
}

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
// handling error 
fastify.get("*", function (request, res) {
  res.type("text/html").send(
  `
  <body style="background: rgb(49, 47, 54);">
      <div style="text-align: center;margin: 30px;">
        <h1 style="color: #974242;margin-bottom: 0;font-size: 40px;font-family: Monospace;">
        404
        </h1>
        <a href="/" style="border-radius: 8px;background: #eeeeee4a;padding: 2px 4px 2px 4px;color: #fff;text-decoration: none;margin-top: ;">Go Back Home</a>
      </div>
  </body>
  `)
});
