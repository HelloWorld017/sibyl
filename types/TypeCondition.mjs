import Type from "./Type.mjs";

class TypeCondition extends Type {
	constructor() {
		super('Condition', '조건');
	}

	parse(types, text) {
		const {MessageType, Description} = types;

		const split = text.split(':');
		if(split.length !== 2)
			throw new Error("조건은 다음과 같은 형식이어야 합니다:\n<code>타입:세부사항</code>");

		return {
			Condition: {
				MessageType: MessageType.parse(types, split[0]).MessageType,
				Description: Description.parse(types, split[1]).Description
			}
		};
	}

	getInformation() {
		return '타입:세부사항';
	}
}

export default TypeCondition;
