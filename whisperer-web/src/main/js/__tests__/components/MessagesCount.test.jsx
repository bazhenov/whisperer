import React from "react";
import MessagesCount from "../../components/MessagesCount.jsx";
import renderer from "react-test-renderer";

it('MessagesCount', () => {
	let tree = renderer.create(
		<MessagesCount filteredCount={0} totalCount={0} />
	).toJSON();
	expect(tree).toMatchSnapshot();

	tree = renderer.create(
		<MessagesCount filteredCount={10} totalCount={10} />
	).toJSON();
	expect(tree).toMatchSnapshot();

	tree = renderer.create(
		<MessagesCount filteredCount={5} totalCount={10} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});