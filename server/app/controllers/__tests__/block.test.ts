import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as db from "mongoose";
import axios from "axios";
import { setup_db, reset_db } from "../../tests/setup";
import { BlockController } from "../";

const expect = chai.expect;

describe("Block controller", () => {
	var sandbox, fakeAxios;

	beforeEach(async () => {
		try {
			await setup_db();
	
			sandbox = sinon.createSandbox();
			fakeAxios = sandbox.stub(axios, "get");
		} catch (err) {
			throw err;
		}
	});

	it("should return chain", async () => {
		var ctx = {
			body: null
		};
		const chain = [ {}, {} ];
		fakeAxios.returns(Promise.resolve({
			data: {
				success: true,
				chain
			}
		}));
		
		await BlockController.chain(ctx);
		expect(ctx.body.success).to.equal(true);
		expect(ctx.body.chain).to.deep.equal(chain);
		expect(ctx.body.length).to.deep.equal(chain.length);
	});

	afterEach(async () => {
		try {
			await reset_db();
			sandbox.restore();
		} catch (err) {
			throw err;
		}
	});
})
