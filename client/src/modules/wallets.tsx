import { IWallet, IAction } from "../types/index.d";
import { getWalletsAPI, createWalletAPI } from "../services";

// types
export interface IWalletsState {
	data: Array<IWallet>,
	showPopup: boolean,
	pending: boolean,
	error: boolean
};

export interface IWalletsAction extends IAction {
	payload?: Array<IWallet>
};

// actions
export enum TypeKeys {
	GET_WALLETS_SUCCESS="wallets/GET_SUCCESS",
	GET_WALLETS_PENDING="wallets/GET_PENDING",
	GET_WALLETS_FAILURE="wallets/GET_FAILURE",
	POST_WALLET_SUCCESS="wallets/POST_SUCCESS",
	POST_WALLET_PENDING="wallets/POST_PENDING",
	POST_WALLET_FAILURE="wallets/POST_FAILURE",
	SHOW_POPUP="wallets/SHOW_POPUP",
	HIDE_POPUP="wallets/HIDE_POPUP",
};

// initial state
export const initialState: IWalletsState = {
	data: [],
	showPopup: false,
	pending: false,
	error: false
}

// reducer
export default (
	state: IWalletsState=initialState,
	action: IWalletsAction
) => {
	switch (action.type) {
		case TypeKeys.GET_WALLETS_PENDING:
			return {
				...state,
				pending: true,
				error: false
			};

		case TypeKeys.GET_WALLETS_SUCCESS:
			return {
				...state,
				pending: false,
				data: action.payload
			};

		case TypeKeys.GET_WALLETS_FAILURE:
			return {
				...state,
				pending: false,
				error: true
			};
	
		case TypeKeys.POST_WALLET_PENDING:
			return {
				...state,
				pending: true,
				error: false
			};

		case TypeKeys.POST_WALLET_SUCCESS:
			return {
				...state,
				pending: false
			};

		case TypeKeys.POST_WALLET_FAILURE:
			return {
				...state,
				pending: false,
				error: true
			};

		case TypeKeys.SHOW_POPUP:
			return {
				...state,
				showPopup: true
			};

		case TypeKeys.HIDE_POPUP:
			return {
				...state,
				showPopup: false
			};

		default:
			return state;
	}
}

// action creator
export const getWallets = () => (dispatch): Promise<any> => {
	dispatch({ type: TypeKeys.GET_WALLETS_PENDING });

	return getWalletsAPI()
		.then(res => {
			if (res.data.success) {
				dispatch({
					type: TypeKeys.GET_WALLETS_SUCCESS,
					payload: res.data.wallets
				});
			} else {
				dispatch({ type: TypeKeys.GET_WALLETS_FAILURE });
			}
		})
		.catch(err => {
			dispatch({ type: TypeKeys.GET_WALLETS_FAILURE });
		});
}

export const createWallet = (name: string) => (dispatch): Promise<any> => {
	dispatch({ type: TypeKeys.POST_WALLET_PENDING });

	return createWalletAPI(name)
		.then(res => {
			if (res.data.success) {
				dispatch({ type: TypeKeys.POST_WALLET_SUCCESS });
			} else {
				dispatch({ type: TypeKeys.POST_WALLET_FAILURE });
			}
			dispatch({ type: TypeKeys.HIDE_POPUP });
		})
		.catch(err => {
			dispatch({ type: TypeKeys.POST_WALLET_FAILURE });
			dispatch({ type: TypeKeys.HIDE_POPUP });
		});
}

export const showPopup = (): IWalletsAction => ({
	type: TypeKeys.SHOW_POPUP
});

export const hidePopup = (): IWalletsAction => ({
	type: TypeKeys.HIDE_POPUP
});
