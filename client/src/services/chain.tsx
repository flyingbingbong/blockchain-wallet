import axios from "axios";
const ENV = process.env;

export const getChainAPI = (): Promise<any> => {
	return axios.get(`${ENV.API_URL}/chain`);
}
