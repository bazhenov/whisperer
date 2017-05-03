import React from "react";
import SeverityFilter from "../../components/SeverityFilter.jsx";
import renderer from "react-test-renderer";
import {mount} from "enzyme";

describe('SeverityFilter', () => {
	const props = {
		currentSeverity: "INFO",
		updateSeverity: () => {},
		disabled: false
	};

	it('rendering', () => {
		let tree = renderer.create(
			<SeverityFilter { ...props } />
		).toJSON();
		expect(tree).toMatchSnapshot();

		tree = renderer.create(
			<SeverityFilter { ...props } disabled={true} />
		).toJSON();
		expect(tree).toMatchSnapshot()
	});

	it('click handler', done => {
		const chooseSeverity = (severity) => {
			expect(severity).toBe('WARN');
			done();
		};
		const enzymeWrapper = mount(
			<SeverityFilter { ...props } updateSeverity={chooseSeverity} />
		);
		enzymeWrapper.find('.severity-button').first().simulate('click');
	});
});