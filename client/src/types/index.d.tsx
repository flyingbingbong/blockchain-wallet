import { IUser, ITxInput, ITxOutput, ITransaction, IWallet } from "./wallet.d";
import { ILog } from "./log.d";
import { ICreateTx } from "./transaction.d";
import { IAction } from "./__redux__.d";

export {
	IUser, ITxInput, ITxOutput, ITransaction, IWallet,
	ILog,
	ICreateTx,
	IAction
};
export interface AppState {
	wallets: {
		data: Array<IWallet>,
		showPopup: boolean,
		pending: boolean,
		error: boolean
	},
	logs: {
		data: Array<ILog>,
		timer: any,
		chainLength: number,
		pending: boolean,
		error: boolean
	},
	transaction: {
		showPopup: boolean,
		sender: string,
		receiver: string,
		amount: number,
		pending: boolean,
		error: boolean
	}
};
