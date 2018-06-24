import axios from "axios";
const ENV = process.env;

export const createTxAPI = ({ sender, receiver, amount }): Promise<any> => {
	return axios.post(`${ENV.API_URL}/transaction/create`, {
		sender, receiver, amount
	});
}
