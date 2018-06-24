import { Context } from "koa";
import { Validate, Request } from "../utils";
import { TxHelper } from "../helpers";
import { ITransaction, ITxInput, ITxOutput } from "../types";
export const NOT_ENOUGH_TX: string = "Not enough money";

export const create = async (ctx: Context): Promise<void> => {
	try {
		var inputs: Array<ITxInput> = [];
		var outputs: Array<ITxOutput> = [];
		const required = [ "sender", "receiver", "amount" ];
		var message: string = Validate.validateRequestBody(ctx.request, required);
		if (message) {
			ctx.body = {
				success: false,
				message
			}
			return;
		}
		const { sender, receiver, amount } = ctx.request.body;
		const utxo: Array<ITransaction> = (await Request.reqToNode("GET", `/utxo/${sender}`, {})).utxo;
		const hasEnoughTx: boolean = TxHelper.buildIOputs(
			inputs, outputs, sender, receiver, utxo, amount
		);

		if (hasEnoughTx) {
			const response = await TxHelper.reqCreate(sender, inputs, outputs);
			ctx.body = {
				success: true,
				response
			}
		} else {
			ctx.body = {
				success: false,
				message: NOT_ENOUGH_TX
			}
		}
	} catch (err) {
		ctx.throw(500, err);
	}
}
