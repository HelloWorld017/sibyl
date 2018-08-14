import TimerMeal from "./TimerMeal";

export default bot => [
	TimerMeal
].map(TimerClass => new TimerClass(bot));
