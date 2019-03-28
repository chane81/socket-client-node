import 'jest-dom/extend-expect';
import * as React from 'react';
import { mount } from 'enzyme';
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
		const wrapper = mount(<ChatPiece messageModel={messageModel} />);

		expect(wrapper.find('.chat-nick').text()).toContain(
			messageModel.user.nickName
		);
	});

	it('ChatPiece - Message 표현과, 줄바꿈 replace ', () => {
		const wrapper = mount(<ChatPiece messageModel={messageModel} />);

		const msgContent = wrapper.find('[data-testid="t-msg"]').html();

		const expectText = messageModel.message.replace(/(?:\r\n|\r|\n)/g, '<br>');

		expect(msgContent).toContain(expectText);
	});

	it('ChatPiece - 내가보내는 메시지일 경우 className 다이나믹변경', () => {
		// true 일 경우
		const wrapper = mount(<ChatPiece messageModel={messageModel} />);

		const rootDiv = wrapper.find('.root-chat-piece');

		expect(rootDiv.hasClass('chat-right')).toBe(true);
	});

	it('ChatPiece - 내가 받는 메시지일 경우 className 다이나믹변경', () => {
		// false 일 경우
		const falseMessageModel: IMessageModelType = messageStore.model.create(
			messageValues(false)
		);

		const wrapper = mount(<ChatPiece messageModel={falseMessageModel} />);

		const rootDiv = wrapper.find('.root-chat-piece');

		expect(rootDiv.hasClass('chat-left')).toBe(true);
	});
});
