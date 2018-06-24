import * as React from "react";
import { connect } from "react-redux";
import { AppState, IWallet } from "../types/index.d";
import { TxModule } from "../modules";
import { CreateTxBtn, CreateTxPopup } from "../components";

interface ICreateTxPopupContainerProps {
	showPopup: boolean,
	wallets: Array<IWallet>,
	sender: string, receiver: string,
	amount: number,
	onCreateTx: (sender: string, receiver: string, amount: number) => (dispatch) => any,
	onHidePopup: () => (dispatch) => any,
	onChangeSender: (sender: string) => (dispatch) => any,
	onChangeReceiver: (receiver: string) => (dispatch) => any,
	onChangeAmount: (amount: number) => (dispatch) => any
}

export class CreateTxPopupContainer extends React.Component<ICreateTxPopupContainerProps> {
	async createTx() {
		const { sender, receiver, amount, onCreateTx } = this.props;

		try {
			await onCreateTx(sender, receiver, amount);
		} catch (err) {
			throw err;
		}
	}

	render() {
		const {
			showPopup,
			wallets,
			sender,
			receiver,
			amount,
			onCreateTx,
			onHidePopup,
			onChangeSender,
			onChangeReceiver,
			onChangeAmount
		} = this.props;

		return (
			<CreateTxPopup
				showPopup={ showPopup }
				wallets={ wallets }
				sender={ sender }
				receiver={ receiver }
				amount={ amount }
				onCreateTx={ () => this.createTx() }
				onHidePopup={ onHidePopup }
				onChangeSender={ onChangeSender }
				onChangeReceiver={ onChangeReceiver }
				onChangeAmount={ onChangeAmount }
			/>
		);
	}
}

const mapPopupStateToProps = (state: AppState) => ({
	showPopup: state.transaction.showPopup,
	sender: state.transaction.sender,
	receiver: state.transaction.receiver,
	amount: state.transaction.amount,
	wallets: state.wallets.data
});

const mapPopupDispatchToProps = (dispatch) => ({
	onCreateTx: (
		sender: string, receiver: string, amount: number
	) => dispatch(TxModule.createTx(sender, receiver, amount)),
	onHidePopup: () => dispatch(TxModule.hidePopup()),
	onChangeSender: (sender: string) => dispatch(TxModule.changeSender(sender)),
	onChangeReceiver: (receiver: string) => dispatch(TxModule.changeReceiver(receiver)),
	onChangeAmount: (amount: number) => dispatch(TxModule.changeAmount(amount))
});

const mapBtnDispatchToProps = (dispatch) => ({
	onShowPopup: () => dispatch(TxModule.showPopup())
});

export default connect(
	mapPopupStateToProps, mapPopupDispatchToProps
)(CreateTxPopupContainer);

export const CreateTxBtnContainer = connect(
	undefined, mapBtnDispatchToProps
)(CreateTxBtn);
