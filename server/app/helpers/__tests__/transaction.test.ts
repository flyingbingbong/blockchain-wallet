import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as db from "mongoose";
import { setup_db, reset_db } from "../../tests/setup";
import { TxHelper } from "../";
import { Request } from "../../utils";
import { User } from "../../models";

const expect = chai.expect;

describe("Transaction Helper", () => {
	var sandbox, fakeReqToNode;
	var user;

	beforeEach(async () => {
		try {
			await setup_db();
	
			sandbox = sinon.createSandbox();
			fakeReqToNode = sandbox.stub(Request, "reqToNode");
			user = new User({
				name: "ironman"
			});
			await user.save();
			await user.saveWithKeys();
		} catch (err) {
			throw err;
		}
	});

	it("should build inputs and outputs", () => {
		var utxo = [
			{
				id: "a",
				sender: "spider man",
				inputs: [],
				outputs: [
					{ receiver: user.pubkey, amount: 10 }
				],
				timestamp: Date.now()
			},
			{
				id: "b",
				sender: "Captain America",
				inputs: [],
				outputs: [
					{ receiver: "Captain America", amount: 10 },
					{ receiver: user.pubkey, amount: 5 }
				],
				timestamp: Date.now()
			},
			{
				id: "c",
				sender: "Black panther",
				inputs: [],
				outputs: [
					{ receiver: user.pubkey, amount: 20 }
				],
				timestamp: Date.now()
			}
		];
		var inputs = [];
		var outputs = [];
		var hasEnoughTx;
		var amount;
		const receiver = "Spider man";

		// case small amount
		amount = 5;
		hasEnoughTx = TxHelper.buildIOputs(
			inputs, outputs, user.pubkey, receiver, utxo, amount
		);

		expect(hasEnoughTx).to.equal(true);
		expect(inputs).to.deep.equal([
			{ id: "b", amount }
		]);
		expect(outputs).to.deep.equal([
			{ receiver, amount }
		]);

		// case middle amount
		inputs = [], outputs = [];
		amount = 10;
		hasEnoughTx = TxHelper.buildIOputs(
			inputs, outputs, user.pubkey, receiver, utxo, amount
		);

		expect(hasEnoughTx).to.equal(true);
		expect(inputs).to.deep.equal([
			{ id: "b", amount: 5 },
			{ id: "a", amount: 10 }
		]);
		expect(outputs).to.deep.equal([
			{ receiver, amount },
			{ receiver: user.pubkey, amount: 5 }
		]);

		// case middle amount
		inputs = [], outputs = [];
		amount = 15;
		hasEnoughTx = TxHelper.buildIOputs(
			inputs, outputs, user.pubkey, receiver, utxo, amount
		);

		expect(hasEnoughTx).to.equal(true);
		expect(inputs).to.deep.equal([
			{ id: "b", amount: 5 },
			{ id: "a", amount: 10 }
		]);
		expect(outputs).to.deep.equal([
			{ receiver, amount },
		]);

		// case large amount
		inputs = [], outputs = [];
		amount = 40;
		hasEnoughTx = TxHelper.buildIOputs(
			inputs, outputs, user.pubkey, receiver, utxo, amount
		);

		expect(hasEnoughTx).to.equal(false);
		expect(inputs).to.deep.equal([
			{ id: "b", amount: 5 },
			{ id: "a", amount: 10 },
			{ id: "c", amount: 20 }
		]);
		expect(outputs.length).to.equal(0);
	});

	it("should return response of creation of tx", async () => {
		const expectedResponse = {
			success: true,
			result: true,
			consensus: 4
		};
		fakeReqToNode.returns(Promise.resolve(expectedResponse));

		const response = await TxHelper.reqCreate(user.pubkey, [], []);
		expect(response).to.deep.equal(expectedResponse);
	});

	afterEach(async () => {
		try {
			await reset_db();
			sandbox.restore();
		} catch (err) {
			throw err;
		}
	});
});
