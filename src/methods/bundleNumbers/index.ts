import spinner from "cli-spinner"
import fs from "fs/promises"

import { question } from "../../../src/utils"
import { IBundleNumbers } from "../../locales/interfaces"
import mainInteractive from "../interactive"

const paths = {
	android: `${process.cwd()}/android/app/build.gradle`,
	ios: ``,
}

const bundleNumbers: IBundleNumbers = {
	actual: {
		android: 1,
		ios: 1,
	},
	news: {
		android: 0,
		ios: 0,
	},
}

const spin = new spinner.Spinner("Buscando...")
spin.setSpinnerString(18)

export const interactive = () => {
	// ASK FOR ACTIONS TO DO. UPDATE BUNDLE NUMBERS OR REVERSE NUMBERS
	question("Hola amigo, Como te puedo apoyar hoy?", () => {}, {
		promptOptions: {
			type: "select",
			message: "¿Qué quieres hacer?",
			choices: [
				{ name: "Actualizar bundle numbers", value: "updateBundleNumbers" },
				{ name: "Revertir bundle numbers", value: "revertBundleNumbers" },
			],
		},
		skipClose: true,
	})?.then(response => {
		console.log(response)
		if (response === "updateBundleNumbers") return wantToUpdateBundleNumbers()
		if (response === "revertBundleNumbers") return wantToRevertBundleNumbers()
	})
}

const wantToUpdateBundleNumbers = async () => {
	question(
		"Con gusto te apoyo a actualizar tus bundle numbers. Quieres actualizar los bundle numbers de iOS o Android?",
		findiOSFolder,
		{
			promptOptions: {
				type: "select",
				message: "¿Qué quieres hacer?",
				choices: [
					{ name: "Actualizar ambos", value: "both" },
					{ name: "Actualizar Android", value: "android" },
					{ name: "Actualizar iOS", value: "ios" },
				],
			},
		}
	)
}

