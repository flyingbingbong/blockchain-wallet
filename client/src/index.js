import * as ReactDom from "react-dom";
import * as React from "react";
import { thunk } from "./lib/middlewares";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Reducer from "./modules";
import App from "./app";

const middlewares = applyMiddleware(thunk);
const store = createStore(Reducer, middlewares);

ReactDom.render(
	<Provider store={ store }>
		<App/>
	</Provider>,
    document.getElementById("root")
);  
