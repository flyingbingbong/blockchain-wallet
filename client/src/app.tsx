import * as React from "react";
import { 
	WalletsContainer,
	LogsContainer,
	CreateTxPopupContainer, 
	CreateTxBtnContainer
} from "./containers";
import "./stylesheets/main.css";

class App extends React.Component {
	render() {
		return (
			<div>
				<WalletsContainer/>
				<LogsContainer/>
				<CreateTxPopupContainer/>
				<CreateTxBtnContainer/>
			</div>
		);
	}
}

export default App;
