const Discord = require('discord.js');
const client = new Discord.Client();
var config = require('./config.json');
var getJSON = require('get-json');
var mysql = require('mysql');
var itemsES = require('./itemsES.json');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

var pool = mysql.createPool({
		host: config.mysqldbHost,
		user: config.mysqldbUser,
		password: config.mysqldbPass,
		database: config.mysqldbDatabase,
		connectionLimit: 5
	});
	
client.login(config.discordToken);
const prefix = config.discordPrefix;

client.on('ready', () => {
	client.user.setActivity('!lohelp', { type: 'STREAMING', url: 'https://www.twitch.tv/dm94dani' });
});

client.on('message', msg => {
	if (msg.content.includes('traveled') && msg.author.bot) {
		var walkerId = 0;
		var walkerName = "";
		var lastUser = "";
		if (/\((\d+)\)/.test(msg.content)) {
			walkerId = parseInt(msg.content.match(/\((\d+)\)/)[1]);
		}
		if (/(?:``)(.+)(?:`` traveled)/.test(msg.content)) {
			lastUser = msg.content.match(/(?:``)(.+)(?:`` traveled)/)[1];
		}
		if (/(?:with walker\s``)(.+)(?:``\s)/.test(msg.content)) {
			walkerName = msg.content.match(/(?:with walker\s``)(.+)(?:``\s)/)[1];
		}
		var newWalker = {walkerID: walkerId, lastUser: lastUser, name: walkerName};
		walkerAlarm(newWalker,msg);
		insertNewWalker(newWalker,msg.guild.id);
	}
	if (!msg.content.startsWith(prefix) && msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'loaddwalker') {
		addWalkerPass(msg,args);
	} else if (command === 'lowalkerinfo') {
		walkerInfo(msg,args);
	} else if (command === 'lolistwalkers') {
		listAllWalkers(msg);
	} else if (command === 'locraft') {
		console.log(new Date() + " " + msg);
		if (!args.length) {
			return msg.reply("Tienes que poner lo que quieres craftear y si quieres la cantidad para hacer. Para más info pon " + prefix + "locommands");
		}
		var multiplier = 1;
		if (/(\d+)/.test(msg.content)) {
			multiplier = msg.content.match(/(\d+)/)[1];
		}
		var item = msg.content.substr(msg.content.indexOf('locraft')+7);
		if (multiplier != 1) {
			item = msg.content.substr(msg.content.indexOf('x')+1);
		}
		var materials = getNecessaryMaterials(item.trim().toLowerCase(),msg,multiplier);
	} else if (command === 'locommands' || command === 'lohelp') {
		let messageEs = ":flag_es: \n```";
		messageEs += prefix + "locraft = Con este comando puedes ver los materiales necesarios para hacer un objeto. \nEjemplo de uso: " + prefix + "locraft Cuerpo de Walker Cobra \nSi quieres ver los materiales para hacer 10: " + prefix + "locraft 10x Cuerpo de Walker Cobra";
		messageEs += "\n" + prefix + "loinfo = Muestra información del bot.";
		messageEs += "\n" + prefix + "lolistwalkers = Muestra todos los walkers añadidos desde este discord.";
		messageEs += "\n" + prefix + "loaddwalker (id) (dueño) = Permite asignar un dueño a un walker y si ese walker lo saca la persona que no es el dueño avisa en el discord.";
		messageEs += "\n" + prefix + "lowalkerinfo (id) = Muestra la información de un walker en concreto";
		messageEs += "```";
		msg.channel.send(messageEs);
		
		let messageEn = ":flag_gb: \n```";
		messageEn += prefix + "locraft = With this command you can see the materials needed to make an object. \nExample of use: " + prefix + "locraft Barrier Base \nIf you want to see the materials to make 10: " + prefix + "locraft 10x Barrier Base ";
		messageEn += "\n" + prefix + "loinfo = Displays bot information.";
		messageEn += "\n" + prefix + "lolistwalkers = Shows all the walkers added since this discord.";
		messageEn += "\n" + prefix + "loaddwalker (id) (owner) = It allows to assign an owner to a walker and if that walker is taken out by the person who is not the owner, it warns in the discord.";
		messageEn += "\n" + prefix + "lowalkerinfo (id) = Shows the information of a specific walker";
		messageEn += "```";
		msg.channel.send(messageEn);
	} else if (command === 'loinfo') {
		mostrarInfo(msg);
	}
});

function getNecessaryMaterials(item,msg,multiplier) {
	var message = multiplier + "x " + item;
	var found = false;
	getJSON("https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json", function(error, response){
		for (var key in response) {
			let areItems = false;
			let objetitem = response[key].name.toLowerCase();
			if (objetitem.includes(item)) {
				message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + objetitem).setDescription("Here are the necessary materials");
				ingredie = response[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					let le = ingredie[i].ingredients;
					for (var ing in le) {
						areItems = true;
						message.addField(le[ing].name, le[ing].count*multiplier, true);
					}
				}
			}
			if (areItems) {
				found = true;
				msg.channel.send(message);
			}
		}
	});
	if (!found) {
		//To show the items in Spanish
		for (var key in itemsES) {
			let areItems = false;
			let objetitem = itemsES[key].name.toLowerCase();
			if (objetitem.includes(item)) {
				message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + objetitem).setDescription("Aquí tienes los materiales necesarios");
				ingredie = itemsES[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					let le = ingredie[i].ingredients;
					for (var ing in le) {
						areItems = true;
						message.addField(le[ing].name, le[ing].count*multiplier, true);
					}
				}
			}
			if (areItems) {
				msg.channel.send(message);
			}
		}
	}
}

