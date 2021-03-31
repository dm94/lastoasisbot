require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
var getJSON = require("get-json");
var mysql = require("mysql");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASS,
  database: process.env.MYSQL_DB_DATABASE,
  connectionLimit: 5,
});

client.login(process.env.DISCORD_TOKEN);
const prefix = process.env.DISCORD_PREFIX;

client.on("ready", () => {
  client.user.setActivity("!lohelp", {
    type: "STREAMING",
    url: "https://www.stiletto.live/",
  });
  makeDB();
});

client.on("message", (msg) => {
  if (msg.content.includes("traveled") && msg.author.bot) {
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
    var newWalker = {
      walkerID: walkerId,
      lastUser: lastUser,
      name: walkerName,
    };
    walkerAlarm(newWalker, msg);
    insertNewWalker(newWalker, msg.guild.id);
  }
  if (!msg.content.startsWith(prefix) && msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  if (command === "loaddwalker") {
    addWalkerPass(msg, args);
  } else if (command === "lowalkerinfo") {
    walkerInfo(msg, args);
  } else if (command === "lolistwalkers") {
    listAllWalkers(msg);
  } else if (command === "lowalkersearchbyname") {
    listAllWalkersByName(msg);
  } else if (command === "lowalkersearchbyowner") {
    listAllWalkersByOwner(msg);
  } else if (command === "lowalkersearchbylastuser") {
    listAllWalkersByLastUser(msg);
  } else if (command === "loaddflots") {
    addFlots(msg, args);
  } else if (command === "loremoveflots") {
    loRemoveFlots(msg, args);
  } else if (command === "lotransactions") {
    historyFlots(msg);
  } else if (command === "locraft") {
    console.log(new Date() + " " + msg);
    if (!args.length) {
      return msg.reply(
        "Tienes que poner lo que quieres craftear y si quieres la cantidad para hacer. Para más info pon " +
          prefix +
          "locommands"
      );
    }
    var multiplier = 1;
    if (/(\d+)/.test(msg.content)) {
      multiplier = msg.content.match(/(\d+)/)[1];
    }
    var item = msg.content.substr(msg.content.indexOf("locraft") + 7);
    if (multiplier != 1) {
      item = msg.content.substr(msg.content.indexOf("x") + 1);
    }
    try {
      getNecessaryMaterials(item.trim().toLowerCase(), msg, multiplier);
    } catch (error) {
      console.log(error);
    }
  } else if (command === "locommands" || command === "lohelp") {
    let messageEs = ":flag_es: \n```";
    messageEs +=
      prefix +
      "locraft = Con este comando puedes ver los materiales necesarios para hacer un objeto. \nEjemplo de uso: " +
      prefix +
      "locraft Cuerpo de Walker Cobra \nSi quieres ver los materiales para hacer 10: " +
      prefix +
      "locraft 10x Cuerpo de Walker Cobra";
    messageEs += "\n" + prefix + "loinfo = Muestra información del bot.";
    messageEs +=
      "\n" +
      prefix +
      "lolistwalkers (página) = Muestra todos los walkers añadidos desde este discord. Cada página son 5 walkers";
    messageEs +=
      "\n" +
      prefix +
      "loaddwalker (id) (dueño) = Permite asignar un dueño a un walker y si ese walker lo saca la persona que no es el dueño avisa en el discord.";
    messageEs +=
      "\n" +
      prefix +
      "lowalkerinfo (id) = Muestra la información de un walker en concreto";
    messageEs +=
      "\n" +
      prefix +
      "lowalkersearchbyname (nombre) = Muestra todos los walkers con ese nombre";
    messageEs +=
      "\n" +
      prefix +
      "lowalkersearchbyowner (nombre) = Muestra todos los walkers con ese dueño";
    messageEs +=
      "\n" +
      prefix +
      "lowalkersearchbylastuser (nombre) = Muestra todos los walkers que ha usado esa persona";
    messageEs +=
      "\n" +
      prefix +
      "loaddflots cantidad descripcion = Añade flots a tu historial de transaciones";
    messageEs +=
      "\n" +
      prefix +
      "loremoveflots cantidad descripcion = Quita flots a tu historial de transaciones";
    messageEs +=
      "\n" +
      prefix +
      "lotransactions = Te muestra el historial de transaciones";
    messageEs += "```";
    sendChannelMessage(msg, messageEs);

    let messageEn = ":flag_gb: \n```";
    messageEn +=
      prefix +
      "locraft = With this command you can see the materials needed to make an object. \nExample of use: " +
      prefix +
      "locraft Barrier Base \nIf you want to see the materials to make 10: " +
      prefix +
      "locraft 10x Barrier Base ";
    messageEn += "\n" + prefix + "loinfo = Displays bot information.";
    messageEn +=
      "\n" +
      prefix +
      "lolistwalkers (page) = Shows all the walkers added since this discord. Each page is 5 walkers";
    messageEn +=
      "\n" +
      prefix +
      "loaddwalker (id) (owner) = It allows to assign an owner to a walker and if that walker is taken out by the person who is not the owner, it warns in the discord.";
    messageEn +=
      "\n" +
      prefix +
      "lowalkerinfo (id) = Shows the information of a specific walker";
    messageEn +=
      "\n" +
      prefix +
      "lowalkersearchbyname (name) = Shows all walkers with that name";
    messageEn +=
      "\n" +
      prefix +
      "lowalkersearchbyowner (name) = Show all walkers with that owner";
    messageEn +=
      "\n" +
      prefix +
      "lowalkersearchbylastuser (name) = Shows all the walkers that person has used";
    messageEn +=
      "\n" +
      prefix +
      "loaddflots cantidad descripcion = Add flots to your transaction history";
    messageEn +=
      "\n" +
      prefix +
      "loremoveflots cantidad descripcion = Remove flots from your transaction history";
    messageEn +=
      "\n" + prefix + "lotransactions = Shows you the history of transactions";
    messageEn += "```";
    sendChannelMessage(msg, messageEn);
  } else if (command === "loinfo") {
    showInfo(msg);
  }
});

function makeDB() {
  let sql =
    "CREATE TABLE IF NOT EXISTS walkers ( walkerID int(30) NOT NULL, discorid varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL, name varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ownerUser varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, lastUser varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, isBeingUsed tinyint(1) DEFAULT NULL, isPublic tinyint(1) DEFAULT NULL, description varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL, location varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL, PRIMARY KEY (walkerID)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
  pool.query(sql, (err, result) => {
    if (err) console.log(err);
  });
}

function getNecessaryMaterials(item, msg, multiplier) {
  if (item.length <= 0) {
    return;
  }
  var message = multiplier + "x " + item;
  var found = false;
  let itemsSent = 0;
  getJSON(
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json",
    function (error, response) {
      for (var key in response) {
        let areItems = false;
        let objetitem = response[key].name.toLowerCase();
        if (objetitem.includes(item)) {
          message = new Discord.MessageEmbed()
            .setColor("#FFE400")
            .setTitle(multiplier + "x " + response[key].name)
            .setDescription("Here are the necessary materials");
          var ingredie = response[key].crafting;
          if (ingredie != null) {
            for (var i = 0; i < ingredie.length; i++) {
              let le = ingredie[i].ingredients;
              for (var ing in le) {
                areItems = true;
                message.addField(
                  le[ing].name,
                  le[ing].count * multiplier,
                  true
                );
              }
            }
          }
          if (response[key].cost != null) {
            message.setFooter(
              "Cost: " +
                response[key].cost.count +
                " " +
                response[key].cost.name
            );
          }
        }
        if (areItems && itemsSent < 5) {
          itemsSent++;
          found = true;
          sendChannelMessage(msg, message);
        }
      }
    }
  );
  itemsSent = 0;
  if (!found) {
    //To show the items in Spanish
    getJSON(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/itemsES_min.json",
      function (error, response) {
        for (var key in response) {
          let areItems = false;
          let objetitem = response[key].name.toLowerCase();
          if (objetitem.includes(item)) {
            message = new Discord.MessageEmbed()
              .setColor("#FFE400")
              .setTitle(multiplier + "x " + response[key].name)
              .setDescription("Aquí tienes los materiales necesarios");
            var ingredie = response[key].crafting;
            if (ingredie != null) {
              for (var i = 0; i < ingredie.length; i++) {
                let le = ingredie[i].ingredients;
                for (var ing in le) {
                  areItems = true;
                  message.addField(
                    le[ing].name,
                    le[ing].count * multiplier,
                    true
                  );
                }
              }
            }
            if (response[key].cost != null) {
              message.setFooter(
                "Coste: " +
                  response[key].cost.count +
                  " " +
                  response[key].cost.name
              );
            }
          }
          if (areItems && itemsSent < 5) {
            itemsSent++;
            found = true;
            sendChannelMessage(msg, message);
          }
        }
      }
    );
  }
}

function addWalkerPass(msg, args) {
  if (!args.length && args.length != 3) {
    msg.reply(
      "Para agregar un walker pon " +
        prefix +
        "loaddwalker id dueño \n```Ejemplo: " +
        prefix +
        "loaddwalker 721480717 Dm94Dani```"
    );
  } else {
    let walkerId = parseInt(args[0]);
    let owner = msg.content.substring(msg.content.indexOf(args[1])).trim();
    pool.query(
      "update walkers set ownerUser = ? where walkerID = ? and discorid like ?",
      [owner, walkerId, msg.guild.id],
      (err, result) => {
        if (err) console.log(err);
      }
    );
    msg.reply(
      "Walker agregado \n```ID del waker: " +
        walkerId +
        "\nDueño: " +
        owner +
        " ```"
    );
  }
}

function walkerInfo(msg, args) {
  if (!args.length && args.length != 2) {
    msg.reply(
      "Para ver la información de un walker pon " +
        prefix +
        "lowalkerinfo id \n```Ejemplo: " +
        prefix +
        "lowalkerinfo 721480717```"
    );
  } else {
    let walkerId = parseInt(args[0]);
    try {
      pool.query(
        "SELECT * FROM walkers where walkerID = ? and discorid like ?",
        [walkerId, msg.guild.id],
        (err, result) => {
          if (result != null && Object.entries(result).length > 0) {
            for (var walker in result) {
              var date = new Date(result[walker].datelastuse);
              let message = new Discord.MessageEmbed()
                .setColor("#58ACFA")
                .setTitle(result[walker].name);
              message.addField("Walker ID", result[walker].walkerID, true);
              message.addField("Last User", result[walker].lastUser, true);
              message.addField(
                "Last use",
                date.getDate() +
                  "-" +
                  (parseInt(date.getMonth()) + 1) +
                  "-" +
                  date.getFullYear(),
                true
              );
              if (
                result[walker].ownerUser === "null" ||
                !result[walker].ownerUser
              ) {
                message.addField("Owner", "Not defined", true);
              } else {
                message.addField("Owner", result[walker].ownerUser, true);
              }
              sendChannelMessage(msg, message);
            }
          } else {
            sendChannelMessage(
              msg,
              "ID: " +
                walkerId +
                "\nNo hay ningún walker con esa id \n There is no walker with that id"
            );
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

function walkerAlarm(newWalker, msg) {
  try {
    pool.query(
      "SELECT * FROM walkers where walkerID = ?",
      [newWalker.walkerID],
      (err, result) => {
        if (err) console.log(err);
        if (result != null && Object.entries(result).length > 0) {
          for (var walker in result) {
            if (
              !(
                result[walker].ownerUser === "null" || !result[walker].ownerUser
              ) &&
              result[walker].ownerUser != newWalker.lastUser
            ) {
              msg.reply(
                "@everyone Alerta alguien esta usando un walker que no es suyo \nAlert the walker with owner has been used"
              );
            }
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function listAllWalkers(msg) {
  replyWalkerList(
    msg,
    "SELECT * FROM walkers where discorid = " + msg.guild.id
  );
}

function listAllWalkersByName(msg) {
  var name = msg.content
    .substring(msg.content.indexOf("lowalkersearchbyname") + 20)
    .trim();
  replyWalkerList(
    msg,
    "SELECT * FROM walkers where discorid = " +
      msg.guild.id +
      " and name like " +
      pool.escape("%" + name + "%")
  );
}

function listAllWalkersByOwner(msg) {
  var ownerUser = msg.content
    .substring(msg.content.indexOf("lowalkersearchbyowner") + 21)
    .trim();
  replyWalkerList(
    msg,
    "SELECT * FROM walkers where discorid = " +
      msg.guild.id +
      " and ownerUser like " +
      pool.escape("%" + ownerUser + "%")
  );
}

function listAllWalkersByLastUser(msg) {
  var lastUser = msg.content
    .substring(msg.content.indexOf("lowalkersearchbylastuser") + 24)
    .trim();
  replyWalkerList(
    msg,
    "SELECT * FROM walkers where discorid = " +
      msg.guild.id +
      " and lastUser like " +
      pool.escape("%" + lastUser + "%")
  );
}

function addFlots(msg, args) {
  if (!args.length && args.length != 3) {
    msg.reply(
      "To add flots write the following" +
        prefix +
        "loaddflots quantity description \n```Example: " +
        prefix +
        "loaddflots 2000 Mision```"
    );
  } else {
    let quantity = parseInt(args[0]);
    insertQuantity(msg, args, quantity);
  }
}

function loRemoveFlots(msg, args) {
  if (!args.length && args.length != 3) {
    msg.reply(
      "To remove flots write the following" +
        prefix +
        "loremoveflots quantity description \n```Example: " +
        prefix +
        "loremoveflots 2000 Mision```"
    );
  } else {
    let quantity = parseInt(args[0]);
    insertQuantity(msg, args, quantity * -1);
  }
}

function insertQuantity(msg, args, quantity) {
  try {
    pool.query(
      "SELECT * FROM flots where discordID = ? order by transactionID DESC",
      [msg.author.id],
      (err, result) => {
        var balance = 0;
        if (err) console.log(err);
        if (result != null && Object.entries(result).length > 0) {
          balance = result[0].balance;
        }
        balance = balance + quantity;

        let description = msg.content
          .substring(msg.content.indexOf(args[1]))
          .trim();
        var date = new Date().toISOString();
        pool.query(
          "INSERT INTO flots (discordID, balance, quantity, dateofentry, description) VALUES (?, ?, ?, ?, ?)",
          [msg.author.id, balance, quantity, date, description],
          (err, result) => {
            if (err) console.log(err);
          }
        );
        msg.reply("```Balance: " + balance + " ```");
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function historyFlots(msg) {
  var page = 1;
  if (/(\d+)/.test(msg.content)) {
    page = msg.content.match(/(\d+)/)[1];
  }
  pool.query(
    "SELECT * FROM flots where discordID = ? order by transactionID DESC",
    [msg.author.id],
    (err, result) => {
      if (err) console.log(err);
      if (result != null && Object.entries(result).length > 0) {
        var i = 0;
        let message = new Discord.MessageEmbed().setColor("#58ACFA");
        for (var transaction in result) {
          var date = new Date(result[transaction].dateofentry);
          if (i == 0) {
            message.setTitle("Balance: " + result[transaction].balance, true);
          }
          if (i >= (page - 1) * 5 && i <= page * 5) {
            message.addField(
              "Description",
              result[transaction].description,
              true
            );
            message.addField("Quantity", result[transaction].quantity, true);
            message.addField(
              "Date",
              date.getDate() +
                "-" +
                (parseInt(date.getMonth()) + 1) +
                "-" +
                date.getFullYear(),
              true
            );
          }
          i++;
        }
        sendChannelMessage(msg, message);
      } else {
        sendChannelMessage(msg, "No transactions");
      }
    }
  );
}

function insertNewWalker(newWalker, discordid) {
  try {
    pool.query(
      "SELECT * FROM walkers where walkerID = " + newWalker.walkerID,
      (err, result) => {
        if (err) console.log(err);
        var date = new Date().toISOString().slice(0, 19).replace("T", " ");
        if (result != null && Object.entries(result).length > 0) {
          pool.query(
            "update walkers set discorid = ?, name = ?, lastUser=?, datelastuse=? where walkerID = ?",
            [
              discordid,
              newWalker.name,
              newWalker.lastUser,
              date,
              newWalker.walkerID,
            ],
            (err, result) => {
              if (err) console.log(err);
              console.log("Walker actualizado");
            }
          );
        } else {
          pool.query(
            "INSERT INTO walkers (walkerID, discorid, name, lastUser, datelastuse) VALUES (?, ?, ?, ?, ?)",
            [
              newWalker.walkerID,
              discordid,
              newWalker.name,
              newWalker.lastUser,
              date,
            ],
            (err, result) => {
              if (err) console.log(err);
              console.log("Nuevo walker insertado");
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function showInfo(msg) {
  var message = new Discord.MessageEmbed()
    .setColor("#008FFF")
    .setTitle("LO BOT")
    .setURL("https://github.com/dm94/lastoasisbot")
    .setAuthor(
      "Dm94Dani",
      "https://comunidadgzone.es/wp-content/uploads/2020/08/FENIX-dm94dani.png",
      "https://github.com/dm94"
    )
    .setDescription(
      "Discord Bot for Last Oasis" +
        "\nTo add the bot to your discord: https://discordapp.com/oauth2/authorize?&client_id=715948052979908911&scope=bot&permissions=67584" +
        "\nDm94Dani Discord: https://discord.gg/FcecRtZ"
    );
  sendChannelMessage(msg, message);
}

function sendChannelMessage(msg, text) {
  try {
    msg.channel.send(text);
  } catch (error) {
    console.log(error);
  }
}

function replyWalkerList(msg, sql) {
  var page = 1;
  if (/(\d+)/.test(msg.content)) {
    page = msg.content.match(/(\d+)/)[1];
  }
  pool.query(sql, (err, result) => {
    if (err) console.log(err);
    if (result != null && Object.entries(result).length > 0) {
      var i = 0;
      for (var walker in result) {
        var date = new Date(result[walker].datelastuse);
        let message = new Discord.MessageEmbed()
          .setColor("#58ACFA")
          .setTitle(result[walker].name);
        message.addField("Walker ID", result[walker].walkerID, true);
        message.addField("Last User", result[walker].lastUser, true);
        message.addField(
          "Last use",
          date.getDate() +
            "-" +
            (parseInt(date.getMonth()) + 1) +
            "-" +
            date.getFullYear(),
          true
        );
        if (result[walker].ownerUser === "null" || !result[walker].ownerUser) {
          message.addField("Owner", "Not defined", true);
        } else {
          message.addField("Owner", result[walker].ownerUser, true);
        }
        if (i >= (page - 1) * 5 && i <= page * 5) {
          sendChannelMessage(msg, message);
        }
        i++;
      }
    } else {
      sendChannelMessage(msg, "No hay ningun walker \nThere are no walkers");
    }
  });
}
