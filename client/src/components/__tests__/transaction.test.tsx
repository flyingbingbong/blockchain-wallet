import * as React from "react";
import * as chai from "chai";
import { mount } from "enzyme";
import { CreateTxBtn, SelectWallet, AmountInput, CreateTxPopup } from "../transaction";

const expect = chai.expect;

describe("Transaction component", () => {
	beforeEach(() => {
		
	});

	it("should render CreateTxBtn", () => {
		var callbackVar; 
		const onShowPopup = () => { callbackVar = 1};
		const component = mount(
			<CreateTxBtn
				onShowPopup={ onShowPopup }
			/>
		);
		
		expect(component.length).to.equal(1);

		component.simulate("click");
		expect(callbackVar).to.equal(1);
	});

	it("should render SelectWallet", () => {
		var callbackVar;
		const wallets = [
			{ name: "a", pubkey: "A", utxo: [], isMiner: true },
			{ name: "b", pubkey: "B", utxo: [], isMiner: false },
			{ name: "c", pubkey: "C", utxo: [], isMiner: true }
		];
		const pubkey = "B";
		const onChangePubkey = (pk) => {
			callbackVar = pk;
			return () => true;
		};

		const component = mount(
			<SelectWallet
				wallets={ wallets }
				pubkey={ pubkey }
				onChangePubkey={ onChangePubkey }
			/>
		);

		expect(component.length).to.equal(1);
		expect(component.find("option").length).to.equal(wallets.length);

		component.simulate("change", { target: { value: 1 }})
		expect(callbackVar).to.equal(1);
	});

	it("should render AmountInput", () => {
		var callbackVar;
		const amount = 10;
		const onChangeAmount = (a) => {
			callbackVar = a;
			return () => true
		};

		const component = mount(
			<AmountInput
				amount={ amount }
				onChangeAmount={ onChangeAmount }
			/>
		);
	
		expect(component.length).to.equal(1);

		component.simulate("change", { target: { value: 2 }})
		expect(callbackVar).to.equal(2);
	});

	it("should render CreateTxPopup", () => {
		var callbackVar;
		var showPopup = true;
		const wallets = [
			{ name: "a", pubkey: "A", utxo: [], isMiner: true },
			{ name: "b", pubkey: "B", utxo: [], isMiner: false },
			{ name: "c", pubkey: "C", utxo: [], isMiner: true }
		];
		const sender = "A";
		const receiver = "B";
		const amount = 10;
		const onCreateTx = () => { callbackVar = 2 };
		const onHidePopup = () => { callbackVar = 3 };
		const onChangeSender = (a) => {
			callbackVar = a;
			return () => true;
		};
		const onChangeReceiver = (a) => {
			callbackVar = a;
			return () => true;
		};
		const onChangeAmount = (a) => {
			callbackVar = a;
			return () => true;
		};
		
		const component = mount(
			<CreateTxPopup
				showPopup={ showPopup }
				wallets={ wallets }
				sender={ sender }
				receiver={ receiver }
				amount={ amount }
				onCreateTx={ onCreateTx }
				onHidePopup={ onHidePopup }
				onChangeSender={ onChangeSender }
				onChangeReceiver={ onChangeReceiver }
				onChangeAmount={ onChangeAmount }
			/>
		);

		expect(component.find(".tx-popup").length).to.equal(1);
		
		component.find(".tx-popup-hide").simulate("click");
		expect(callbackVar).to.equal(3);

		component.find(SelectWallet).at(0).simulate("change", { target: { value: 4 }});
		expect(callbackVar).to.equal(4);

		component.find(SelectWallet).at(1).simulate("change", { target: { value: 5 }});
		expect(callbackVar).to.equal(5);

		component.find(AmountInput).simulate("change", { target: { value: 6 }});
		expect(callbackVar).to.equal(6);

		component.find(".tx-submit").simulate("click");
		expect(callbackVar).to.equal(2);
	});

	it("should not render popup", () => {
		const component = mount(
			<CreateTxPopup
				showPopup={ false }
			/>
		);

		expect(component.find(".tx-popup").length).to.equal(0);
	});
})
