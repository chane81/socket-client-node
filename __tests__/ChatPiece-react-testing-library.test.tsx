import 'jest-dom/extend-expect';
import * as React from 'react';
import 'react-testing-library/cleanup-after-each';
import { render } from 'react-testing-library';
import find from '../library/testHelper';
import ChatPiece from '../components/ChatPiece';
import messageStore, { IMessageModelType } from '../stores/messageStore';

const messageValues = (isSelf: boolean = true) => ({
	isSelf: isSelf,
	isRead: true,
	msgToUniqueId: '0a0a0a',
	message: 'test\r\n테스트',
	user: {
		isRead: true,
		nickId: '32',
		nickName: 'cloud',
		uniqueId: '9eeee',
		unreadCount: 0
	}
});

const messageModel: IMessageModelType = messageStore.model.create(
	messageValues(true)
);

describe('- Component', () => {
	it('ChatPiece - 닉네임 표현', () => {
		const { container, getByTestId } = render(
			<ChatPiece messageModel={messageModel} />
		);

		// find
		// 방법1: 엘리먼트 find
		const findValue = find(container, '.chat-nick').textContent;

		// 방법2: 엘리먼트 find
		//const findValue = (container.querySelector('.chat-nick') as HTMLElement).textContent

		// 방법3: 엘리먼트 find
		//const findValue = getByTestId('t-nick-name').textContent

		// snapshot
		expect(findValue).toMatchSnapshot();

		// expect
		expect(findValue).toContain(messageModel.user.nickName);
	});

	it('ChatPiece - Message 표현과, 줄바꿈 replace ', () => {
		const { getByTestId } = render(<ChatPiece messageModel={messageModel} />);

		// find
		const findValue = getByTestId('t-msg').outerHTML;

		// snapshot
		expect(findValue).toMatchSnapshot();

		// expect
		const expectText = messageModel.message.replace(/(?:\r\n|\r|\n)/g, '<br>');
		expect(findValue).toContain(expectText);
	});

	it('ChatPiece - 내가보내는 메시지일 경우 className 다이나믹변경', () => {
		// true 일 경우
		const { getByTestId } = render(<ChatPiece messageModel={messageModel} />);

		// find
		const findValue = getByTestId('t-root-class');

		// snapshot
		expect(findValue.outerHTML).toMatchSnapshot();

		// expect
		expect(findValue).toHaveClass('chat-right');
	});

	it('ChatPiece - 내가 받는 메시지일 경우 className 다이나믹변경', () => {
		// false 일 경우
		const falseMessageModel: IMessageModelType = messageStore.model.create(
			messageValues(false)
		);
		const { getByTestId } = render(
			<ChatPiece messageModel={falseMessageModel} />
		);

		// find
		const findValue = getByTestId('t-root-class');

		// snapshot
		expect(findValue.outerHTML).toMatchSnapshot();

		// expect
		expect(findValue).toHaveClass('chat-left');
	});
});
