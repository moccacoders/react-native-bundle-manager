import { clear } from "console"
import * as prompt from "@inquirer/prompts"

import { reactRoverMessage } from "../assets/reactRover"
import { IPromptOptions, IQuestionOptions, TNexQuestion } from "../locales/interfaces"
import { exit } from "../methods/interactive"
import { boolean } from "yargs"

export const question = (
	text: string,
	next?: TNexQuestion | boolean,
	options?: IQuestionOptions
) => {
	clear()
	reactRoverMessage(text)
	if (next === false) return
	if (next && typeof next !== "boolean") return nextQuestion(next, options)
	else return nextQuestion(exit, options)
}

export const nextQuestion = (nextQuestion: TNexQuestion, options?: IQuestionOptions) => {
	const promptOptions = {
		type: options?.promptOptions?.type ?? "confirm",
		message:
			options?.promptOptions?.message ??
			options?.nextMessage ??
			global.lang.generals.continue_question,
		choices: options?.promptOptions?.choices ?? undefined,
	}

	return prompt[promptOptions.type](promptOptions as any)
		.then(response => {
			if (!options?.skipClose && !response) exit()
			nextQuestion(response)
			return response
		})
		.catch((err: any) => {
			if (err.message.search("force closed") >= 0) return exit()
			console.log(err.message)
		})
}
