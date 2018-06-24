import * as React from "react";
import * as chai from "chai";
import * as sinon from "sinon";
import { mount } from "enzyme";
import configureMockStore from 'redux-mock-store';
import { thunk } from '../../lib/middlewares';
import { Provider } from 'react-redux';
import { WalletsContainer, CreateWalletPopup } from "../";
import * as services from "../../services";
import { WalletsModule } from "../../modules";

const expect = chai.expect;

describe("Wallets container", () => {
	let mockStore, store;
	let sandbox, fakeWalletsAPI, fakeCreateWalletAPI;
	let wallets, utxo;
	const TypeKeys = WalletsModule.TypeKeys;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		fakeWalletsAPI = sandbox.stub(services, "getWalletsAPI");
		fakeCreateWalletAPI = sandbox.stub(services, "createWalletAPI");
		mockStore = configureMockStore([ thunk ]);
		store = mockStore({
			wallets: {
				data: [],
				pending: false,
				error: false
			}
		});
		const receiver = "Bet man";
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
		wallets = [
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
	});

	it("should render", async () => {
		fakeWalletsAPI.returns(Promise.resolve({
			data: {
				success: true,
				wallets
			}
		}));
		const container = await mount(
			<Provider store={ store }>
				<WalletsContainer/>
			</Provider>
		);
		return Promise.resolve(container)
			.then(() => {
				expect(container.find(WalletsContainer).length).to.equal(1);
				expect(store.getActions()).to.deep.equal([
					{ type: TypeKeys.GET_WALLETS_PENDING },
					{ type: TypeKeys.GET_WALLETS_SUCCESS, payload: wallets }
				]);
			});
	});

	it("should catch error", async () => {
		fakeWalletsAPI.returns(Promise.reject());
		const container = await mount(
			<Provider store={ store }>
				<WalletsContainer/>
			</Provider>
		);
		return Promise.resolve(container)
			.then(() => {
				expect(container.find(WalletsContainer).length).to.equal(1);
				expect(store.getActions()).to.deep.equal([
					{ type: TypeKeys.GET_WALLETS_PENDING },
					{ type: TypeKeys.GET_WALLETS_FAILURE }
				]);
			})
	});

	it("should render popup", async () => {
		const container = mount(
			<CreateWalletPopup
				showPopup={ true }
				onHidePopup={ () => WalletsModule.hidePopup }
				onCreateWallet={ WalletsModule.createWallet }
				onGetWallets={ WalletsModule.getWallets }
			/>
		);
		expect(container.find(".wallet-create-popup").length).to.equal(1);
	});

	it("should not render popup", () => {
		const container = mount(
			<CreateWalletPopup
				showPopup={ false }
				onHidePopup={ () => WalletsModule.hidePopup }
				onCreateWallet={ WalletsModule.createWallet }
				onGetWallets={ WalletsModule.getWallets }
			/>
		);
		expect(container.find(".wallet-create-popup").length).to.equal(0);
	});

	it("should react with click", async () => {
		fakeWalletsAPI.returns(Promise.resolve({
			data: {
				success: true,
				wallets
			}
		}));
		fakeCreateWalletAPI.returns(Promise.resolve({
			data: { success: true }
		}))
		store = mockStore({
			wallets: {
				data: [],
				showPopup: true,
				pending: false,
				error: false
			}
		});
		const container = mount(
			<Provider store={ store }>
				<WalletsContainer/>
			</Provider>
		);
		const popup = container.find(".wallet-create-popup");
		expect(popup.length).to.equal(1);

		return Promise.resolve(popup.find(".wallet-popup-submit").simulate("click"))
			.then(() => {
				expect(store.getActions()).to.deep.include({ 
					type: TypeKeys.POST_WALLET_SUCCESS
				});
			});
	});

	afterEach(() => {
		store.clearActions();
		sandbox.restore();
	});
});
