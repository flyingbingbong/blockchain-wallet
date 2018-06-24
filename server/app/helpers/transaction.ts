import { ITransaction, ITxInput, ITxOutput } from "../types";
import { Request } from "../utils";
import { User } from "../models";
import { Sign } from "../utils";

export const buildIOputs = (
	inputs: Array<ITxInput>,
	outputs: Array<ITxOutput>,
	client: string,
	receiver: string,
	utxo: Array<ITransaction>, 
	amount: number
): boolean => {
	var i: number = 0;
	var sum: number = 0;
	var simplified: Array<ITxInput> = utxo.map((tx) => {
		var amount = tx.outputs.filter((o) => {
			return o.receiver == client;
		})[0].amount;

		return { id: tx.id, amount };
	}).sort((a, b) => a.amount - b.amount);

	while (simplified[i] && sum < amount) {
		inputs.push(simplified[i]);
		sum += simplified[i].amount;
		i++;
	}

	if (sum >= amount) {
		outputs.push({ receiver, amount });
		if (sum > amount) {
			outputs.push({ receiver: client, amount: sum - amount });
		}
	} else {
		return false;
	}
	return true;
}

export const reqCreate = async (
	sender: string,
	inputs: Array<ITxInput>,
	outputs: Array<ITxOutput>
): Promise<any> => {
	const transaction: ITransaction = {
		sender,
		inputs,
		outputs,
		timestamp: Date.now()
	}
	const privatekey = (await User.findOne({ pubkey: sender })).privatekey;
	const sign = Sign.sign(privatekey, transaction);
	const response = await Request.reqToNode(
		"POST", "/transaction/create",
		{ sign, transaction }
	);
	
	return response;
}
