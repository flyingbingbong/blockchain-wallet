import * as React from "react";
import { connect } from "react-redux";
import { AppState, IWallet } from "../types/index.d";
import { WalletsModule } from "../modules";
import { Wallets } from "../components";
import "../stylesheets/wallets.css";

interface IWalletsProps {
	wallets: Array<IWallet>,
	showPopup: boolean,
	pending: boolean,
	error: boolean,
	onGetWallets: () => (dispatch) => Promise<any>,
	onCreateWallet: (name: string) => (dispatch) => Promise<any>,
	onShowPopup: () => (dispatch) => any
	onHidePopup: () => (dispatch) => any
}

interface IPopupProps {
	showPopup: boolean,
	createWallet?: (name: string) => any,
	onHidePopup: () => (dispatch) => any,
	onCreateWallet: (name: string) => (dispatch) => Promise<any>,
	onGetWallets: () => (dispatch) => Promise<any>,
	handleChange?: (event) => void
}

export class WalletsContainer extends React.Component<IWalletsProps> {
	componentDidMount() {
		this.getWallets();
	}

	async getWallets() {
		const { onGetWallets } = this.props;
		
		try {
			await onGetWallets();
		} catch (err) {
			throw err;
		}
	}

	render() {
		const { 
			wallets, 
			showPopup, 
			onCreateWallet, 
			onGetWallets,
			onShowPopup, 
			onHidePopup,
		} = this.props;

		return (
			<div id="wallets">
				<Wallets
					wallets={ wallets }
					onShowPopup={ onShowPopup }
				/>
				<CreateWalletPopup
					showPopup={ showPopup }
					onHidePopup={ onHidePopup }
					onCreateWallet={ onCreateWallet }
					onGetWallets={ onGetWallets }
				/>
			</div>
		);
	}
}

export class CreateWalletPopup extends React.Component<IPopupProps, { value: string }> {
	constructor(props) {
		super(props);
		this.state = { value: "" };
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	async createWallet(name: string) {
		const { onCreateWallet, onGetWallets } = this.props;

		try {
			await onCreateWallet(name);
			await onGetWallets();
			this.setState({ value: "" });
		} catch (err) {
			throw err;
		}
	}

	render () {
		const { showPopup, createWallet, onHidePopup } = this.props;

		if (showPopup) {
			return (
				<div className="wallet-create-popup">
					<span 
						className="wallet-popup-hide"
						onClick={ onHidePopup }
					>
						close
					</span>
					<input 
						className="wallet-popup-input"
						type="text" 
						value={ this.state.value }
						placeholder="이름"
						onChange={ this.handleChange.bind(this) }
					/>
					<input 
						className="wallet-popup-submit"
						type="submit" 
						value="submit"
						onClick={ () => this.createWallet(this.state.value) }
					/>
				</div>
			);
		}
		return null;
	}
}

const mapStateToProps = (state: AppState) => ({
	wallets: state.wallets.data,
	showPopup: state.wallets.showPopup,
	pending: state.wallets.pending,
	error: state.wallets.error
});

const mapDispatchToProps = (dispatch) => ({
	onGetWallets: () => dispatch(WalletsModule.getWallets()),
	onCreateWallet: (name: string) => dispatch(WalletsModule.createWallet(name)),
	onShowPopup: () => dispatch(WalletsModule.showPopup()),
	onHidePopup: () => dispatch(WalletsModule.hidePopup())
});

export default connect(
	mapStateToProps, mapDispatchToProps
)(WalletsContainer);
