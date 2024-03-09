#!/usr/bin/env node

import { program } from "commander"
import { IArgvs } from "./src/@types/global"

const defaultLang = "es"

program
	.name("react-native-bundle-manager")
	.description("A CLI tool to manage React Native bundles")
	.version(process.env.npm_package_version?.toString() || "0.0.0", "-v, --version")
	.option("-l, --language <language>", "Language to use", defaultLang)
	.parse(process.argv)

program
	.command("interactive")
	.description("Meet ReactRover and use the interactive mode.")
	.option("-l, --language [en,es]", "Language to use", defaultLang)
	.action(str => {
		global.lang = require("./src/locales").default[str.language]
		const interactive = require("./src/methods/interactive").default
		interactive()
	})
	.parse(process.argv)

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
