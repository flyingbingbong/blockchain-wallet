import * as chai from "chai";
import * as sinon from "sinon";
import { WalletsReducer, WalletsModule } from "../";
import configureMockStore from "redux-mock-store";
import { thunk } from "../../lib/middlewares";
import * as services from "../../services";

const expect = chai.expect;

describe("Wallets modules", () => {
	let store, sandbox;
	let fakeWalletsAPI, fakeCreateWalletAPI;
	let payload;

	beforeEach(() => {
		sandbox = sinon.createSandbox();

		const middlewares = [ thunk ];
		const mockStore = configureMockStore(middlewares);
		store = mockStore({});

		fakeWalletsAPI = sandbox.stub(services, "getWalletsAPI");
		fakeCreateWalletAPI = sandbox.stub(services, "createWalletAPI");
		payload = [
			{ name: "a", pubkey: "p1", privatekey: "p1", isMiner: false, utxo: [] },
			{ name: "b", pubkey: "p2", privatekey: "p2", isMiner: false, utxo: [] },
			{ name: "c", pubkey: "p3", privatekey: "p3", isMiner: false, utxo: [] }
		];
	});

	it("should return initialSate", () => {
		const action = { type: undefined, payload: undefined };
		const initialState = WalletsModule.initialState;

		expect(
			WalletsReducer(initialState, action)
		).to.deep.equal(initialState);
	});

	it("should create GET_WALLETS_SUCCESS action", async () => {
		const TypeKeys = WalletsModule.TypeKeys;
		fakeWalletsAPI.returns(Promise.resolve({
			data: {
				success: true,
				wallets: payload
			}
		}));

		await store.dispatch(WalletsModule.getWallets());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.GET_WALLETS_PENDING },
			{ type: TypeKeys.GET_WALLETS_SUCCESS, payload }
		]);
	});

	it("should create GET_WALLETS_FAILURE action", async () => {
		const TypeKeys = WalletsModule.TypeKeys;
		fakeWalletsAPI.returns(Promise.resolve({
			data: {
				success: false
			}
		}));

		await store.dispatch(WalletsModule.getWallets());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.GET_WALLETS_PENDING },
			{ type: TypeKeys.GET_WALLETS_FAILURE }
		]);
	});

	it("should create GET_WALLETS_FAILURE action when error", async () => {
		const TypeKeys = WalletsModule.TypeKeys;
		fakeWalletsAPI.returns(Promise.reject());

		await store.dispatch(WalletsModule.getWallets());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.GET_WALLETS_PENDING },
			{ type: TypeKeys.GET_WALLETS_FAILURE }
		]);
	});

	it("should create POST_WALLET_SUCCESS action", async () => {
		const name = "Aqua";
		const TypeKeys = WalletsModule.TypeKeys;
		fakeCreateWalletAPI.returns(Promise.resolve({
			data: {
				success: true,
			}
		}));

		await store.dispatch(WalletsModule.createWallet(name));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.POST_WALLET_PENDING },
			{ type: TypeKeys.POST_WALLET_SUCCESS },
			{ type: TypeKeys.HIDE_POPUP }
		]);
	});

	it("should create failure action", async () => {
		const name = "Aqua";
		const TypeKeys = WalletsModule.TypeKeys;
		fakeCreateWalletAPI.returns(Promise.resolve({
			data: {
				success: false
			}
		}));

		await store.dispatch(WalletsModule.createWallet(name));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.POST_WALLET_PENDING },
			{ type: TypeKeys.POST_WALLET_FAILURE },
			{ type: TypeKeys.HIDE_POPUP }
		]);
	});

	it("should create failure action when error", async () => {
		const name = "Aqua";
		const TypeKeys = WalletsModule.TypeKeys;
		fakeCreateWalletAPI.returns(Promise.reject());

		await store.dispatch(WalletsModule.createWallet(name));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.POST_WALLET_PENDING },
			{ type: TypeKeys.POST_WALLET_FAILURE },
			{ type: TypeKeys.HIDE_POPUP }
		]);
	});
	afterEach(() => {
		sandbox.restore();
		store.clearActions();
	});
});
