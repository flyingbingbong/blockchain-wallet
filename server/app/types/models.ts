import { Schema } from "mongoose";

export interface IUser {
    _id?: Schema.Types.ObjectId,
	name: string,
	pubkey: string,
	privatekey: string,
	isMiner: boolean
} 

export interface INode {
    _id?: Schema.Types.ObjectId,
	host: string, 
    port: number 
} 
