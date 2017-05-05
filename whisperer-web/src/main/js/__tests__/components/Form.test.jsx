import React from "react";
import Form from "../../components/Form.jsx";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { connectionParams } from '../fixtures'

describe('Form', () => {
	const props = {
		connectionParams: connectionParams,
		isListening: false,
		startListening: () => {},
		stopListening: () => {},
		updateCurrentConnectionParams: () => {}
	};

	it('rendering', () => {
		let tree = renderer.create(
			<Form { ...props } />
		).toJSON();
		expect(tree).toMatchSnapshot();

		tree = renderer.create(
			<Form { ...props } isListening={true} />
		).toJSON();
		expect(tree).toMatchSnapshot()
	});

	describe('form changes handler', () => {
		it('key changed', done => {
			const checkKeyChanged = (field, inputId) => {
				const updateCurrentConnectionParams = (key, value) => {
					expect(key).toBe(field);
					expect(value).toBe('qwe');
					done();
				};
				const wrapper = mount(
					<Form { ...props } updateCurrentConnectionParams={updateCurrentConnectionParams} />
				);
				wrapper.find(inputId).node.value = 'qwe';
				wrapper.find(inputId).simulate('change');
			};
			checkKeyChanged('key', '#mdcKeyInput');
			checkKeyChanged('value', '#mdcValueInput');
			checkKeyChanged('prefix', '#logPrefixInput');
			checkKeyChanged('severity', '#severityInput');
		});

		it('start listening', done => {
			const startListening = () => done();
			mount(
				<Form { ...props } startListening={startListening} />
			).find('a').simulate('click');
		});

		it('stop listening', done => {
			const stopListening = () => done();
			mount(
				<Form { ...props } isListening={true} stopListening={stopListening} />
			).find('a').simulate('click');
		});
	});
});