import React from "react";
import Controls from "../../components/Controls.jsx";
import renderer from "react-test-renderer";
import {mount} from "enzyme";

describe('Controls', () => {
	it('rendering', () => {
		[
			{ isListening: false, hasMessages: false },
			{ isListening: true, hasMessages: false },
			{ isListening: false, hasMessages: true },
			{ isListening: true, hasMessages: true }
		].forEach(props => {
			const tree = renderer.create(
				<Controls { ...props } startListening={() => {}} stopListening={() => {}} clearMessages={() => {}} />
			).toJSON();
			expect(tree).toMatchSnapshot();
		});
	});

	describe('click handlers', () => {
		const props = {
			isListening: false,
			hasMessages: false,
			startListening: () => {},
			stopListening: () => {},
			clearMessages: () => {}
		};

		const simulateClick = (buttonText, props) => {
			mount(
				<Controls { ...props } />
			).find('a').filterWhere(link => link.text() === buttonText).first().simulate('click');
		};

		it('startListening', done => {
			simulateClick('LISTEN', { ...props, startListening: () => done() });
		});

		it('stopListening', done => {
			simulateClick('STOP', { ...props, isListening: true, stopListening: () => done() });
		});

		it('stopListening', done => {
			simulateClick('CLEAR', { ...props, hasMessages: true, clearMessages: () => done() });
		});
	});
});