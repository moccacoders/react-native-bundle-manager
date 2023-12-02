import chalk from "chalk"
import { ILang } from "./interfaces"

const lang = (): ILang => {
	return {
		name: "en",
		generals: {
			continue_question: "Do you want to continue?",
		},
		react_rover: {
			hello: `${chalk.bold("Hello pal")}, I'm ${chalk
				.hex("#0de2ea")
				.bold("ReactRover")} and I'm here to help you! Let's get started!`,
			bye: `${chalk.bold("Bye bye pal")}, See you soon!`,
		},
		whatToDo: {
			title: "What do you want to do?",
			aboutMe: "About me",
			bundleNumbers: "Bundle numbers",
			versionName: "Version name (X.Y.Z)",
			applicationId: "Application ID",
			releases: "Automated releases",
			recordChanges: "Record changes",
			exit: "Exit",
		},
		about_me: {
			who_am_i:
				"I'm your witty interactive assistant in the exciting world of React Native. My mission is to simplify the management and updating of your projects, making your life easier at every stage of development.",
			what_can_i_do:
				"I specialize in key tasks that will make your development workflow easier and more efficient. Do you want to know them?",
			task01: `${chalk.bold(
				"Bundle numbers."
			)} Updating the bundle number with me is a smooth process. I can automatically take care of assigning sequential numbers for a flawless version tracking. Or if you prefer, specify the number yourself! The choice is yours, making version management personalized and easy.`,
			task02: `${chalk.bold(
				"Version name."
			)} I make sure to ask the right questions to understand the essence of the update. This not only simplifies the process, but also provides clear control over the changes. Thus, each update accurately reflects the improvements made to your application.`,
			task03: `${chalk.bold(
				"Application ID."
			)} When you work with me, handling your application ID becomes a direct chat. Tell me your ID and if you need to change it for Android, iOS or both! Then, I will take care of making the necessary adjustments in all relevant places. Thus, your application will always be ready to deploy, and best of all, without complications.`,
			task04: `${chalk.bold(
				"Automated Deployments."
			)} Did you know that I can generate commands ready to integrate into your GitHub actions? Yes, that's right. Just tell me your preferences and needs, and I will prepare commands that will allow you to automate your deployments with a click. Thus, your updates will arrive faster and with less effort. Let's make your development experience unstoppable!`,
			task05: `${chalk.bold(
				"Record of Changes."
			)} I want you to know that I keep a meticulous history of every change I make. Whether adjusting the bundle number, modifying the application ID or any other improvement, each step is recorded. Thus, you will always have the certainty and clarity of each version, facilitating your development journey.`,
			can_i_do_something: "Can I do something else for you?",
		},
	}
}

export default lang()
