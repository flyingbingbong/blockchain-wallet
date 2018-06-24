import * as chai from "chai";
import * as sinon from "sinon";
import { TxReducer, TxModule, LogsModule } from "../";
import configureMockStore from "redux-mock-store";
import * as services from "../../services";
import { thunk } from "../../lib/middlewares";

const expect = chai.expect;

describe("Tx module", () => {
	let store;
	let sandbox, fakeCreateTxAPI, clock, now;
	const TypeKeys = TxModule.TypeKeys;
	const LogsTypeKeys = LogsModule.TypeKeys;
	const LogType = LogsModule.LogType;

	beforeEach(() => {
		clock = sinon.useFakeTimers((new Date()).getTime());
		now = new Date();
		const mockStore = configureMockStore([ thunk ]);
		store = mockStore({
			transaction: {
				sender: "",
				receiver: "",
				amount: 0,
				showPopup: false,
				pending: false,
				error: false
			}
		});

		sandbox = sinon.createSandbox();
		fakeCreateTxAPI = sandbox.stub(services,"createTxAPI");
	})

	it("should return success actions", async () => {
		const message = "New Tx Created";
		const responses = [
			{ nodeNum: 1, validate: true },
			{ nodeNum: 2, validate: true },
			{ nodeNum: 3, validate: true },
			{ nodeNum: 4, validate: true }
		];
		
		const expectedTypes = [
			TypeKeys.POST_TX_PENDING,
			TypeKeys.POST_TX_SUCCESS,
			LogsTypeKeys.ADD_LOG,
			TypeKeys.HIDE_POPUP
		];

		fakeCreateTxAPI.returns(Promise.resolve({
			data: {
				success: true,
				response: {
					result: true,
					consensus: 4,
					message,
					responses
				}
			}
		}));

		await store.dispatch(TxModule.createTx("sender", "receiver", 5));
		const types = store.getActions().map(v => v.type);

		expect(types.length).to.equal(expectedTypes.length);
		for (let t of expectedTypes) {
			expect(types).to.include(t);
		}
	});

	it("should return fail actions", async () => {
		const message = "Not Enough UTXO";
		
		fakeCreateTxAPI.returns(Promise.resolve({
			data: {
				success: false,
				message
			}
		}));

		const expectedPayload = {
			timestamp: `${now.getHours()}:${now.getMinutes()}`,
			type: LogType.TX_RESULT,
			text: message
		}
		await store.dispatch(TxModule.createTx("sender", "receiver", 5));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.POST_TX_PENDING },
			{ type: TypeKeys.POST_TX_FAILURE },
			{ type: LogsTypeKeys.ADD_LOG, payload: expectedPayload },
			{ type: TypeKeys.HIDE_POPUP }
		]);
	});

	it("should return fail actions when error", async () => {
		fakeCreateTxAPI.returns(Promise.reject());

		const expectedPayload = {
			timestamp: `${now.getHours()}:${now.getMinutes()}`,
			type: LogType.NETWORK_ERROR,
			text: `Request to ${process.env["API_URL"]} is failed`
		}
		await store.dispatch(TxModule.createTx("sender", "receiver", 5));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.POST_TX_PENDING },
			{ type: TypeKeys.POST_TX_FAILURE },
			{ type: LogsTypeKeys.ADD_LOG, payload: expectedPayload },
			{ type: TypeKeys.HIDE_POPUP }
		]);
	});

	afterEach(() => {
		store.clearActions();
		sandbox.restore();
		clock.restore;
	});
});
