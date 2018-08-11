import TypeCondition from "./TypeCondition";
import TypeEnum from "./TypeEnum";
import TypePenalty from "./TypePenalty";
import TypeString from "./TypeString";
import TypeUInteger from "./TypeUInteger";

export default {
	Condition: new TypeCondition,
	Penalty: new TypePenalty,
	Coefficient: new TypeUInteger('Coefficient', '범죄계수'),
	MessageType: new TypeEnum('MessageType', '타입', ['스티커', '스티커팩', '문자열']),
	Description: new TypeString('Description', '세부사항'),
	Action: new TypeEnum('Action', '처분', ['삭제', '없음']),
	RuleId: new TypeUInteger('RuleId', '규칙ID'),
	VoteId: new TypeUInteger('VoteId', '투표ID'),
	VoteResult: new TypeEnum('VoteResult', '투표선택', ['true', 'false']),
	CommandName: new TypeString('CommandName', '명령어'),
	Query: new TypeString('Query', '검색할 내용')
};
