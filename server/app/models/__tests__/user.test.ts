import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as db from "mongoose";
import { User } from "../";
import { setup_db, reset_db } from "../../tests/setup";
import { ec as EC } from "elliptic"; 
import * as Crypto from "crypto";

const expect = chai.expect;

describe("User model", () => {
	var msg, user;

	beforeEach(async () => {
		try {
			await setup_db();

			user = new User({
				name: "ironman"
			});

			await user.save();
		} catch (err) {
			throw err;
		}
	});

	it("should generate key pair", async () => {
		try {
			var msg = {
				sender: null,
				inputs: [
					{ id: "id1", amount: 5 }
				],
				outputs: [
					{ receiver: "receiver", amount: 5 }
				],
            	timestamp: 1528215499538
			};
			const ec = EC("secp256k1");
			await user.saveWithKeys();
			const privatekey = user.privatekey;
			var pubkey = user.pubkey;
			const wrongPubkey = ec.genKeyPair().getPublic("hex");
			msg.sender = pubkey;
			var msghex = Crypto.createHash("sha256").update(JSON.stringify(msg)).digest("hex");

			var sign = ec.keyFromPrivate(privatekey, "hex").sign(msghex).toDER("hex");
			var verifier = ec.keyFromPublic(pubkey, "hex").verify(msghex, sign);
			var wrongVerifier = ec.keyFromPublic(wrongPubkey, "hex").verify(msghex, sign);

			expect(verifier).to.equal(true);
			expect(wrongVerifier).to.equal(false);
		} catch (err) {
			throw err;
		}
	})

	afterEach(async () => {
		try {
			await reset_db();
		} catch (err) {
			throw err;
		}
	})
})
