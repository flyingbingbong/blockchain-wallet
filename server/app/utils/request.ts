import axios from "axios";
import { Node, INodeModel } from "../models";

export const reqToNode = async (
	method: string, 
	url: string, 
	data: object
): Promise<any> => {
    var req = (method == "POST") ? axios.post : axios.get;

	const nodes: Array<INodeModel> = await Node.find();
	const node: INodeModel = nodes[ Math.floor(Math.random() * nodes.length) ];
	const res: object = (await req(`http://${node.address}${url}`, data)).data;

	return res;
}

