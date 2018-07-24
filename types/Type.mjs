class Type {
	constructor(typeId, typeName) {
		this.id = typeId;
		this.name = typeName;
	}

	parse(types, text) {

	}

	getInformation() {
		return this.typeName;
	}
}

export default Type;
