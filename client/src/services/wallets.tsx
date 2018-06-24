import axios from "axios";
const ENV = process.env;

export const getWalletsAPI = (): Promise<any> => {
	return axios.get(`${ENV.API_URL}/wallets`);
}

export const createWalletAPI = (name: string): Promise<any> => {
	return axios.post(`${ENV.API_URL}/wallet/create`, { name });
}
