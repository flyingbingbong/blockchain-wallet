import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import "jsdom-global/register";
import * as ENV from "../../configs/env.dev";

Enzyme.configure({ adapter: new Adapter() });
Object.assign(process.env, ENV);
