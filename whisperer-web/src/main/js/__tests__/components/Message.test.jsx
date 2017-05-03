import React from "react";
import Message from "../../components/Message.jsx";
import renderer from "react-test-renderer";
import { message } from '../fixtures'

it('Message', () => {
	expect(renderer.create(
		<Message message={message} />
	).toJSON()).toMatchSnapshot()
});