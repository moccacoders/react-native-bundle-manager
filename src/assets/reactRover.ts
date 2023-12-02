import chalk from "chalk"
import chunk from "lodash.chunk"
import lang from "../locales"
import { TLocales } from "../locales/interfaces"

export const ReactRover: string = `
              %%%%%%%%%%%%             
    %%%%   %%%%%%%%%%%%%%%%%%%    %%%% 
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %%%%%%%%%˚˚˚%%%%%%%%%%˚˚˚%%%%%%%%
    %%%%%%%%%._.%%%%%%%%%%._.%%%%%%%%
     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%    
           --================--  
   
       %%%%                    %%%%
      %%%%%%                  %%%%%%
       %%%%                    %%%%
`

export const ReactRoverAscii: string = `
              ▒▒▒▓▓▓▓▓▒▒▒               
          ▒▓███████████████▓▓▒          
    ▓███▓██████████████████████▓███▒    
    ███████████████████████████████▓    
   ▒███████████████████████████████▓▒   
  ▓███████▓▓▓██████████████▓▓▓███████▓  
 ▓███████▒    ███████████▓    ▒███████▒ 
 ▓███████▒   ▒███████████▓    ▓███████  
  ▓█████████████████████████████████▓   
    ▒▓███████████████████████████▓▒     
        ▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒         
               ▒▒▒▒▒▒▒▒▒▒               
     ▒▓██▓▒                   ▒████▒    
     ██████                   ██████    
     ▒▓██▓▒                    ▓██▓▒    
                                        
`

export const dialogBubble = (text: string, max: number = 60): string => {
	const words = text.split(" ").length
	const maxWords = Math.ceil(text.replace(" ", "").length / max)
	const chunks = chunk(text.split(" "), words / maxWords)
	const longest = chunks.reduce(
		(acc, curr) =>
			curr
				.join(" ")
				.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")
				.length > acc
				? curr
						.join(" ")
						.replace(
							/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
							""
						).length
				: acc,
		0
	)
	text = chunks.map(chunk => chunk.join(" ").padEnd(longest, " ")).join("   |\n|   ")
	return `
 ${".".repeat(longest + 6)} 
|${" ".repeat(longest + 6)}|
|   ${text}   |
|${" ".repeat(longest + 6)}|
 ${"˚".repeat(longest + 6)} 
       O
          o
             o`
}

export const sayHello = () => {
	process.stdout.write(dialogBubble(global.lang.react_rover.hello))
	process.stdout.write(chalk.hex("#0de2ea")(ReactRoverAscii))
}

export const sayBye = () => {
	process.stdout.write(dialogBubble(global.lang.react_rover.bye))
	process.stdout.write(chalk.hex("#0de2ea")(ReactRoverAscii))
}

export const reactRoverMessage = (message: string) => {
	process.stdout.write(dialogBubble(message))
	process.stdout.write(chalk.hex("#0de2ea")(ReactRoverAscii))
}
