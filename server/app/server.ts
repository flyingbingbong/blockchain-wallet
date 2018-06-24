import * as Koa from "koa";
import * as KoaBody from "koa-body";
import * as cors from "koa2-cors";
import * as Router from "koa-router";
import * as db from "mongoose";
import { DB_ADDRESS } from "./models";
import { UserController, TxController, BlockController } from "./controllers";

db.connect(DB_ADDRESS);

const app: Koa = new Koa();
var router: Router = new Router();

router.post("/wallet/create", UserController.create);
router.get("/wallets", UserController.wallets); // req to node
router.post("/transaction/create", TxController.create); // req to node
router.get("/chain", BlockController.chain);

app.use(KoaBody())
	.use(cors({ origin: "*" }))
	.use(router.routes())
	.use(router.allowedMethods());

const server: Promise<any> = app.listen(3000);
      
console.log("Server start on 3000");
      
export default server;

