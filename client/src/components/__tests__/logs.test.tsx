import * as React from "react";
import * as chai from "chai";
import { mount } from "enzyme";
import { Logs } from "../";

const expect = chai.expect;

describe("Logs component", () => {
	it("should render", () => {
		const logs = [
			{ type: "a", text: "Nuclear detected" },
			{ type: "a", text: "Scv go sir" },
			{ type: "b", text: "absolutely" },
			{ type: "a", text: "rock and roll" }
		];

		const component = mount(<Logs logs={ logs }/>);
		expect(component.length).to.equal(1);
		expect(component.find("li").length).to.equal(logs.length);
	});
});
