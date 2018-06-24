import { model, Model, Schema, Document } from "mongoose";
import { IUser } from "../types";
import { ec as EC } from "elliptic";

export interface IUserModel extends IUser, Document {
	saveWithKeys(): Promise<IUserModel>,
	toObject(): object
};

const schema: Schema = new Schema({
	name: { type: String, required: true, unique: true },
	pubkey: String,
	privatekey: String,
	isMiner: { type: Boolean, default: false }
});

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function(doc, ret, options): object {
	delete ret._id;
	delete ret.__v;
	return ret;
}

schema.methods.saveWithKeys = async function(): Promise<void> {
	const ec = new EC("secp256k1");
	const key = ec.genKeyPair();

	this.privatekey = key.getPrivate("hex");
	this.pubkey = key.getPublic("hex");

	await this.save();
}

export const User: Model<IUserModel> = model("users", schema);
