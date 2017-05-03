import React from "react";
import ToManyMessagesAlert from "../../components/ToManyMessagesAlert.jsx";
import renderer from "react-test-renderer";
import { MAX_MESSAGES_TO_DISPLAY } from '../../constants'

it('ToManyMessagesAlert', () => {
	let tree = renderer.create(
		<ToManyMessagesAlert filteredCount={0}/>
	).toJSON();
	expect(tree).toMatchSnapshot();

	tree = renderer.create(
		<ToManyMessagesAlert filteredCount={MAX_MESSAGES_TO_DISPLAY}/>
	).toJSON();
	expect(tree).toMatchSnapshot();
});