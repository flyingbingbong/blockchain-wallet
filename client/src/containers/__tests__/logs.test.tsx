import * as React from "react";
import * as chai from "chai";
import * as sinon from "sinon";
import { mount } from "enzyme";
import configureMockStore from 'redux-mock-store';
import { thunk } from '../../lib/middlewares';
import { Provider } from 'react-redux';
import { LogsContainer } from "../";
import * as services from "../../services";
import { LogsModule } from "../../modules";

const expect = chai.expect;

describe("Logs container", () => {
	let store;
	let sandbox, fakeChainAPI, fakeWalletsAPI, clock;
	//let sandbox, fakeWalletsAPI;
	let logs, wallets;
	const TypeKeys = LogsModule.TypeKeys;

	beforeEach(() => {
		clock = sinon.useFakeTimers();
		const mockStore = configureMockStore([ thunk ]);
		store = mockStore({
			logs: {
				data: [],
				timer: 1
			}
		});
		sandbox = sinon.createSandbox();
		fakeChainAPI = sandbox.stub(services, "getChainAPI");
		fakeWalletsAPI = sandbox.stub(services, "getWalletsAPI");
		wallets = [
			{ name: "a", pubkey: "p1", privatekey: "p1", isMiner: false, utxo: [] },
			{ name: "b", pubkey: "p2", privatekey: "p2", isMiner: false, utxo: [] },
			{ name: "c", pubkey: "p3", privatekey: "p3", isMiner: false, utxo: [] }
		];
	});

	it("should render", async () => {
		fakeChainAPI.returns(Promise.resolve({
			data: {
				success: true,
				length: 1,
				chain: [ {} ]
			}
		}));
		fakeWalletsAPI.returns(Promise.resolve({
			data: {
				success: true,
				wallets
			}
		}));
		const container = await mount(
			<Provider store={ store }>
				<LogsContainer/>
			</Provider>
		);

		return Promise.resolve(container)
			.then(() => {
				expect(container.length).to.equal(1);
				const actions = store.getActions();
				expect(actions[0].type).to.equal(TypeKeys.START_TIMER);
				clock.tick(5000);
				console.log(actions)
				expect(actions[1].type).to.equal(TypeKeys.GET_CHAIN_PENDING);
			});
	});

	it("should return stop timer action when unmount", async () => {
		fakeChainAPI.returns(Promise.resolve());
		const container = await mount(
			<Provider store={ store }>
				<LogsContainer/>
			</Provider>
		);
		return Promise.resolve(container.unmount())
			.then(() => {
				expect(store.getActions()[1]).to.deep.equal({
					type: TypeKeys.STOP_TIMER
				});
			});
	});

	afterEach(() => {
		clock.restore();
		sandbox.restore();
		store.clearActions();
	});
});
