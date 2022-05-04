# Last Oasis Discord bot

## [![Discord Bots](https://top.gg/api/widget/servers/715948052979908911.svg)](https://top.gg/bot/715948052979908911)

Discord Bot for Last Oasis

To add the bot to your discord: https://discord.com/api/oauth2/authorize?client_id=715948052979908911&permissions=2147552256&scope=bot%20applications.commands

Example: https://twitter.com/Dm94Dani/status/1293121001421705216

Currently all commands with ! are deprecated and / must be used.

- !locraft = With this command you can see the materials needed to make an object.
  Example of use: !locraft Barrier Base
  If you want to see the materials to make 10: !locraft 10x Barrier Base
- !loinfo = Displays bot information.
- !lorecipe (code) = Displays the list of recipes for that code
- !lowalkerinfo (id) = Shows the information of a specific walker
- !walkersearch = To search for a walker or several walkers, has different filters: -page=, -name=, -owner=, -lastuser=, -ready, -pvp, -farming
  An example of use: !walkersearch -page=1 -name=walker -ready -pvp
  This will bring out all the walkers that are called walker are pvp and ready
- !tradesearch = To perform a search for trades, has different filters: -page=, -type=, -resource=, -region=
  An example of use: !tradesearch -page=1 -type=demand -type=cattail -region=eu
- !createtrade = To create a trade, has different parameters: -type=Supply|Demand, -resource=, -region=EU|NA|OCE|RUSSIA|SEA|SA, -quality, -price, -amount
  An example of use: !createtrade -type=supply -region=eu -resource=bone splinter -quality=100 price=200
- !skilltree = It will tell you which members of your clan have learned that item.
  Example of use: !skilltree Desert Mule
- !learned = Add the item to the list of learned items.
  Example of use: !learned Desert Mule
