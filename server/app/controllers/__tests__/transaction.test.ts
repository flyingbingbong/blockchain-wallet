import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as db from "mongoose";
import { setup_db, reset_db } from "../../tests/setup";
import { TxController } from "../";
import { Request } from "../../utils";
import { TxHelper } from "../../helpers";
import { User } from "../../models";

const expect = chai.expect;

describe("Transaction Controller", () => {
	var sandbox, fakeReqToNode;
	var user, utxo;

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
			utxo = [
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
		} catch (err) {
			throw err;
		}
	});

	it("should return successed response of txCreate with request", async () => {
		const expectedResponse = {
			success: true,
			response: {
				success: true,
				result: true,
				consensus: 4
			}
		};
		const receiver = "Spider man";
		const amount = 5;
		var ctx = {
			request: { body: {
				sender: user.pubkey, 
				receiver, 
				amount
			}},
			body: {}
		};
		fakeReqToNode.onCall(0).returns(Promise.resolve({ utxo }));
		fakeReqToNode.onCall(1).returns(Promise.resolve(expectedResponse.response));

		await TxController.create(ctx);
		expect(ctx.body).to.deep.equal(expectedResponse);
	});

	it("should return NOT ENOUGH TX response of txCreate with request", async () => {
		var fakeBuildIOputs = sandbox.stub(TxHelper, "buildIOputs");
		fakeBuildIOputs.returns(false);
		const expectedResponse = {
			success: false,
			message: TxController.NOT_ENOUGH_TX
		};
		const receiver = "Spider man";
		const amount = 5;
		var ctx = {
			request: { body: {
				sender: user.pubkey, 
				receiver, 
				amount
			}},
			body: {}
		};
		fakeReqToNode.returns(Promise.resolve({ utxo }));

		await TxController.create(ctx);
		expect(ctx.body).to.deep.equal(expectedResponse);
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
