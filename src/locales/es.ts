import chalk from "chalk"
import { ILang } from "./interfaces"

const lang = (): ILang => {
	return {
		name: "es",
		generals: {
			continue_question: "Quieres continuar?",
		},
		react_rover: {
			hello: `${chalk.bold("Hola amigo")}, Yo soy ${chalk
				.hex("#0de2ea")
				.bold("ReactRover")} y estoy aquí para ayudarte! Comencémos!`,
			bye: `${chalk.bold("Adios amigo")}, Espero verte pronto!`,
		},
		whatToDo: {
			title: "Que quieres hacer?",
			aboutMe: "Sobre mi",
			bundleNumbers: "Números de bundle",
			versionName: "Nombre de Versión (X.Y.Z)",
			applicationId: "ID de la Aplicación",
			releases: "Despliegues automatizados",
			recordChanges: "Registro de cambios",
			exit: "Salir",
		},
		about_me: {
			who_am_i:
				"Soy tu ingenioso asistente interactivo en el emocionante mundo de React Native. Mi misión es simplificar la gestión y actualización de tus proyectos, haciéndote la vida más fácil en cada etapa del desarrollo.",
			what_can_i_do:
				"Me especializo en tareas clave que harán que tu flujo de trabajo de desarrollo sea más sencillo y eficiente. ¿Quieres conocerlas?",
			task01: `${chalk.bold(
				"Números de Bundle."
			)} Actualizar el número de bundle conmigo, es un proceso fluido. Puedo encargarme automáticamente de asignar números secuenciales para un seguimiento impecable de versiones. ¡O si lo prefieres, especifica el número tú mismo! La elección es tuya, haciendo que la gestión de versiones sea personalizada y fácil.`,
			task02: `${chalk.bold(
				"Nombre de la Versión."
			)} Me aseguro de hacer las preguntas adecuadas para entender la esencia de la actualización. Esto no solo simplifica el proceso, sino que también proporciona un control claro sobre los cambios. Así, cada actualización refleja con precisión las mejoras realizadas en tu aplicación.`,
			task03: `${chalk.bold(
				"ID de la Aplicación."
			)} Cuando trabajas conmigo, el manejo de tu ID de aplicación se convierte en una charla directa. ¡Dime tu ID y si necesitas cambiarlo para Android, iOS o ambos! Luego, me encargaré de realizar los ajustes necesarios en todos los lugares pertinentes. Así, tu aplicación estará siempre lista para desplegar, y lo mejor, sin complicaciones.`,
			task04: `${chalk.bold(
				"Automatización de Despliegues."
			)} ¿Sabías que puedo generar comandos listos para integrar en tus acciones de GitHub? Sí, así es. Solo dime tus preferencias y necesidades, y prepararé comandos que te permitirán automatizar tus despliegues con un clic. Así, tus actualizaciones llegarán más rápido y con menos esfuerzo. ¡Hagamos que tu experiencia de desarrollo sea imparable!`,
			task05: `${chalk.bold(
				"Registro de Cambios."
			)} quiero que sepas que mantengo un historial meticuloso de cada cambio que realizo. Ya sea ajustar el número de bundle, modificar el ID de la aplicación o cualquier otra mejora, cada paso queda registrado. Así, siempre tendrás la certeza y claridad de cada versión, facilitando tu trayecto de desarrollo.`,
			can_i_do_something: "¿Puedo hacer algo más por ti?",
		},
	}
}

export default lang()
