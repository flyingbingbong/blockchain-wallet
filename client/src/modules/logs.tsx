import { ILog, IAction } from "../types/index.d";
import { getChainAPI } from "../services";

// types
export interface ILogsState {
	data: Array<ILog>,
	timer: any,
	chainLength: number,
	pending: boolean,
	error: boolean
};

export enum LogType {
	NEW_BLOCK_MINED="NEW BLOCK",
	TX_RESULT="TX RESULT",
	NETWORK_ERROR="NETWORK_ERROR"
};

export interface ILogsAction extends IAction {
	payload?: any
};

// actions
export enum TypeKeys {
	START_TIMER="logs/START_TIMER",
	STOP_TIMER="logs/STOP_TIMER",
	ADD_LOG="logs/ADD_LOG",
	GET_CHAIN_SUCCESS="logs/GET_CHAIN_SUCCESS",
	GET_CHAIN_PENDING="logs/GET_CHAIN_PENDING",
	GET_CHAIN_FAILURE="logs/GET_CHAIN_FAILURE"
};

// initial state
export const initialState: ILogsState = {
	data: [],
	timer: null,
	chainLength: 0,
	pending: false,
	error: false
}

// reducer
export default (
	state: ILogsState=initialState,
	action: ILogsAction
) => {
	switch (action.type) {
		case TypeKeys.START_TIMER:
			return {
				...state,
				timer: action.payload
			}

		case TypeKeys.STOP_TIMER:
			return {
				...state,
				timer: null
			}

		case TypeKeys.ADD_LOG:
			return {
				...state,
				data: [ ...state.data, action.payload ]
			}

		case TypeKeys.GET_CHAIN_SUCCESS:
			return {
				...state,
				chainLength: action.payload,
				pending: false
			}

		case TypeKeys.GET_CHAIN_PENDING:
			return {
				...state,
				pending: true,
				error: false
			}

		case TypeKeys.GET_CHAIN_FAILURE:
			return { 
				...state,
				pending: false,
				error: true
			}

		default:
			return state;
	}
}

// action creator
export const startTimer = (timer) => ({
	type: TypeKeys.START_TIMER, payload: timer
});

export const stopTimer = () => ({
	type: TypeKeys.STOP_TIMER
});

export const getChain = () => (dispatch, getState): Promise<any> => {
	const now = new Date();
	const prevChainLength: number = getState().logs.chainLength;
	dispatch({ type: TypeKeys.GET_CHAIN_PENDING });

	return getChainAPI()
		.then((res) => {
			if (res.data.success && prevChainLength < res.data.length) {
				const logPayload: ILog = {
					timestamp: `${now.getHours()}:${now.getMinutes()}`,
					type: LogType.NEW_BLOCK_MINED,
					text: `New block is mined current chain length is ${res.data.length}`
				};

				const chainLengthPayload: number = res.data.length;

				dispatch({
					type: TypeKeys.GET_CHAIN_SUCCESS,
					payload: chainLengthPayload
				});
				dispatch({
					type: TypeKeys.ADD_LOG,
					payload: logPayload
				});
			}
		})
		.catch(err => {
			const payload: object = {
				timestamp: `${now.getHours()}:${now.getMinutes()}`,
				type: LogType.NETWORK_ERROR,
				text: `Request to ${process.env["API_URL"]} is failed`
			};
			dispatch({ type: TypeKeys.GET_CHAIN_FAILURE });
			dispatch({ type: TypeKeys.ADD_LOG, payload });
		});
}
