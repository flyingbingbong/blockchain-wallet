import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as db from "mongoose";
import { User } from "../../models";
import { setup_db, reset_db } from "../../tests/setup";
import { UserController } from "../";
import { Request } from "../../utils";

const expect = chai.expect;

describe("User Controller", () => {
	var sandbox, fakeReqToNode;
	var users;

	beforeEach(async () => {
		try {
			await setup_db();

			sandbox = sinon.createSandbox();
			fakeReqToNode = sandbox.stub(Request, "reqToNode");
			users = await User.insertMany([
				{ name: "Ironman" },
				{ name: "Spider man" },
				{ name: "Captain America" },
				{ name: "Black Panther" }
			]);

			for (let user of users) {
				await user.saveWithKeys();
			}
		} catch (err) {
			throw err;
		}
	});

	it("should create user", async () => {
		var ctx = {
			body: null,
			request: { body: { name: "bingbong" }}
		};

		await UserController.create(ctx);
		expect(ctx.body.user.privatekey).to.not.equal(undefined);
		expect(ctx.body.user.pubkey).to.not.equal(undefined);
	});

	it("should return wallets", async () => {
		const utxo = [
			{
				id: "a",
				sender: "spider man",
				inputs: [],
				outputs: [
					{ receiver: users[0].pubkey, amount: 10 }
				],
				timestamp: Date.now()
			},
			{
				id: "b",
				sender: "Captain America",
				inputs: [],
				outputs: [
					{ receiver: "Captain America", amount: 10 },
					{ receiver: users[0].pubkey, amount: 5 }
				],
				timestamp: Date.now()
			},
			{
				id: "c",
				sender: "Black panther",
				inputs: [],
				outputs: [
					{ receiver: users[0].pubkey, amount: 20 }
				],
				timestamp: Date.now()
			}
		];
		fakeReqToNode.returns(Promise.resolve({ utxo }));
		var ctx = {
			body: null
		};

		await UserController.wallets(ctx);
		for (var i=0; i < ctx.body.wallets.length; i++) {
			expect(ctx.body.wallets[i].utxo.length).to.equal(utxo.length);
		}
	});

	afterEach(async () => {
		try {
			await reset_db();
			sandbox.restore();
		} catch (err) {
			throw err;
		}
	})
})
