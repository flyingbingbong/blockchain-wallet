import * as React from "react";
import * as chai from "chai";
import * as sinon from "sinon";
import { mount } from "enzyme";
import configureMockStore from 'redux-mock-store';
import { thunk } from '../../lib/middlewares';
import { Provider } from 'react-redux';
import { CreateTxPopupContainer, CreateTxBtnContainer } from "../";
import * as services from "../../services";
import { TxModule, LogsModule } from "../../modules";

const expect = chai.expect;

describe("Transaction container", () => {
	let mockStore, store;
	let sandbox, fakeCreateTxAPI;
	const TypeKeys = TxModule.TypeKeys;
	const LogsTypeKeys = LogsModule.TypeKeys;

	beforeEach(() => {
		const sender = "sender";
		const receiver = "receiver";
		const amount = 5;
		sandbox = sinon.createSandbox();
		fakeCreateTxAPI = sandbox.stub(services, "createTxAPI");
		mockStore = configureMockStore([ thunk ]);
		store = mockStore({
			wallets: {
				data: []
			},
			transaction: {
				showPopup: true,
				sender,
				receiver,
				amount,
				pending: false,
				error: false
			}
		});
	});

	it("should render CreateTxBtnContainer", () => {
		const container = mount(
			<Provider store={ store }>
				<CreateTxBtnContainer/>
			</Provider>
		);

		expect(container.find("button").length).to.equal(1);

		container.find("button").simulate("click");
		expect(store.getActions()).to.deep.equal([
			{ type: TypeKeys.SHOW_POPUP }
		]);
	});

	it("should render CreateTxPopupContainer", async () => {
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

		const container = mount(
			<Provider store={ store }>
				<CreateTxPopupContainer/>
			</Provider>
		);

		expect(container.find(".tx-popup").length).to.equal(1);

		await container.find(".tx-submit").simulate("click");

		const types = store.getActions().map(v => v.type);
		expect(types.length).to.equal(expectedTypes.length);
		for (let t of expectedTypes) {
			expect(types).to.include(t);
		}
	});

	afterEach(() => {
		store.clearActions();
		sandbox.restore();
	});
});
