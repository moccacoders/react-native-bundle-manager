import { type } from "os"

export interface ILocales {
	es: ILang
	en: ILang
}

export type TLocales = keyof ILocales
export type TNexQuestion = (response: any) => void

export interface IQuestionOptions {
	nextMessage?: string
	promptOptions?: IPromptOptions
	skipClose?: boolean
}

export interface IPromptOptions {
	type?: "confirm" | "select" | "input"
	message?: string
	choices?: IChoices[]
	validate?: (value: string) => boolean | string
}

export interface IChoices {
	name: string
	value: string
}

export interface ILang {
	name: TLocales
	react_rover: IReactRover
	whatToDo: IWhatToDo
	about_me: IAboutMe
	generals: IGenerals
}

export interface IGenerals {
	continue_question: string
	description: string
	short_description: string
}

export interface IReactRover {
	hello: string
	bye: string
}

export interface IWhatToDo {
	title: string
	aboutMe: string
	bundleNumbers: string
	versionName: string
	applicationId: string
	releases: string
	recordChanges: string
	exit: string
}

export interface IAboutMe {
	who_am_i: string
	what_can_i_do: string
	task01: string
	task02: string
	task03: string
	task04: string
	task05: string
	can_i_do_something: string
}

export interface IBundleNumbers {
	actual: IPlatforms
	news: IPlatforms
}

export interface IPlatforms {
	android: number
	ios: number
}
