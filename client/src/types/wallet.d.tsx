export interface ITxInput {
	id: string,
	amount: number
}

export interface ITxOutput {
	receiver: string,
	amount: number
}

export interface ITransaction {
	id?: string,
	sender: string,
	inputs: Array<ITxInput>,
	outputs: Array<ITxOutput>,
	timestamp: number
} 

export interface IUser {
	name: string,
	pubkey: string,
	privatekey?: string,
	isMiner?: boolean
}

export interface IWallet extends IUser {
	utxo: Array<ITransaction>
}
