import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as db from "mongoose";
import * as Crypto from "crypto";
import { ec as EC } from "elliptic"; 
import { setup_db, reset_db } from "../../tests/setup";
import { User } from "../../models";
import { Sign } from "../";

const expect = chai.expect;

describe("Sign utils", () => {
	var user, tx;

	beforeEach(async () => {
		try {
			await setup_db();

			user = new User({
				name: "ironman"
			});
			await user.save();
			await user.saveWithKeys();

			tx = {
				sender: user.pubkey,
				timestamp: Date.now()
			};
		} catch (err) {
			throw err;
		}
	});

	it("should return correct sign from privatekey", () => {
		const ec = EC("secp256k1");
		const privatekey = user.privatekey;
		const sign = Sign.sign(privatekey, tx);
		const msghex = Crypto.createHash("sha1").update(
			tx.sender +
			tx.timestamp
		).digest("hex");
		const verifier = ec.keyFromPublic(user.pubkey, "hex").verify(msghex, sign);

		expect(verifier).to.equal(true);
	});

	afterEach(async () => {
		try {
			await reset_db();
		} catch (err) {
			throw err;
		}
	});
})
