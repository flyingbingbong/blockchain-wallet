import { model, Model, Schema, Document } from "mongoose";
import { INode } from "../types";

export interface INodeModel extends INode, Document {
	address: string,
	toObject(): object
};

const schema: Schema = new Schema({
	host: { type: String, required: true },
    port: { type: Number, required: true }
});

schema.virtual("address").get(function() {
    return this.host + ":" + this.port;
})

export const Node: Model<INodeModel> = model("nodes", schema);
