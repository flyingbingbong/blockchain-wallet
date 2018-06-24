import * as React from "react";
import { ILog } from "../types/index.d";
import "../stylesheets/logs.css";

interface ILogsProps {
	logs: Array<ILog>
}

export class Logs extends React.Component<ILogsProps> {
	constructor(props) {
		super(props);
	}

	render() {
		const { logs } = this.props;

		var logList = logs.map((v, i) => (
			<li 
				className="log"
				key={ i }
			>
				<span className="log-time">{ v.timestamp }</span>
				<span className="log-type">{ v.type }</span>
				<span className="log-text">{ v.text }</span>
			</li>
		));

		return (
			<div className="log-container">
				<ul>{ logList }</ul>
			</div>
		);
	}
}
