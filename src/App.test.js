import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Members } from './Components/Members';
Enzyme.configure({ adapter: new Adapter() });
describe('Members', () => {
  it("renders without crashing", () => {
    shallow(<Members/>);
  });
});