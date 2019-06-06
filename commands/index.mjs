import CommandCreateRule from "./CommandCreateRule.mjs";
import CommandDeleteRule from "./CommandDeleteRule.mjs";
import CommandGather from "./CommandGather.mjs";
import CommandGetRule from "./CommandGetRule.mjs";
import CommandGetVotes from "./CommandGetVotes.mjs";
import CommandGoogle from "./CommandGoogle.mjs";
import CommandGoogleImage from "./CommandGoogleImage.mjs";
import CommandHelp from "./CommandHelp.mjs";
import CommandInfo from "./CommandInfo.mjs";
import CommandQueryGather from "./CommandQueryGather.mjs";
import CommandQueryMoveVote from "./CommandQueryMoveVote.mjs";
import CommandQueryVote from "./CommandQueryVote.mjs";
import CommandUser from "./CommandUser.mjs";

export default bot => [
	CommandCreateRule,
	CommandDeleteRule,
	CommandGather,
	CommandGetRule,
	CommandGetVotes,
	CommandGoogle,
	CommandGoogleImage,
	CommandHelp,
	CommandInfo,
	CommandQueryGather,
	CommandQueryMoveVote,
	CommandQueryVote,
	CommandUser
].map(ClassVariable => new ClassVariable(bot));
