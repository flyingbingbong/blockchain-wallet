import { Context } from "koa";
import axios from "axios";
const REQUEST_FAIL = "Request to node is failed";

export const chain = async (ctx: Context): Promise<void> => {
	try {
		var chain;
		const url = "http://localhost:8080/chain";
		const req = (await axios.get(url)).data;

		if (req && req.success) {
			chain = req.chain;
			ctx.body = {
				success: true,
				length: chain.length,
				chain
			};
		} else {
			ctx.body = {
				success: false,
				message: REQUEST_FAIL
			};
		}
	} catch (err) {
		ctx.throw(500, err);
	}
}
