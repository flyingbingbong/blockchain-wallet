import * as React from "react";
import { IWallet, ITxInput } from "../types/index.d";
import "../stylesheets/wallets.css";

export const Wallets: React.SFC<any> = ({
	wallets, onShowPopup
}) => {
	wallets = wallets.map((v, i) => (
		<Wallet 
			key={ i }
			name={ v.name }
			pubkey={ v.pubkey }
			isMiner={ v.isMiner }
			utxo={ v.utxo }
		/>
	));

	return (
		<div className="wallet-container">
			{ wallets }
			<div className="wallet-create-btn" onClick={ onShowPopup }>New Wallet</div>
		</div>
	);
}

export const Wallet: React.SFC<IWallet> = ({ name, pubkey, isMiner, utxo }) => {
	return (
		<div className="wallet">
			<span className="wallet-name">{ name }</span>
			<div className="wallet-attr">
				<span className="wallet-attr-label">공개키</span>
				<span className="wallet-attr-value">{ pubkey }</span>
			</div>
			{ utxo.length ?
			<div className="wallet-attr">
				<span className="wallet-attr-label">UTXO</span>
				<Utxo utxo={ utxo }/>
			</div>
			: null }
		</div>
	);
}

export const Utxo: React.SFC<any> = ({ utxo }) => {
	utxo = utxo.map((v, i) => (
		<li className="utxo" key={ i }>
			{ v.sender ? 
			<div className="utxo-attr">
				<span className="utxo-attr-label">sender</span>
				<span className="utxo-attr-value">{ v.sender }</span>
			</div>
			: null }
			{ v.inputs.length ? 
			<div className="utxo-IOputs">
				<span className="utxo-attr-label">inputs</span>
				<IOputs data={ v.inputs } type="I"/>
			</div>
			: null }
			<div className="utxo-IOputs">
				<span className="utxo-attr-label">outputs</span>
				<IOputs data={ v.outputs } type="O"/>
			</div>
		</li>
	));

	return (
		<ul className="utxo-container">{ utxo }</ul>
	);
}

export const IOputs: React.SFC<any> = ({ data, type }) => {
	const key = (type == "I") ? "id" : "receiver";
	const list: Array<JSX.Element> = data.map((v, i) => (
		<li className="ioput" key={ i }>
			<div>
				<span className="utxo-IOputs-label">{ key }</span>
				<span className="utxo-IOputs-value">{ v[key] }</span>
			</div>
			<div>
				<span className="utxo-IOputs-label">amount</span>
				<span className="utxo-IOputs-value">{ v.amount }</span>
			</div>
		</li>
	));

	return (
		<ul className="ioputs-container">{ list }</ul>
	);
}
