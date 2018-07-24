import Type from "./Type";

class TypePenalty extends Type {
	constructor() {
		super('Penalty', '처벌');
	}

	parse(types, text) {
		const {Coefficient, Action} = types;

		const split = text.split('+');
		if(split.length < 2) throw new Error("처벌은 다음과 같은 형식이어야 합니다:<br><code>범죄계수+처분</code>");

		return {
			Coefficient: Coefficient.parse(split[0]),
			Action: Action.parse(split[1])
		};
	}

	getInformation() {
		return '범죄계수+처분';
	}
}

export default TypePenalty;
