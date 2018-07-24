import Type from "./Type";

class TypeUInteger extends Type {
	constructor(typeId, typeName) {
		super(typeId, typeName);
	}

	parse(types, text) {
		const result = {};
		const parsed = parseInt(text);

		if(!isFinite(parsed))
			throw new Error(`${this.name}은 숫자로 주어져야 합니다.`);

		if(parsed < 0)
			throw new Error(`${this.name}은 0 또는 양수여야 합니다.`);

		result[this.id] = parsed;
		return result;
	}
}

export default TypeUInteger;
