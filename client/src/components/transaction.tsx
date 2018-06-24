import * as React from "react";
import { IWallet } from "../types/index.d";
import "../stylesheets/transaction.css";

interface ISelectWalletProps {
	wallets: Array<IWallet>,
	pubkey: string,
	onChangePubkey: (pubkey: string) => (dispatch) => any
}

interface IAmountInputProps {
	amount: number,
	onChangeAmount: (amount: number) => (dispatch) => any
}

export const CreateTxPopup: React.SFC<any> = ({
	showPopup, wallets,
	sender, receiver, amount,
	onCreateTx, onHidePopup, 
	onChangeSender, onChangeReceiver, onChangeAmount
}) => {
	if (showPopup) {
		return (
			<div className="tx-popup">
				<span 
					className="tx-popup-hide"
					onClick={ onHidePopup }
				>
					close
				</span>
				<div className="tx-input-container">
					<label>sender</label>
					<SelectWallet
						wallets={ wallets }
						pubkey={ sender }
						onChangePubkey={ onChangeSender }
					/>
				</div>
				<div className="tx-input-container">
					<label>receiver</label>
					<SelectWallet
						wallets={ wallets }
						pubkey={ receiver }
						onChangePubkey={ onChangeReceiver }
					/>
				</div>
				<div className="tx-input-container">
					<label>amount</label>
					<AmountInput
						amount={ amount }
						onChangeAmount={ onChangeAmount }
					/>
				</div>
				<input 
					className="tx-submit"
					type="submit" 
					value="submit"
					onClick={ onCreateTx }
				/>
			</div>
		);
	} else {
		return null;
	}
}

export const CreateTxBtn: React.SFC<any> = ({ onShowPopup }) => {
	return (
		<button
			className="tx-btn"
			onClick={ onShowPopup }
		>
			New Transaction
		</button>
	);
}

export class SelectWallet extends React.Component<ISelectWalletProps> {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { onChangePubkey, wallets } = this.props;
		
		if (wallets.length) {
			onChangePubkey(wallets[0].pubkey);
		}
	}

	onChange(event) {
		const { onChangePubkey } = this.props;
		
		onChangePubkey(event.target.value);
	}
	
	render() {
		const { wallets, pubkey } = this.props;
		const walletOptions = wallets.map((v, i) => {
			return (
				<option
					key={ i }
					value={ v.pubkey }
				>
					{ v.name }
				</option>
			);
		});

		return (
			<select
				onChange={ this.onChange.bind(this) } 
				value={ pubkey }
			>
				{ walletOptions }
			</select>
		);
	}
}

export class AmountInput extends React.Component<IAmountInputProps> {
	constructor(props) {
		super(props);
	}
	
	handleChange(event) {
		const { onChangeAmount } = this.props;
		var value = parseInt(event.target.value);

		if (!value) {
			value = 0;
		}

		if (value >= 0) {
			onChangeAmount(value);
		}
	}

	render() {
		const { amount } = this.props;
		return (
			<input
				type="text"
				value={ amount }
				onChange={ this.handleChange.bind(this) }
			/>
		);
	}
}
