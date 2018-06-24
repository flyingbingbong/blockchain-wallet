import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as db from "mongoose";
import { setup_db, reset_db } from "../../tests/setup";
import { Request } from "../";

const expect = chai.expect;

describe("request utils", () => {
	beforeEach(async () => {
		try {
			await setup_db();
		} catch (err) {
			throw err;
		}
	});

	describe.skip("network required", () => {
		it("should get response", async () => {
			var res = await Request.reqToNode("GET", "/chain", {});
			console.log(res);
		});
	});

	afterEach(async () => {
		try {
			await reset_db();
		} catch (err) {
			throw err;
		}
	})
});
