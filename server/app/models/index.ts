const ENV = process.env;

export { User, IUserModel } from "./user";
export { Node, INodeModel } from "./node";
export const DB_ADDRESS:string = `mongodb://${ENV["DB_HOST"]}/${ENV["DB_NAME"]}`;
