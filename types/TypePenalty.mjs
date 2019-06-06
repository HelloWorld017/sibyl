import Type from "./Type.mjs";

class TypePenalty extends Type {
	constructor() {
		super('Penalty', '처벌');
	}

	parse(types, text) {
		const {Coefficient, Action} = types;

		const split = text.split('+');
		if(split.length < 2) throw new Error("처벌은 다음과 같은 형식이어야 합니다:\n<code>범죄계수+처분</code>");

		return {
			Penalty: {
				Coefficient: Coefficient.parse(types, split[0]).Coefficient,
				Action: Action.parse(types, split[1]).Action
			}
		};
	}

	getInformation() {
		return '범죄계수+처분';
	}
}

export default TypePenalty;
