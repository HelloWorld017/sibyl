import TypeCondition from "./TypeCondition";
import TypeEnum from "./TypeEnum";
import TypePenalty from "./TypePenalty";
import TypeString from "./TypeString";
import TypeUInteger from "./TypeUInteger";

export default {
	Condition: new TypeCondition,
	Penalty: new TypePenalty,
	Coefficient: new TypeUInteger('Coefficient', '범죄계수'),
	MessageType: new TypeEnum('MessageType', '타입', ['스티커', '스티커팩', '문자열']);
	Description: new TypeString('Description', '세부사항'),
	Operation: new TypeEnum('Operation', '처분', ['삭제', '없음'])
};
