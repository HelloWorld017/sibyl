class Type {
	constructor(typeId, typeName) {
		this.id = typeId;
		this.name = typeName;
	}

	parse(types, text) {

	}

	getInformation() {
		return this.name;
	}
}

export default Type;
