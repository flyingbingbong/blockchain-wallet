import * as React from "react";
import { connect } from "react-redux";
import { AppState, ILog } from "../types/index.d";
import { LogsModule, WalletsModule } from "../modules";
import { Logs } from "../components"; 
interface ILogsProps {
	logs: Array<ILog>,
	timer: any,
	onStartTimer: (timer: any) => (dispatch) => any,
	onStopTimer: () => (dispatch) => any,
	onGetWallets: () => (dispatch) => Promise<any>,
	onGetChain: () => (dispatch) => Promise<any>
};

export class LogsContainer extends React.Component<ILogsProps> {
	componentDidMount() {
		const { onStartTimer } = this.props;
		const timer = setInterval(this.callback.bind(this), 5000);

		onStartTimer(timer);
	}

	componentWillUnmount() {
		const { timer, onStopTimer } = this.props;
		if (timer) {
			clearInterval(timer);
			onStopTimer();
		}
	}

	async callback() {
		const { onGetChain, onGetWallets } = this.props;

		try {
			await onGetChain();
			await onGetWallets();
		} catch (err) {
			throw err;
		}
	}

	render() {
		const { logs } = this.props;

		return (
			<Logs logs={ logs }/>
		);
	}
}

const mapStateToProps = (state: AppState) => ({
	logs: state.logs.data,
	timer: state.logs.timer
});

const mapDispatchToProps = (dispatch) => ({
	onStartTimer: (timer: any) => dispatch(LogsModule.startTimer(timer)),
	onStopTimer: () => dispatch(LogsModule.stopTimer()),
	onGetWallets: () => dispatch(WalletsModule.getWallets()),
	onGetChain: () => dispatch(LogsModule.getChain())
});

export default connect(
	mapStateToProps, mapDispatchToProps
)(LogsContainer);
