import React from "react";
import {Provider} from "react-redux";
import configureStore from "../configureStore";
import App from "./App.jsx";

const store = configureStore();
const Root = () => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	)
};

export default Root