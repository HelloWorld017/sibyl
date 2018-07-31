import CommandCreateRule from "./CommandCreateRule";
import CommandDeleteRule from "./CommandDeleteRule";
import CommandGetRule from "./CommandGetRule";
//import CommandGetVotes from "./CommandGetVotes";
import CommandHelp from "./CommandHelp";
import CommandInfo from "./CommandInfo";
import CommandQueryVote from "./CommandQueryVote";
import CommandUser from "./CommandUser";

export default bot => [
	CommandCreateRule,
	CommandDeleteRule,
	CommandGetRule,
	CommandHelp,
	CommandInfo,
	CommandQueryVote,
	CommandUser
].map(ClassVariable => new ClassVariable(bot));
