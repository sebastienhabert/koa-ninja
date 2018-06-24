const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const ObjectID = require("mongodb").ObjectID;
const jwt = require("./jwt");
const app = new Koa();
// Create a new securedRouter
const router = new Router();
const securedRouter = new Router();

require("./mongo")(app);
// Use the bodyparser middlware
app.use(BodyParser());
app.use(logger());
// app.use(jwt.errorHandler()).use(jwt.jwt());

// Apply JWT middleware to secured router only
securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

router.post("/(auth|login)", async (ctx) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;

  if (username === "user" && password === "pwd") {
    ctx.body = {
      token: jwt.issue({
        user: "user",
        role: "admin"
      })
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      error: "Invalid login"
    }
  }
});

router.get("/", async function (ctx) {
  let name = ctx.request.query.name || "World";
  ctx.body = {
    message: `Hello ${name}!!!`
  }
});

router.post("/", async function (ctx) {
  let name = ctx.request.body.name || "World";
  ctx.body = {
    message: `Hello ${name}!`
  }
});

// List all people
securedRouter.get("/people", async (ctx) => {
  ctx.body = await ctx.app.people.find().toArray();
});
// Create new person
securedRouter.post("/people", async (ctx) => {
  ctx.body = await ctx.app.people.insert(ctx.request.body);
});
// Get one
securedRouter.get("/people/:id", async (ctx) => {
  ctx.body = await ctx.app.people.findOne({
    "_id": ObjectID(ctx.params.id)
  });
});
// Update one
securedRouter.put("/people/:id", async (ctx) => {
  // let documentQuery = {
  //   "_id": ObjectID(ctx.params.id)
  // }; // Used to find the document
  let valuesToUpdate = ctx.request.body;
  ctx.body = await ctx.app.people.updateOne({
    "_id": ObjectID(ctx.params.id)
  }, valuesToUpdate);
});
// Delete one
securedRouter.delete("/people/:id", async (ctx) => {
  let documentQuery = {
    "_id": ObjectID(ctx.params.id)
  }; // Used to find the document
  ctx.body = await ctx.app.people.deleteOne(documentQuery);
});

// Add the securedRouter to our app as well
app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(securedRouter.allowedMethods());

app.listen(3000);