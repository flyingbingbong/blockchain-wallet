import { Context } from "koa";
import { ITransaction } from "../types";
import { User, IUserModel } from "../models";
import { Request } from "../utils";
import axios from "axios";

interface IUserWallet extends IUserModel {
	utxo?: Array<ITransaction>
}

export const create = async (ctx: Context): Promise<void> => {
	try {
		const name: string = ctx.request.body.name;

		if (!name) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				message: "Username is required"
			};
			return;
		}
		if (await User.findOne({ name })) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				message: "Duplicate user name"
			};
			return;
		}

		var user: IUserModel = new User({ name });

		await user.saveWithKeys();
		ctx.body = {
			success: true,
			user: user.toObject()
		}
	} catch (err) {
		ctx.throw(500, err);
	}
}

export const wallets = async (ctx: Context): Promise<void> => {
	try {
		const url = "http://localhost:8080/utxo";
		var users: Array<IUserWallet> = await User
			.find({}, { _id: 0, __v: 0 })
			.sort({ isMiner: 1, _id: 1 })
			.lean();

		for (var i=0; i < users.length; i++) {
			users[i]["utxo"] = (await axios.get(`${url}/${users[i].pubkey}`)).data.utxo;
		}

		ctx.body = {
			success: true,
			wallets: users
		};
	} catch (err) {
		ctx.throw(500, err);
	}
}
