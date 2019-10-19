import TypeCondition from "./TypeCondition.mjs";
import TypeEnum from "./TypeEnum.mjs";
import TypePenalty from "./TypePenalty.mjs";
import TypeString from "./TypeString.mjs";
import TypeUInteger from "./TypeUInteger.mjs";

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
	Query: new TypeString('Query', '검색할 내용'),
	Location: new TypeString('Location', '시도명'),
	School: new TypeString('School', '학교명'),
	SchoolId: new TypeString('SchoolId', '학교ID'),
	Content: new TypeString('Content', '내용'),
	People: new TypeUInteger('People', '최대인원'),
	Multivote: new TypeUInteger('Multivote', '최대동시투표'),
	OptionId: new TypeUInteger('OptionId', '간단투표옵션ID'),
	SimvoteId: new TypeString('SimvoteId', '간단투표ID'),
	Anonymous: new TypeEnum('Anonymous', '익명성', ['공개', '익명'])
};