const findiOSFolder = async (platform: boolean, revert?: boolean) => {
	spin.start()

	// GET ALL FOLDERS FROM IOS FOLDER IN ROOT PROJECT
	const folder = (await fs.readdir(`${process.cwd()}/ios`, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.filter(dir => new RegExp(".xcodeproj").test(dir.name))
		.map(dir => dir.name)[0]

	spin.stop(true)
	if (folder) {
		paths.ios = `${process.cwd()}/ios/${folder}/project.pbxproj`
		findBundleNumbers(platform, revert)
	}
}

const findBundleNumbers = async (platform: string | boolean, revert?: boolean) => {
	// GET BUNDLE NUMBERS FROM ANDROID
	const android = await fs.readFile(paths.android, "utf-8")
	const androidBundleNumber = android.match(/versionCode\s(\d+)/)?.[1]

	// GET BUNDLE NUMBERS FROM IOS
	const ios = await fs.readFile(paths.ios, "utf-8")
	const iosBundleNumber = ios.match(/CURRENT_PROJECT_VERSION\s=\s(\d+)/)?.[1]

	bundleNumbers.actual.android = Number(androidBundleNumber)
	bundleNumbers.actual.ios = Number(iosBundleNumber)

	if (revert) getLastBundleNumbers()

	let message = ""
	if (platform === "both")
		message = `Android: ${bundleNumbers.actual.android} - iOS: ${bundleNumbers.actual.ios}`
	if (platform === "android") message = `Android: ${bundleNumbers.actual.android}`
	if (platform === "ios") message = `iOS: ${bundleNumbers.actual.ios}`

	question(
		`Listo! He encontrado los bundles numbers actuales de tu proyecto. ${message}. ¿Quieres que los actualice automaticamente?`,
		res => autoUpdateBundleNumbers(res, platform as string),
		{ nextMessage: "¿Quieres que los actualice automaticamente?", skipClose: true }
	)
}

const autoUpdateBundleNumbers = async (response: boolean, platform: string) => {
	if (response === false) {
		if (platform === "both" || platform === "android") return giveMeAndroidBundleNumber(platform)
		else if (platform === "ios") return giveMeiOSBundleNumber(platform)
	}

	if (platform === "both" || platform == "android")
		bundleNumbers.news.android = bundleNumbers.actual.android + 1
	if (platform === "both" || platform == "ios")
		bundleNumbers.news.ios = bundleNumbers.actual.ios + 1

	return validateBundleNumbers(platform)
}

const giveMeAndroidBundleNumber = async (platform: string) => {
	question(
		"No te preocupes. Dime cual es el bundle number que quieres asignar a android.",
		() => {
			if (platform === "both") giveMeiOSBundleNumber(platform)
			else validateBundleNumbers(platform)
		},
		{
			promptOptions: {
				type: "input",
				message: "¿Cuál es el bundle number de Android?",
				validate: (value: string) => {
					if (isNaN(Number(value))) return "El bundle number debe ser un número"
					return true
				},
			},
		}
	)?.then(bundle => {
		bundleNumbers.news.android = Number(bundle)
	})
}

const giveMeiOSBundleNumber = async (platform: string) => {
	question(
		"Ahora dime cual es el bundle number que quieres asignar a iOS.",
		() => validateBundleNumbers(platform),
		{
			promptOptions: {
				type: "input",
				message: "¿Cuál es el bundle number de iOS?",
				validate: (value: string) => {
					if (isNaN(Number(value))) return "El bundle number debe ser un número"
					return true
				},
			},
		}
	)?.then(bundle => {
		bundleNumbers.news.ios = Number(bundle)
	})
}

const validateBundleNumbers = async (platform: string) => {
	setTimeout(() => {
		let message = ""
		if (platform === "both")
			message = `Android: ${bundleNumbers.news.android} - iOS: ${bundleNumbers.news.ios}`
		if (platform === "android") message = `Android: ${bundleNumbers.news.android}`
		if (platform === "ios") message = `iOS: ${bundleNumbers.news.ios}`

		question(
			`Listo! Estos son los bundle numbers que voy a actualizar. ${message}. Estas de acuerdo?`,
			response => updateBundleNumbers(response, platform, false),
			{ nextMessage: "Estas de acuerdo?", skipClose: true }
		)
	}, 10)
}

const updateBundleNumbers = async (response: boolean, platform: string, revert?: boolean) => {
	if (response === false) {
		if (platform === "both" || platform === "android") return giveMeAndroidBundleNumber(platform)
		else if (platform === "ios") return giveMeiOSBundleNumber(platform)
	}
	question(`Un momento por favor. Estoy actualizando los bundle numbers de tu proyecto.`, false)

	// UPDATE ANDROID BUNDLE NUMBER
	if (platform === "both" || platform === "android") {
		const android = await fs.readFile(paths.android, "utf-8")
		const androidBundleNumber = android.replaceAll(
			/versionCode\s(\d+)/g,
			`versionCode ${bundleNumbers.news.android}`
		)
		await fs.writeFile(paths.android, androidBundleNumber)
	}

	// UPDATE IOS BUNDLE NUMBER
	if (platform === "both" || platform === "ios") {
		const ios = await fs.readFile(paths.ios, "utf-8")
		const iosBundleNumber = ios.replaceAll(
			/CURRENT_PROJECT_VERSION\s=\s(\d+)/g,
			`CURRENT_PROJECT_VERSION = ${bundleNumbers.news.ios}`
		)
		await fs.writeFile(paths.ios, iosBundleNumber)
	}

	spin.setSpinnerTitle("Actualizando...")
	spin.start()

	setTimeout(() => {
		spin.stop(true)
		if (revert) saveLogRevert(platform)
		else saveLog(platform)
	}, 1000)
}

const saveLog = async (platform: string) => {
	question(`Un momento por favor. Estoy actualizando los bundle numbers de tu proyecto.`, false)

	// SAVE LOG
	const log = await fs.readFile(`${process.cwd()}/react-rover.log`, "utf-8").catch(() => "")

	let platformLog = ""
	if (platform === "both")
		platformLog = `Android: ${bundleNumbers.news.android} - iOS: ${bundleNumbers.news.ios}`
	if (platform === "android") platformLog = `Android: ${bundleNumbers.news.android}`
	if (platform === "ios") platformLog = `iOS: ${bundleNumbers.news.ios}`

	const newLog =
		log +
		`${new Date().toLocaleString()} - [UPDATE - BUNDLE NUMBERS] Bundle numbers updated: ${platformLog}\n`
	await fs.writeFile(`${process.cwd()}/react-rover.log`, newLog)

	spin.setSpinnerTitle("Guardando registros...")
	spin.start()

	setTimeout(() => {
		spin.stop(true)
		updatedBundleNumbers(true, platform)
	}, 1000)
}

const saveLogRevert = async (platform: string) => {
	question(`Un momento por favor. Estoy actualizando los bundle numbers de tu proyecto.`, false)

	// SAVE LOG
	const log = await fs.readFile(`${process.cwd()}/react-rover.log`, "utf-8").catch(() => "")
	const newLog =
		log +
		`${new Date().toLocaleString()} - [REVERT - BUNDLE NUMBERS] Bundle numbers reverted: Android: ${
			bundleNumbers.news.android
		} - iOS: ${bundleNumbers.news.ios}\n`
	await fs.writeFile(`${process.cwd()}/react-rover.log`, newLog)

	spin.setSpinnerTitle("Guardando registros...")
	spin.start()

	setTimeout(() => {
		spin.stop(true)
		updatedBundleNumbers(false, platform)
	}, 1000)
}

const updatedBundleNumbers = async (response: boolean, platform: string) => {
	if (response === false) return giveMeAndroidBundleNumber(platform)

	let message = ""
	if (platform === "both")
		message = `Android: ${bundleNumbers.news.android} - iOS: ${bundleNumbers.news.ios}`
	if (platform === "android") message = `Android: ${bundleNumbers.news.android}`
	if (platform === "ios") message = `iOS: ${bundleNumbers.news.ios}`

	question(
		`Listo! He actualizado los bundle numbers de tu proyecto. ${message}. Te puedo apoyar en algo más?`,
		mainInteractive,
		{ nextMessage: "Te puedo apoyar en algo más?" }
	)
}

const wantToRevertBundleNumbers = async () => {
	question(
		"Con gusto te apoyo a revertir tus bundle numbers. Lo primero que tengo que hacer es validar la carpeta de tu proyecto de iOS. Me das permiso de continuar?",
		response => findiOSFolder(response)
	)
}

const getLastBundleNumbers = async () => {
	// GET LAST BUNDLE NUMBERS FROM LOG
	const log = await fs.readFile(`${process.cwd()}/react-rover.log`, "utf-8").catch(() => "")
	const lastLog = log
		.split("\n")
		.filter(log => log.includes("[UPDATE - BUNDLE NUMBERS]"))
		.reverse()[0]
	const lastBundleNumbers = lastLog?.match(/Android:\s(\d+)\s-\siOS:\s(\d+)/)?.slice(1)

	if (lastBundleNumbers) {
		bundleNumbers.news.android = Number(lastBundleNumbers[0])
		bundleNumbers.news.ios = Number(lastBundleNumbers[1])
	}

	question(
		`Listo! He encontrado los bundles numbers anteriores de tu proyecto. Android: ${bundleNumbers.news.android} - iOS: ${bundleNumbers.news.ios}. ¿Estas de acuerdo con revertir los cambios?`,
		response => updateBundleNumbers(response, "", true),
		{ nextMessage: "¿Estas de acuerdo con revertir los cambios?", skipClose: true }
	)
}
