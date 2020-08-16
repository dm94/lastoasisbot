const Discord = require('discord.js');
var mongoose = require('mongoose');
const client = new Discord.Client();
var config = require('./config.json');
var getJSON = require('get-json');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.discordToken);
const prefix = config.discordPrefix;
mongoose.connect('mongodb+srv://'+config.mongodbUser+':'+config.mongodbPass+'@'+config.mongodbHost+'/'+config.mongodbDatabase,{ useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const Walkers = mongoose.model('walkers', mongoose.Schema({
	walkerID: Number,
	name: String,
	isBeingUsed: Boolean,
	lastUser: String,
	ownerUser: String,
	isPublic: Boolean,
	description: String,
	location: String
}));
client.on('message', msg => {
	if (msg.content.includes('traveled') && msg.author.bot) {
		var walkerId = 0;
		var walkerName = "";
		var lastUser = "";
		if (/\((\d+)\)/.test(msg.content)) {
			walkerId = msg.content.match(/\((\d+)\)/)[1];
		}
		if (/(?:``)(.+)(?:`` traveled)/.test(msg.content)) {
			lastUser = msg.content.match(/(?:``)(.+)(?:`` traveled)/)[1];
		}
		if (/(?:with walker\s``)(.+)(?:``\s)/.test(msg.content)) {
			walkerName = msg.content.match(/(?:with walker\s``)(.+)(?:``\s)/)[1];
		}
		var newWalker = new Walkers({walkerID: walkerId, lastUser: lastUser, name: walkerName});
		insertNewWalker(newWalker);
	}
	if (!msg.content.startsWith(prefix) && msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'loaddwalker') {
		addWalkerPass(msg,args);
	} else if (command === 'lolistwalkers') {
		
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
		var materials = getNecessaryMaterials(item.trim(),msg,multiplier);
	} else if (command === 'locommands') {
		msg.channel.send(prefix+"locraft = Con este comando puedes ver los materiales necesarios para hacer un objeto. \n```Ejemplo de uso: " + prefix + "locraft Barrier Base \nSi quieres ver los materiales para hacer 10: " + prefix + "locraft 10x Barrier Base```");
	}
});

function getNecessaryMaterials(item,msg,multiplier) {
	var message = multiplier + "x " + item;
	var url = 'https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json';
	getJSON(url, function(error, response){
		var areItems = false;
		message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + item)	.setDescription("Here are the necessary materials");
		for (var key in response) {
			if (response[key].name == item) {
				ingredie = response[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					var le = ingredie[i].ingredients;
					for (var ing in le) {
						areItems = true;
						message.addField(le[ing].name, le[ing].count*multiplier, true);
						//message += " | " + le[ing].count*multiplier + "x " + le[ing].name;
					}
				}
			}
		}
		if (areItems) {
			msg.channel.send(message);
		}
	});
	//To show the items in Spanish
	getJSON("https://raw.githubusercontent.com/dm94/lastoasis-crafting-calculator/master/src/itemsES.json", function(error, response){
		var areItems = false;
		message = new Discord.MessageEmbed().setColor('#FFE400').setTitle(multiplier + "x " + item)	.setDescription("Aquí tienes los materiales necesarios");
		for (var key in response) {
			if (response[key].name == item) {
				ingredie = response[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					var le = ingredie[i].ingredients;
					for (var ing in le) {
						areItems = true;
						message.addField(le[ing].name, le[ing].count*multiplier, true);
						//message += " | " + le[ing].count*multiplier + "x " + le[ing].name;
					}
				}
			}
		}
		if (areItems) {
			msg.channel.send(message);
		}
	});
}

function addWalkerPass(msg,args) {
	if (!args.length && args.length != 3) {
		return msg.reply("Para agregar un walker pon " + prefix + "loaddwalker id dueño \n```Ejemplo: "+ prefix +"loaddwalker 721480717 Dm94Dani```");
	} else {
		msg.reply("Walker agregado \n```ID del waker: "+args[0]+"\nDueño: "+args[1]+" ```");
		var newWalker = new Walkers({walkerID: args[0],ownerUser: args[1]});
		insertNewWalker(newWalker);
	}
}

function insertNewWalker(newWalker) {
	Walkers.exists({ walkerID: newWalker.walkerID}).then(exists => {
		if (exists) {
			var query = {'walkerID': newWalker.walkerID};
			Walkers.findOneAndUpdate(query, newWalker, {upsert: true}, function(err, doc) {
			});
		} else {
			newWalker.save(function (err, book) {
				if (err) return console.error(err);
			});
		}
	});
}