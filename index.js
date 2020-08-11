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
var Schema  = mongoose.Schema ;
var walkerSchema = new Schema( {
		walkerID: Number,
		name: String,
		isBeingUsed: Boolean,
		lastUser: String,
		ownerUser: String,
		isPublic: Boolean,
		description: String,
		location: String
	});
var Walker = mongoose.model('walkers', walkerSchema);

client.on('message', msg => {
	if (msg.author.bot) return;
	if (msg.content.includes('traveled')) {
		msg.channel.send("Walker ID: "+ msg.content.match(/(\d+)/)[1]);
		var newWalker = new Walker({walkerID: msg.content.match(/(\d+)/)[1]});
	}
	if (!msg.content.startsWith(prefix)) return;
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'loaddwalker') {
		addWalkerPass(msg,args);
	} else if (command === 'locraft') {
		if (!args.length) {
			return msg.reply("Tienes que poner lo que quieres craftear y si quieres la cantidad para hacer. Para más info pon "+prefix+"locommands");
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
		msg.channel.send(prefix+"locraft = Con este comando puedes ver los materiales necesarios para hacer un objeto. \n```Ejemplo de uso: "+prefix+"locraft Barrier Base \nSi quieres ver los materiales para hacer 10: "+prefix+"locraft 10x Barrier Base```");
	}
});

function getNecessaryMaterials(item,msg,multiplier) {
	var message = multiplier + "x " + item;
	var url = 'https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json';
	getJSON(url, function(error, response){
		for (var key in response) {
			if (response[key].name == item) {
				ingredie = response[key].crafting;
				for (var i = 0; i < ingredie.length; i++) {
					var le = ingredie[i].ingredients;
					for (var ing in le) {
						message += " | " + le[ing].count*multiplier + "x " + le[ing].name;
					}
				}
				console.log(message);
			}
		}
		msg.reply(message);
	});
}

function addWalkerPass(msg,args) {
	if (!args.length && args.length != 3) {
		return msg.reply("Para agregar un walker pon " + prefix + "loaddwalker id dueño \n```Ejemplo: "+ prefix +"loaddwalker 721480717 Dm94Dani```");
	} else {
		msg.reply("Walker agregado \n```ID del waker: "+args[0]+"\nDueño: "+args[1]+" ```");
	}
	
}