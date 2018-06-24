import { combineReducers } from "redux";
import WalletsReducer, * as WalletsModule from "./wallets";
import LogsReducer, * as LogsModule from "./logs";
import TxReducer, * as TxModule from "./transaction";

export default combineReducers({
	wallets: WalletsReducer,
	logs: LogsReducer,
	transaction: TxReducer
});

export {
	WalletsReducer, WalletsModule,
	LogsReducer, LogsModule,
	TxReducer, TxModule
};
