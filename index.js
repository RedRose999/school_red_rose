const Koa = require("koa");

const { koaBody } = require("koa-body");
const rootRouter = require("./routes/index.route");
const DB = require("./db");
const { changePasswordSchema } = require("./utils/interfaces/auth.interface");
const schemaValidate = require("./utils/schema.validation");
const config = require("./utils/config");
DB();

//Route files
const app = new Koa();
const PORT = config.port;

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || 500;
		ctx.body = err.message;
		ctx.app.emit("error", err, ctx);
	}
});
app.use(koaBody());
app.use(rootRouter);

app.on("error", (err) => {
	console.error("An Error has occured... ", err);
});

console.log(
	schemaValidate(changePasswordSchema, {
		oldPassword: "134",
		newPassword: "123",
	})
);

app.listen(PORT, () => {
	console.log("Server running at: http://localhost:" + PORT);
});
