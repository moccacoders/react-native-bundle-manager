import { ILang, TLocales } from "../locales/interfaces"

export interface IArgvs {
	number: number
	year: number
	description: boolean
	language: TLocales
}

declare global {
	var lang: ILang
}
