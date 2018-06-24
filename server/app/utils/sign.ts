import { ec as EC } from "elliptic"; 
import * as Crypto from "crypto";
import { ITransaction } from "../types";

export const sign = (privatekey: string, tx: ITransaction) => {
	const ec = EC("secp256k1");
	const msghex = Crypto.createHash("sha1").update(
		tx.sender +
		tx.timestamp
	).digest("hex");
	const sign = ec.keyFromPrivate(privatekey, "hex").sign(msghex).toDER("hex");

	return sign;
}
