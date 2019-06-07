import NextHead from 'next/head';
import React from 'react';
import '../styles/Global.scss';

const defaultDescription = '';

interface IProps {
	title?: string;
	description?: string;
	defaultDescription?: string;
	url?: string;
}

const Head = (props: IProps) => (
	<NextHead>
		<meta charSet='UTF-8' />
		<title>{props.title || ''}</title>
		<meta
			name='description'
			content={props.description || defaultDescription}
		/>
		<meta name='viewport' content='width=device-width, initial-scale=1' />
		<link rel='icon' sizes='192x192' href='/static/touch-icon.png' />
		<link rel='apple-touch-icon' href='/static/touch-icon.png' />
		<link rel='mask-icon' href='/static/favicon-mask.svg' color='#49B882' />
		<link rel='icon' href='/static/favicon.ico' />
	</NextHead>
);

export default Head;
