#!/usr/bin/env node

import { version } from "./package.json"
import { program } from "commander"

const defaultLang = "en"
global.lang = require("./src/locales").default[defaultLang]
const { shortDescription } = require("./src/methods/aboutMe")

cli()

function cli() {
	program
		.name("native-rover")
		.description(shortDescription)
		.version(version?.toString() || "0.0.0", "-v, --version")
		.option("-l, --language <language>", "Language to use", defaultLang)
		.helpOption("-h, --help", "Show help")

	program
		.command("about-me")
		.description("Meet ReactRover.")
		.option("-l, --language <language>", "Language to use", defaultLang)
		.action(str => {
			console.log(str)
			global.lang = require("./src/locales").default[str.language]
			const { description } = require("./src/methods/aboutMe")
			console.log(description)
		})

	program
		.command("interactive")
		.description("Meet ReactRover and use the interactive mode.")
		.option("-l, --language <language>", "Language to use", defaultLang)
		.action(str => {
			global.lang = require("./src/locales").default[str.language]
			const interactive = require("./src/methods/interactive").default
			interactive()
		})

	program.parse(process.argv)
}

// const { language }: IArgvs = options as any
// const command = options._[0]

// if (command == "about-me") {
// 	const aboutMe = require("./reactRover")
// 	aboutMe(language)
// }

// if (command == "interactive") {
// 	const aboutMe = require("./src/interactive").default
// 	aboutMe(language)
// }
