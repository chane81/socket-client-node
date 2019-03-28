/* test helper */

const find = (ele: HTMLElement, query: string) =>
	ele.querySelector(query) as HTMLElement;

export default find;
