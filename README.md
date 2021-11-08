# Last Oasis Discord bot

Discord Bot for Last Oasis

To add the bot to your discord: https://discord.com/api/oauth2/authorize?client_id=715948052979908911&permissions=2147552256&scope=bot%20applications.commands

Example: https://twitter.com/Dm94Dani/status/1293121001421705216

[EN]

- !locraft = With this command you can see the materials needed to make an object.
  Example of use: !locraft Barrier Base
  If you want to see the materials to make 10: !locraft 10x Barrier Base
- !loinfo = Displays bot information.
- !lorecipe (code) = Displays the list of recipes for that code
- !lolistwalkers (page) = Shows all the walkers added since this discord. Each page is 5 walkers (Obsolete)
- !lowalkerinfo (id) = Shows the information of a specific walker
- !lowalkersearchbyname (name) = Shows all walkers with that name (Obsolete)
- !lowalkersearchbyowner (name) = Show all walkers with that owner (Obsolete)
- !lowalkersearchbylastuser (name) = Shows all the walkers that person has used (Obsolete)
- !walkersearch = To search for a walker or several walkers, has different filters: -page=, -name=, -owner=, -lastuser=, -ready, -pvp, -farming
  An example of use: !walkersearch -page=1 -name=walker -ready -pvp
  This will bring out all the walkers that are called walker are pvp and ready
- !tradesearch = To perform a search for trades, has different filters: -page=, -type=, -resource=, -region=
  An example of use: !tradesearch -page=1 -type=demand -type=cattail -region=eu
- !createtrade = To create a trade, has different parameters: -type=Supply|Demand, -resource=, -region=EU|NA|OCE|RUSSIA|SEA|SA, -quality, -price, -amount
  An example of use: !createtrade -type=supply -region=eu -resource=bone splinter -quality=100 price=200
- !loconfig = Shows all the info for the bot config (Only for admins)
