import React from "react"
import MessageArgument from "../../components/MessageArgument.jsx"
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

it('MessageArgument', () => {
	const wrapper = mount(
		<MessageArgument text="some text some text some text some text"/>
	);
	expect(toJson(wrapper)).toMatchSnapshot();

	wrapper.find('a').first().simulate('click');
	expect(toJson(wrapper)).toMatchSnapshot();
});
