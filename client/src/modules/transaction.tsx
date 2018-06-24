import { IAction } from "../types/index.d";
import { createTxAPI } from "../services";
import { TypeKeys as LogsTypeKeys, LogType } from "./logs";

// types
export interface ITransactionState {
	showPopup: boolean,
	sender: string,
	receiver: string,
	amount: number,
	pending: boolean,
	error: boolean
};

export interface ITransactionAction extends IAction {
	payload?: any
};

// actions
export enum TypeKeys {
	CHANGE_SENDER="transaction/CHANGE_SENDER",
	CHANGE_RECEIVER="transaction/CHANGE_RECEIVER",
	CHANGE_AMOUNT="transaction/CHANGE_AMOUNT",
	POST_TX_SUCCESS="transaction/POST_TX_SUCCESS",
	POST_TX_FAILURE="transaction/POST_TX_FAILURE",
	POST_TX_PENDING="transaction/POST_TX_PENDING",
	SHOW_POPUP="transaction/SHOW_POPUP",
	HIDE_POPUP="transaction/HIDE_POPUP",
};

// initial state
export const initialState: ITransactionState = {
	showPopup: false,
	sender: "",
	receiver: "",
	amount: 0,
	pending: false,
	error: false
}

// reducer
export default (
	state: ITransactionState=initialState,
	action: ITransactionAction
) => {
	switch (action.type) {
		case TypeKeys.CHANGE_SENDER:
			return {
				...state,
				sender: action.payload
			}

		case TypeKeys.CHANGE_RECEIVER:
			return {
				...state,
				receiver: action.payload
			}

		case TypeKeys.CHANGE_AMOUNT:
			return {
				...state,
				amount: action.payload
			}

		case TypeKeys.POST_TX_SUCCESS:
			return {
				...state,
				pending: false
			}

		case TypeKeys.POST_TX_PENDING:
			return {
				...state,
				pending: true,
				error: false
			}

		case TypeKeys.POST_TX_FAILURE:
			return {
				...state,
				pending: false,
				error: true
			}

		case TypeKeys.SHOW_POPUP:
			return {
				...state,
				showPopup: true
			};

		case TypeKeys.HIDE_POPUP:
			return {
				...state,
				sender: "",
				receiver: "",
				amount: 0,
				showPopup: false
			};

		default:
			return state;
	}
}

// action creator
export const createTx = (
	sender: string,
	receiver: string,
	amount: number
) => (dispatch): Promise<any> => {
	const now = new Date();
	dispatch({ type: TypeKeys.POST_TX_PENDING });
	
	return createTxAPI({ sender, receiver, amount })
		.then(res => {
			if (res.data.success) {
				var text = "";
				const keyOrder = [ "result", "consensus", "message", "responses" ];
				const { result, consensus, message, responses } = res.data.response;
				const textToConcat = {
					result,
					consensus,
					message,
					responses: responses.map(v => {
						return `${v.nodeNum} => ${v.validate}`;
					}).join(", ")
				};
				for (let key of keyOrder) {
					text += `${key}:${textToConcat[key]} | `;
				}
				const payload = {
					timestamp: `${now.getHours()}:${now.getMinutes()}`,
					type: LogType.TX_RESULT,
					text
				};

				dispatch({ type: TypeKeys.POST_TX_SUCCESS });
				dispatch({ type: LogsTypeKeys.ADD_LOG, payload });
				dispatch({ type: TypeKeys.HIDE_POPUP });
			} else {
				const payload = {
					timestamp: `${now.getHours()}:${now.getMinutes()}`,
					type: LogType.TX_RESULT,
					text: res.data.message,
				}
				dispatch({ type: TypeKeys.POST_TX_FAILURE });
				dispatch({ type: LogsTypeKeys.ADD_LOG, payload });
				dispatch({ type: TypeKeys.HIDE_POPUP });
			}
		})
		.catch(err => {
			const payload: object = {
				timestamp: `${now.getHours()}:${now.getMinutes()}`,
				type: LogType.NETWORK_ERROR,
				text: `Request to ${process.env["API_URL"]} is failed`
			};
			dispatch({ type: TypeKeys.POST_TX_FAILURE });
			dispatch({ type: LogsTypeKeys.ADD_LOG, payload });
			dispatch({ type: TypeKeys.HIDE_POPUP });
		});
}

export const changeSender = (sender: string): ITransactionAction => ({
	type: TypeKeys.CHANGE_SENDER,
	payload: sender
});

export const changeReceiver = (receiver: string): ITransactionAction => ({
	type: TypeKeys.CHANGE_RECEIVER,
	payload: receiver
});

export const changeAmount = (amount: number): ITransactionAction => ({
	type: TypeKeys.CHANGE_AMOUNT,
	payload: amount
});

export const showPopup = (): ITransactionAction => ({
	type: TypeKeys.SHOW_POPUP
});

export const hidePopup = (): ITransactionAction => ({
	type: TypeKeys.HIDE_POPUP
});
