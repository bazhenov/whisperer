import React from "react";
import Form from "../../components/Form.jsx";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { connectionParams } from '../fixtures'

describe('Form', () => {
	const props = {
		connectionParams: connectionParams,
		isListening: false,
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
		});

		it('severity changed', done => {
			const updateCurrentConnectionParams = (key, value) => {
				expect(key).toBe('severity');
				expect(value).toBe('WARN');
				done();
			};
			const wrapper = mount(
				<Form { ...props } updateCurrentConnectionParams={updateCurrentConnectionParams} />
			);
			wrapper.find('.severity-button').first().simulate('click');
		});
	});
});