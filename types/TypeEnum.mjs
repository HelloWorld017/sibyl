import Type from "./Type";

class TypeEnum extends Type {
	constructor(typeId, typeName, enumList) {
		super(typeId, typeName);

		this.enumList = enumList;
	}

	parse(types, text) {
		if(!this.enumList.includes(text))
			throw new Error(`${this.name}은 다음 중 하나여야 합니다:\n${this.enumList.join(', ')}`);

		const result = {};
		result[this.id] = text;

		return result;
	}
}

export default TypeEnum;
