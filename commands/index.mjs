import CommandCreateRule from "./CommandCreateRule";
import CommandDeleteRule from "./CommandDeleteRule";
import CommandGetRule from "./CommandGetRule";
//import CommandGetVotes from "./CommandGetVotes";
import CommandHelp from "./CommandHelp";
//import CommandInfo from "./CommandInfo";
import CommandQueryVote from "./CommandQueryVote";
//import CommandUsers from "./CommandUsers";

export default bot => [
	CommandCreateRule,
	CommandDeleteRule,
	CommandGetRule,
	CommandHelp,
	CommandQueryVote
].map(ClassVariable => new ClassVariable(bot));
