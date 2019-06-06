import Type from "./Type.mjs";

class TypeString extends Type {
	constructor(typeId, typeName) {
		super(typeId, typeName);
	}

	parse(types, text) {
		const result = {};
		result[this.id] = text;

		return result;
	}
}

export default TypeString;
