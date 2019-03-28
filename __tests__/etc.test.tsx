import 'jest-dom/extend-expect';
import * as React from 'react';
import 'react-testing-library/cleanup-after-each';
import { render } from 'react-testing-library';
import find from '../library/testHelper';

describe('- 실험용', () => {
	it('mock return undefined', () => {
		const mock = jest.fn();

		let result = mock('foo');

		expect(result).toBeUndefined();
		expect(mock).toHaveBeenCalled();
		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock).toHaveBeenCalledWith('foo');
	});

	it('mock 구현', () => {
		const mock = jest.fn().mockImplementation(() => 'bar');

		expect(mock('foo')).toBe('bar');
		expect(mock).toHaveBeenCalledWith('foo');
	});

	it('mock 구현 one time', () => {
		const mock = jest.fn().mockImplementationOnce(() => 'bar');

		// 아래 foo 에 대해서 한번만 bar 가 된다.
		// 위애서 Once 로 호출했기 때문에
		expect(mock('foo')).toBe('bar');
		expect(mock).toHaveBeenCalledWith('foo');

		// 여긴 undefined 됨
		expect(mock('baz')).toBe(undefined);
		expect(mock).toHaveBeenCalledWith('baz');
	});

	it('mock 반환값', () => {
		const mock = jest.fn();
		mock.mockReturnValue('bar');

		expect(mock('foo')).toBe('bar');
		expect(mock).toHaveBeenCalledWith('foo');
	});

	it('mock promise resolution', () => {
		const mock = jest.fn();
		mock.mockResolvedValue('bar');

		expect(mock('foo')).resolves.toBe('bar');
		expect(mock).toHaveBeenCalledWith('foo');
	});

	const doAdd = (a, b, callback) => {
		callback(a + b);
	};

	it('mock dependency injection', () => {
		const mockCallback = jest.fn();
		doAdd(1, 2, mockCallback);
		expect(mockCallback).toHaveBeenCalledWith(3);
	});
});
