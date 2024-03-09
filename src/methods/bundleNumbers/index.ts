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
				message: "Quieres actualizar los bundle numbers de iOS o Android?",
				choices: [
					{ name: "Actualizar ambos", value: "both" },
					{ name: "Actualizar Android", value: "android" },
					{ name: "Actualizar iOS", value: "ios" },
				],
			},
		}
	)
}

const findiOSFolder = async (platform: string, revert?: boolean) => {
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

const findBundleNumbers = async (platform: string, revert?: boolean) => {
	// GET BUNDLE NUMBERS FROM ANDROID
	const android = await fs.readFile(paths.android, "utf-8")
	const androidBundleNumber = android.match(/versionCode\s(\d+)/)?.[1]

	// GET BUNDLE NUMBERS FROM IOS
	const ios = await fs.readFile(paths.ios, "utf-8")
	const iosBundleNumber = ios.match(/CURRENT_PROJECT_VERSION\s=\s(\d+)/)?.[1]

	bundleNumbers.actual.android = Number(androidBundleNumber)
	bundleNumbers.actual.ios = Number(iosBundleNumber)

	if (revert) return getLastBundleNumbers(platform)

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
		if (["both", "android"].includes(platform)) return giveMeAndroidBundleNumber(platform)
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
		if (["both", "android"].includes(platform)) return giveMeAndroidBundleNumber(platform)
		else if (platform === "ios") return giveMeiOSBundleNumber(platform)
	}
	question(`Un momento por favor. Estoy actualizando los bundle numbers de tu proyecto.`, false)
	spin.setSpinnerTitle(revert ? "Revirtiendo..." : "Actualizando...")
	spin.start()

	// UPDATE ANDROID BUNDLE NUMBER
	if (["both", "android"].includes(platform)) {
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

	let newLog = log
	if (["both", "android"].includes(platform))
		newLog += `${new Date().toLocaleString()} - [UPDATE - BUNDLE NUMBERS - ANDROID] Bundle numbers updated: Android: ${
			bundleNumbers.actual.android
		} → ${bundleNumbers.news.android}\n`
	if (["both", "ios"].includes(platform))
		newLog += `${new Date().toLocaleString()} - [UPDATE - BUNDLE NUMBERS - IOS] Bundle numbers updated: iOS: ${
			bundleNumbers.actual.ios
		} → ${bundleNumbers.news.ios}\n`

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

	// SAVE REVERT LOG AND CHANGE UPDATE BUNDLE NUMBERS TO ADD A REVERTED FLAG
	const log = await fs.readFile(`${process.cwd()}/react-rover.log`, "utf-8").catch(() => "")

	let newLog = log
	if (["both", "android"].includes(platform))
		newLog += `${new Date().toLocaleString()} - [REVERT - BUNDLE NUMBERS - ANDROID] Bundle numbers reverted: Android: ${
			bundleNumbers.actual.android
		} → ${bundleNumbers.news.android}\n`
	if (["both", "ios"].includes(platform))
		newLog += `${new Date().toLocaleString()} - [REVERT - BUNDLE NUMBERS - IOS] Bundle numbers reverted: iOS: ${
			bundleNumbers.actual.ios
		} → ${bundleNumbers.news.ios}\n`

	let androidReverted = !["both", "android"].includes(platform)
	let iosReverted = !["both", "ios"].includes(platform)

	newLog = newLog
		.split("\n")
		.reverse()
		.map(log => {
			// MODIFY THIS LOG IF IS PLATFORM AND IS NOT REVERTED. VALIDATE THAT THIS HAS NOT (REVERTED) FLAG AT THE END OF THE LINE
			if (
				["both", "android"].includes(platform) &&
				log.search("ANDROID") >= 0 &&
				log.match(/ANDROID\]\sBundle numbers\supdated:\sAndroid:\s(\d+)\s=>\s(\d+)$/g) !== null &&
				!androidReverted
			) {
				androidReverted = true
				return (log += " (REVERTED)")
			}

			if (
				["both", "ios"].includes(platform) &&
				log.search("IOS") >= 0 &&
				log.match(/IOS\]\sBundle numbers\supdated:\siOS:\s(\d+)\s=>\s(\d+)$/g) !== null &&
				!iosReverted
			) {
				iosReverted = true
				return (log += " (REVERTED)")
			}

			return log
		})
		.reverse()
		.join("\n")

	await fs.writeFile(`${process.cwd()}/react-rover.log`, newLog)

	spin.setSpinnerTitle("Guardando registros...")
	spin.start()

	setTimeout(() => {
		spin.stop(true)
		updatedBundleNumbers(true, platform)
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
		"Con gusto te apoyo a revertir tus bundle numbers. Quieres revertir los bundle numbers de iOS o Android?",
		platform => findiOSFolder(platform, true),
		{
			promptOptions: {
				type: "select",
				message: "Quieres revertir los bundle numbers de iOS o Android?",
				choices: [
					{ name: "Revertir ambos", value: "both" },
					{ name: "Revertir Android", value: "android" },
					{ name: "Revertir iOS", value: "ios" },
				],
			},
		}
	)
}

const getLastBundleNumbers = async (platform: string) => {
	// GET LAST BUNDLE NUMBERS FROM LOG BY PLATFORM OR BOTH PLATFORMS AND UPDATE
	const log = await fs.readFile(`${process.cwd()}/react-rover.log`, "utf-8").catch(() => "")
	const android = log.match(/ANDROID\]\sBundle numbers\supdated:\sAndroid:\s(\d+)\s=>\s(\d+)\n/g)
	const ios = log.match(/IOS\]\sBundle numbers\supdated:\siOS:\s(\d+)\s=>\s(\d+)\n/g)

	let androidBundleNumber = 0
	let iosBundleNumber = 0

	if (["both", "android"].includes(platform)) {
		androidBundleNumber = Number(android?.[android.length - 1].match(/(\d+)\s=>/)?.[1])
		bundleNumbers.news.android = androidBundleNumber
	}

	if (["both", "ios"].includes(platform)) {
		iosBundleNumber = Number(ios?.[ios.length - 1].match(/(\d+)\s=>/)?.[1])
		bundleNumbers.news.ios = iosBundleNumber
	}

	let message = ``
	if (platform === "both")
		message = `Android: ${bundleNumbers.news.android} - iOS: ${bundleNumbers.news.ios}`
	if (platform === "android") message = `Android: ${bundleNumbers.news.android}`
	if (platform === "ios") message = `iOS: ${bundleNumbers.news.ios}`

	question(
		`Listo! He encontrado los bundles numbers anteriores de tu proyecto. ${message}. ¿Estas de acuerdo con revertir los cambios?`,
		response => updateBundleNumbers(response, platform, true),
		{ nextMessage: "¿Estas de acuerdo con revertir los cambios?", skipClose: true }
	)
}
