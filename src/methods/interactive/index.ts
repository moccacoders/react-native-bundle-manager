import { select } from "@inquirer/prompts"

import locales from "../../locales"
import { sayBye, sayHello } from "../../assets/reactRover"
import { TLocales } from "../../locales/interfaces"
import { clear } from "console"

const interactive = () => {
	sayHello()

	select({
		message: lang.whatToDo.title,
		choices: [
			{ name: lang.whatToDo.aboutMe, value: "aboutMe" },
			{ name: lang.whatToDo.bundleNumbers, value: "bundleNumbers" },
			{ name: lang.whatToDo.versionName, value: "versionName" },
			{ name: lang.whatToDo.applicationId, value: "applicationId" },
			{ name: lang.whatToDo.releases, value: "releases" },
			{ name: lang.whatToDo.recordChanges, value: "recordChanges" },
			{ name: lang.whatToDo.exit, value: "exit" },
		],
	})
		.then(choice => {
			if (choice === "exit") exit()
			try {
				const command = require(`../${choice}`).interactive
				command()
			} catch (err: any) {
				console.log(err)
				process.exit(1)
			}
		})
		.catch((error: any) => {
			if (error.message.search("force closed") >= 0) return exit()
			console.error(error.message)
		})
}

export const exit = () => {
	clear()
	sayBye()
	process.exit(0)
}

export default interactive