function addWalkerPass(msg,args) {
	if (!args.length && args.length != 3) {
		msg.reply("Para agregar un walker pon " + prefix + "loaddwalker id dueño \n```Ejemplo: "+ prefix +"loaddwalker 721480717 Dm94Dani```");
	} else {
		let walkerId = parseInt(args[0]);
		let owner = msg.content.substring(msg.content.indexOf(args[1])).trim();
		let sql = "update walkers set ownerUser = '"+owner+"' where walkerID = "+ walkerId;
		execSQL(sql);
		msg.reply("Walker agregado \n```ID del waker: "+walkerId+"\nDueño: "+owner+" ```");
	}
}

function walkerInfo(msg,args) {
	if (!args.length && args.length != 2) {
		msg.reply("Para ver la información de un walker pon " + prefix + "lowalkerinfo id \n```Ejemplo: "+ prefix +"lowalkerinfo 721480717```");
	} else {
		let walkerId = parseInt(args[0]);
		try {
			pool.query("SELECT * FROM walkers where walkerID = " + walkerId, (err, result) => {
				if (result != null && Object.entries(result).length > 0) {
					for (var walker in result) {
						let message = new Discord.MessageEmbed().setColor('#58ACFA').setTitle(result[walker].name);
						message.addField("Walker ID", result[walker].walkerID, true);
						message.addField("Last User", result[walker].lastUser, true);
						if (result[walker].ownerUser === "null") {
							message.addField("Owner", "Not defined", true);
						} else {
							message.addField("Owner", result[walker].ownerUser, true);
						}
						msg.channel.send(message);
					}
				} else {
					msg.channel.send("ID: "+ walkerId +"\nNo hay ningún walker con esa id \n There is no walker with that id");
				}
			});
		} catch (error) {
			console.error(error);
		}
	}
}

function walkerAlarm(newWalker, msg) {
	try {
		pool.query("SELECT * FROM walkers where walkerID = " + newWalker.walkerID, (err, result) => {
			if (err) console.log(err);
			if (result != null && Object.entries(result).length > 0) {
				for (var walker in result) {
					if (result[walker].ownerUser === "null") {
					} else if (result[walker].ownerUser =! newWalker.lastUser) {
						msg.reply("@everyone \nAlerta alguien esta usando un walker que no es suyo \nAlert the walker with owner has been used");
					}
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
}

function listAllWalkers(msg) {
	pool.query("SELECT * FROM walkers where discorid = " + msg.guild.id, (err, result) => {
		if (err) console.log(err);
		if (result != null && Object.entries(result).length > 0) {
			for (var walker in result) {
				let message = new Discord.MessageEmbed().setColor('#58ACFA').setTitle(result[walker].name);
				message.addField("Walker ID", result[walker].walkerID, true);
				message.addField("Last User", result[walker].lastUser, true);
				if (result[walker].ownerUser === "null") {
					message.addField("Owner", "Not defined", true);
				} else {
					message.addField("Owner", result[walker].ownerUser, true);
				}
				msg.channel.send(message);
			}
		} else {
			msg.channel.send("No se han añadido walkers desde este discord \nNo walkers added since this discord");
		}
	});
}

function insertNewWalker(newWalker,discordid) {
	try {
		pool.query("SELECT * FROM walkers where walkerID = " + newWalker.walkerID, (err, result) => {
			if (err) console.log(err);
			if (result != null && Object.entries(result).length > 0) {
				let sql = "update walkers set discorid = '"+discordid+"', name = '"+newWalker.name+"', lastUser='"+newWalker.lastUser+"' where walkerID = "+ newWalker.walkerID;
				execSQL(sql);
				console.log("Walker actualizado");
			} else {
				let sql = "INSERT INTO walkers (walkerID, discorid, name, lastUser) VALUES ("+ newWalker.walkerID + ", '"+ discordid +"', '" + newWalker.name + "', '" + newWalker.lastUser + "')";
				execSQL(sql);
				console.log("Nuevo walker insertado");
			}
		});
	} catch (error) {
		console.error(error);
	}
}

function execSQL(sql) {
	try {
		pool.query(sql, (err, result) => {
			if (err) console.log(err);
		});
	} catch (error) {
		console.error(error);
	}
}

function mostrarInfo(msg) {
	var message = new Discord.MessageEmbed()
		.setColor('#008FFF').setTitle("LO BOT")
		.setURL('https://github.com/dm94/lastoasisbot')
		.setAuthor('Dm94Dani', 'https://comunidadgzone.es/wp-content/uploads/2020/08/FENIX-dm94dani.png', 'https://github.com/dm94')
		.setDescription("Discord Bot for Last Oasis" + 
		"\nTo add the bot to your discord: https://discordapp.com/oauth2/authorize?&client_id=715948052979908911&scope=bot&permissions=67584" +
		"\nThe list of items comes from this repository: https://github.com/Last-Oasis-Crafter/lastoasis-crafting-calculator");
	msg.channel.send(message);
}