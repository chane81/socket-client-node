import { Provider } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import { NextComponentType } from 'next';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { object } from 'prop-types';
import React from 'react';
import { initializeStore, IStore } from '../stores/store';

interface IProps {
	isServer: boolean;
	initialState: IStore;
	Component: NextComponentType;
	pageProps: any;
	router: any;
}

export default class MyApp extends App<IProps> {
	// IE10 대응
	public static childContextTypes = {
		router: object
	};

	public static async getInitialProps({ Component, router, ctx }) {
		let pageProps = {};
		const isServer = typeof window === 'undefined';
		const store = initializeStore(isServer);

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return {
			initialState: getSnapshot(store),
			isServer,
			pageProps
		};
	}
	private store: IStore;

	constructor(props) {
		super(props);
		this.store = initializeStore(props.isServer, props.initialState);
	}

	// IE10 대응
	public getChildContext() {
		const { router } = this.props;
		return { router };
	}

	public render() {
		const { Component, pageProps } = this.props;

		return (
			<Provider store={this.store}>
				<Container>
					<Head>
						<title />
					</Head>
					<Component {...pageProps} />
				</Container>
			</Provider>
		);
	}
}
