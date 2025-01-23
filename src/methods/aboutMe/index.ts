import { question } from "../../../src/utils"
import mainInteractive from "../interactive"

export const shortDescription = global.lang.generals.short_description
export const description = global.lang.generals.description

export const interactive = () => {
	question(global.lang.about_me.who_am_i, whatCanIDo)
}

const whatCanIDo = () => {
	question(global.lang.about_me.what_can_i_do, task01)
}

const task01 = () => {
	question(global.lang.about_me.task01, task02)
}

const task02 = () => {
	question(global.lang.about_me.task02, task03)
}

const task03 = () => {
	question(global.lang.about_me.task03, task04)
}

const task04 = () => {
	question(global.lang.about_me.task04, task05)
}

const task05 = () => {
	question(global.lang.about_me.task05, canIdDoSomething)
}

const canIdDoSomething = () => {
	question(global.lang.about_me.can_i_do_something, () => mainInteractive())
}
