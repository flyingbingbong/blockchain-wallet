import * as React from "react";
import * as chai from "chai";
import { mount } from "enzyme";
import { IOputs, Wallet, Wallets, Utxo } from "../";
import { WalletsModule } from "../../modules";

const expect = chai.expect;

describe("Wallets component", () => {
	let receiver, utxo;

	beforeEach(() => {
		receiver = "Iron man";
		utxo = [
			{
				id: "a",
				sender: "spider man",
				inputs: [],
				outputs: [
					{ receiver, amount: 10 }
				],
				timestamp: Date.now()
			},
			{
				id: "b",
				sender: "Captain America",
				inputs: [],
				outputs: [
					{ receiver: "Captain America", amount: 10 },
					{ receiver, amount: 5 }
				],
				timestamp: Date.now()
			},
			{
				id: "c",
				sender: "Black panther",
				inputs: [],
				outputs: [
					{ receiver, amount: 20 }
				],
				timestamp: Date.now()
			}
		];
	});

	it("should return IOputs component", () => {
		const inputsData = [
			{ id: "a", amount: 5 },
			{ id: "b", amount: 10 }
		];
		const outputsData = [
			{ receiver: "Iron man", amount: 5 },
			{ receiver: "Bat man", amount: 10 }
		];
		var component = mount(<IOputs data={ inputsData } type="I"/>);
		expect(component.length).to.equal(1);
		expect(component.find("li").length).to.equal(inputsData.length);
		expect(component.find(".utxo-IOputs-label").at(0).text()).to.equal("id");
		
		component = mount(<IOputs data={ outputsData } type="O"/>);
		expect(component.length).to.equal(1);
		expect(component.find("li").length).to.equal(outputsData.length);
		expect(component.find(".utxo-IOputs-label").at(0).text()).to.equal("receiver");
	});

	it("should return utxo component", () => {
		var component = mount(<Utxo utxo={ utxo }/>);
		expect(component.length).to.equal(1);
		expect(component.find(".utxo").length).to.equal(utxo.length);
	});

	it("should return wallet component", () => {
		const wallet = {
			name: "Iron man",
			pubkey: "1",
			isMiner: true,
			utxo
		};
		var component = mount(
			<Wallet 
				name={ wallet.name }
				pubkey={ wallet.pubkey }
				isMiner={ wallet.isMiner }
				utxo={ wallet.utxo }
			/>
		);

		expect(component.length).to.equal(1);
		expect(component.find(".utxo").length).to.equal(utxo.length);
	});

	it("should return wallets", () => {
		const wallets = [
			{
				name: "Iron man",
				pubkey: "1",
				isMiner: true,
				utxo
			},
			{
				name: "Spider man",
				pubkey: "2",
				isMiner: true,
				utxo
			},
			{
				name: "Bat man",
				pubkey: "3",
				isMiner: false,
				utxo
			},
		];
		var component = mount(
			<Wallets wallets={ wallets }/>
		);

		expect(component.length).to.equal(1);
		expect(component.find(Wallet).length).to.equal(wallets.length);
		expect(component.find(Utxo).length).to.equal(wallets.length);
	});
})
