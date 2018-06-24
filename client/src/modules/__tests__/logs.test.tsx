import * as chai from "chai";
import * as sinon from "sinon";
import { LogsReducer, LogsModule } from "../";
import configureMockStore from "redux-mock-store";
import * as services from "../../services";
import { thunk } from "../../lib/middlewares";

const expect = chai.expect;

describe("Logs module", () => {
	let store;
	let sandbox, fakeChainAPI, clock, now;
	const TypeKeys = LogsModule.TypeKeys;
	const LogType = LogsModule.LogType;

	beforeEach(() => {
		clock = sinon.useFakeTimers((new Date()).getTime());
		now = new Date();
		const mockStore = configureMockStore([ thunk ]);
		store = mockStore({
			logs: {
				data: [],
				chainLength: 0,
				pending: false,
				error: false
			}
		});

		sandbox = sinon.createSandbox();
		fakeChainAPI = sandbox.stub(services, "getChainAPI");
	});

	it("should return start timer action", () => {
		const timer_id = 1;
		store.dispatch(LogsModule.startTimer(timer_id));
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.START_TIMER, payload: timer_id }
		]);
	});

	it("should return stop timer action", () => {
		store.dispatch(LogsModule.stopTimer());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.STOP_TIMER }
		]);
	});

	it("should return success actions", async () => {
		fakeChainAPI.returns(Promise.resolve({
			data: {
				success: true,
				length: 1,
				chain: [ {} ]
			}
		}));

		await store.dispatch(LogsModule.getChain());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.GET_CHAIN_PENDING },
			{ type: TypeKeys.GET_CHAIN_SUCCESS, payload: 1 },
			{
				type: TypeKeys.ADD_LOG, 
				payload: {
					timestamp: `${now.getHours()}:${now.getMinutes()}`,
					type: LogType.NEW_BLOCK_MINED,
					text: `New block is mined current chain length is 1`
				}
			},
		]);
	});

	it("should return failure actions", async () => {
		fakeChainAPI.returns(Promise.reject());

		await store.dispatch(LogsModule.getChain());
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.GET_CHAIN_PENDING },
			{ type: TypeKeys.GET_CHAIN_FAILURE },
			{
				type: TypeKeys.ADD_LOG, 
				payload: {
					timestamp: `${now.getHours()}:${now.getMinutes()}`,
					type: LogType.NETWORK_ERROR,
					text: `Request to ${process.env["API_URL"]} is failed`
				}
			}
		]);
	});

	afterEach(() => {
		sandbox.restore();
		store.clearActions();
	});
});
