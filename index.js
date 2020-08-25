const Discord = require('discord.js');
const client = new Discord.Client();
var config = require('./config.json');
var getJSON = require('get-json');
var mysql = require('mysql');
var itemsES = require('./itemsES.json');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
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
		insertNewWalker(newWalker,msg.guild.id);
	}
	if (!msg.content.startsWith(prefix) && msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'loaddwalker') {
		addWalkerPass(msg,args);
	} else if (command === 'lolistwalkers') {
		listAllWalkers(msg);
	} else if (command === 'locraft') {
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
		msg.channel.send(":flag_es: \n```" + prefix+"locraft = Con este comando puedes ver los materiales necesarios para hacer un objeto. \nEjemplo de uso: " + prefix + "locraft Cuerpo de Walker Cobra \nSi quieres ver los materiales para hacer 10: " + prefix + "locraft 10x Cuerpo de Walker Cobra``` \n" + prefix + "loinfo = Muestra información del bot.```");
		msg.channel.send(":flag_gb: \n```" + prefix+"locraft = With this command you can see the materials needed to make an object. \nExample of use: " + prefix + "locraft Barrier Base \nIf you want to see the materials to make 10: " + prefix + "locraft 10x Barrier Base \n" + prefix + "loinfo = Displays bot information.```");
	} else if (command === 'loinfo') {
		mostrarInfo(msg);
	}
});

function getNecessaryMaterials(item,msg,multiplier) {
	var message = multiplier + "x " + item;
	var found = false;
	getJSON("https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json", function(error, response){
		for (var key in response) {
			var areItems = false;
			var objetitem = response[key].name.toLowerCase();
			if (objetitem.includes(item)) {
				message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + objetitem).setDescription("Here are the necessary materials");
				ingredie = response[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					var le = ingredie[i].ingredients;
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
			var areItems = false;
			var objetitem = itemsES[key].name.toLowerCase();
			if (objetitem.includes(item)) {
				message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + objetitem).setDescription("Aquí tienes los materiales necesarios");
				ingredie = itemsES[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					var le = ingredie[i].ingredients;
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
		return msg.reply("Para agregar un walker pon " + prefix + "loaddwalker id dueño \n```Ejemplo: "+ prefix +"loaddwalker 721480717 Dm94Dani```");
	} else {
		var walkerId = parseInt(args[0]);
		var sql = "update walkers set ownerUser = '"+args[1]+"' where walkerID = "+ walkerId;
		execSQL(sql);
		msg.reply("Walker agregado \n```ID del waker: "+args[0]+"\nDueño: "+args[1]+" ```");
	}
}

function listAllWalkers(msg) {
	
}

function insertNewWalker(newWalker,discordid) {
	if (walkerExist(newWalker)) {
		var sql = "update walkers set discorid = '"+discordid+"', name = '"+newWalker.name+"', lastUser='"+newWalker.lastUser+"' where walkerID = "+ newWalker.walkerID;
		execSQL(sql);
		console.log("Walker actualizado");
	} else {
		var sql = "INSERT INTO walkers (walkerID, discorid, name, lastUser) VALUES ("+ newWalker.walkerID + ", '"+ discordid +"', '" + newWalker.name + "', '" + newWalker.lastUser + "')";
		execSQL(sql);
	}
}

function execSQL(sql) {
	var pool = mysql.createPool({
		host: config.mysqldbHost,
		user: config.mysqldbUser,
		password: config.mysqldbPass,
		database: config.mysqldbDatabase,
		connectionLimit: 5
	});
	
	pool.query(sql, function (err, result) {
		if (err) console.log(err);
	});
}

function walkerExist(newWalker) {
	var pool = mysql.createPool({
		host: config.mysqldbHost,
		user: config.mysqldbUser,
		password: config.mysqldbPass,
		database: config.mysqldbDatabase,
		connectionLimit: 5
	});
	
	var existe = false;
	pool.query("SELECT * FROM walkers where walkerID = " + newWalker.walkerID, function (err, result, fields) {
		if (err) console.log(err);
		if (Object.entries(result).length > 0) {
			existe = true;
		}
	});
	return existe;
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