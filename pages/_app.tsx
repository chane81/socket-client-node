import makeInspectable from 'mobx-devtools-mst';
import { Provider } from 'mobx-react';
import { getSnapshot, onPatch } from 'mobx-state-tree';
import { NextComponentType } from 'next';
import App, { Container } from 'next/app';
import { object } from 'prop-types';
import React from 'react';
import Head from '../components/Head';
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

		// mst 디버깅 로그
		if (process.env.NODE_ENV === 'development') {
			// 크롬 console 에 해당값의 변화가 있을 때 나타나게 함
			onPatch(this.store, (patch) => {
				console.log(patch);
			});

			// 크롬 mobx tools 에 MST 로 상태변화를 볼 수 있게 한다.
			makeInspectable(this.store);
		}
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
					<Head title='My Chat App' />
					<Component {...pageProps} />
				</Container>
			</Provider>
		);
	}
}
