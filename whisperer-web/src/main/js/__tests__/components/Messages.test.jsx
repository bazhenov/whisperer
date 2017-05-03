import React from "react";
import Messages from "../../components/Messages.jsx";
import renderer from "react-test-renderer";
import { message, message2 } from '../fixtures'

it('Message', () => {
	expect(renderer.create(
		<Messages messages={[message, message2]} />
	).toJSON()).toMatchSnapshot()
});