import TimerMeal from "./TimerMeal.mjs";

export default bot => [
	TimerMeal
].map(TimerClass => new TimerClass(bot));
