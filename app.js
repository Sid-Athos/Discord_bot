const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const search = require('youtube-search');
//const streamOptions = { seek: 0, volume: 0.25 };
var objet = {
    channel : "",
    list : [],
    playlist : []
}
const fs = require('fs');
var token = JSON.parse(fs.readFileSync("./token.json", 'utf-8'));

bot.login(token.key);
var prefix = token.prefix;

async function play(co, url, msg) {
    objet.dispatcher = co.playStream(ytdl(url,
        { filter: "audioonly", quality: "highestaudio", liveBuffer: 40000 }));
    objet.dispatcher.on("end", function () {
        objet.list.splice(0, 1);
        objet.playlist.splice(0, 1);
        if (objet.list[0]) {

            if (objet.list.length > 0) {
                let e = new Discord.RichEmbed();
                e.addField("Now Playing", objet.playlist[0]);
                msg.channel.send(e);
                play(co, objet.list[0], msg);
            }
            else {
                co.disconnect();
            }
        } else {
            co.disconnect();
        }

    });
}

bot.on('ready', function () {
    bot.user.setActivity(",help en cas de soucis")
    console.log("Je suis connecté !")
});

bot.on('message',async message => {

if (message.content.startsWith(`${prefix}purge`)) { // This time we have to use startsWith, since we will be adding a number to the end of the command.
        // We have to wrap this in an async since awaits only work in them.
        async function purge() {
            /*if (!message.member.roles.find("name", "Golden Trio || ADMIN")) {
                message.channel.send("Vous n'avez pas le rôle approprié pour lancer cette commande.\nVous devez avoir le rôle 'Golden Trio || ADMIN' !");
                return;
            }*/
            message.delete();
            let args = message.content.split(" ");
            if(args[1]) {
                args[1] = Number(args[1]);
                if(isNaN(args[1])) {
                    message.channel.send("Vous n'avez pas saisi d'arguments.\nLa commande fonctionne comme ça : ,purge nb_messages.");
                    return;
                }
                const fetched = await message.channel.fetchMessages({ limit:args[1] });
                console.log(fetched.size + ' messages trouvés, suppression en cours...');

                message.channel.bulkDelete(fetched).catch(error => message.channel.send('Error : ${error}'));
            } else {
                message.reply("Veuillez fournir un argument") ;
            }

        }

        // We want to make sure we call the function whenever the purge command is run.
        purge(); // Make sure this is inside the if(msg.startsWith)

}

if (message.content.startsWith(`${prefix}roll`)) {
    async function dice() {
        // on stocke le résultat du dé dans une variable
        var result = Math.floor(Math.random() * 6 + 1);

        message.channel.send("```Vous avez fait un " + result + " !```");
        // on fait un modulo pour savoir si le nombre est impair ou non
        if(result === 1 || result === 4){
            message.member.addRole(message.guild.roles.find(role => role.id === "646112365879885874"));
            message.channel.send("```Vous êtes dans la Coalition d'Alya```");
        }else if(result === 2 || result === 6){
            message.member.addRole(message.guild.roles.find(role => role.name === "Coalition de Becca"));
            message.channel.send("```Vous êtes dans la Coalition de Becca```");
        }else{
            message.member.addRole(message.guild.roles.find(role => role.name === "Terre Neutre"));
            message.channel.send("```Vous êtes en Terre Neutre```");
        }
    }
    if (message.member.roles.find(role => role.name === "Coalition de Becca" || role.id === "646112365879885874" || role.name === "Terre Neutre") !== null) {
        message.member.send("```Vous avez déjà une Coalition```");
        console.log("Vous avez déjà une Coalition");
        console.log(message.member.roles.find(role => role.name === "Coalition de Becca" || role.id === "646112365879885874" || role.name === "Terre Neutre") !== null);
    } else {
        dice() ;
    }
}

if (message.content.startsWith(`${prefix}weather`)) {

        async function weather() {
            var date1 = new Date().toString().split(" ")[1];
            let Nash = '648205663721226243' ;
            let arkson = '648205741609451559' ;
            let elky = '648205821486039060' ;
            let nework = '648206438178488321' ;
            let polis = '648207154511347750' ;
            let arkadia = '648207387064532992' ;
            let dc = '648207812542988289' ;
            var cities = [Nash, arkson, elky, nework, polis, arkadia, dc] ;

            for(let i = 0; i < cities.length; i++) {
                let temperature;
                let season = new Date().getMonth();
                if (date1 === "Dec" || date1 === "Jan" || date1 === "Feb") {
                    temperature = Math.floor(Math.random() * 8 - 12) ;
                    season = "hiver" ;
                }else if (date1 === "Mar" || date1 === "Apr" || date1 === "May") {
                    temperature = Math.floor(Math.random() * 27 + 10) ;
                    season = "printemps" ;
                }else if (date1 === "Jun" || date1 === "Jul" || date1 === "Aug") {
                    temperature = Math.floor(Math.random() * 38 + 16) ;
                    season = "été" ;
                }else if (date1 === "Sep" || date1 === "Oct" || date1 === "Nov") {
                    temperature = Math.floor(Math.random() * 23 + 5) ;
                    season = "automne" ;
                }
                
                bot.guilds.find(guild => guild.id === "587685235567755292")
                .channels.find(channel => channel.id === cities[i]).send("Bonjour citoyens de " + 
                bot.guilds.find(guild => guild.id === "587685235567755292").channels.find(channel => 
                    channel.id === cities[i]).name + " il fait " + temperature + "°C et nous sommes en "+season+" !");
                    
            }
    }

    weather() ;
}

if ((message.content === "omelette")) {
    message.channel.send("```*Casse les oeufs, les mets dans la poëlle, ajoute la garniture et la sert. Se lève et va la servir.* Voici votre omelette ! Bon appétit !```") ;
}

if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send("```Voici les commandes que je comprend :"+
    "\n_________________________________________________________________________________"+
    "\nCommandes Rôle Play :"+
    "\n\t ,roll = lancé de dés"+
    "\n\t ,weather = météo"+
    "\n_________________________________________________________________________________"+
    "Commandes Générales :"+
    "\n\t ,help = aide commande"+
    "\n\t ,play = jouer de la musique\n\t ,remove = supprimer une musique\n\t ,list = affiche playlist en cours\n\t ,name = affiche mon nom```");
}

if ((message.content === "Bonjour") || (message.content === "Heya") || (message.content === "Salut")) {
    message.channel.send("```Bonjour jeune padawan !```") ;
}else if ((message.content === "Bonne nuit") || (message.content === "Nenuit")) {
    message.channel.send("```Bonne nuit tout le monde !```")
}

if (message.content.startsWith(`${prefix}name`)) {
    async function name() {
        message.channel.send("```Salut ! Je m'appelle Nazeo et je gère beaucoup de choses ici. Si vous voulez savoir ce que je fais, utlisez la commande ',help'.```");
        message.react(":slight_smile:");
    }
    name();
}

if (message.content.startsWith(`${prefix}play`)) {
    
    let args = message.content.split(" ");
    if (args.length === 1) {
        message.channel.send("```Vous n'avez pas saisi d'arguments.\nLa commande fonctionne comme ça : ,play nom_musique.```");
        return;
    } else {
        if (!message.member.voiceChannel) {
            message.reply("mets toi dans un channel vocal !");
            return;
        }

        if (!objet.channel) {
            objet.channel = message.member.voiceChannel.id;
            objet.list = [];
        }
        if(!args[1].startsWith("http"))
        {
            let options = {
                maxResults: 1,
                key: "AIzaSyAUyx_PLi5hpPY1fmN6MRRCw1tuN3IEdG4"
            }
            let searchQuery = "";
            for(let i = 1; i < args.length;i++)
            {
                searchQuery += args[i]+"+";

            }
            var url = await search(searchQuery, options);
            url = url.results[0].link;
        } else {
            var url = args[1];
        }
        objet.list.push(url);
        let inf = await ytdl.getInfo(url);
        
        objet.playlist.push(inf.title);

        if (message.member.voiceChannel.id != objet.channel) {
            message.reply("le bot est déjà occupé !");
            return;
        }

        if(!objet.dispatcher)
        {
            message.member.voiceChannel.join().then(function (connection) {
                    play(connection, objet.list[0],message);
                    console.log(objet.dispatcher);
                });
        }
    }
}
if (message.content.startsWith(`${prefix}stop`)) {
    objet.list = [];
    objet.dispatcher.end();
    delete objet.dispatcher;
}

if (message.content.startsWith(`${prefix}skip`)) {
    objet.dispatcher.end();
}

if (message.content.startsWith(`${prefix}remove`)) {
    async function remove() {
        let args = message.content.split(" ");
            if(args.length === 1) {
                message.channel.send("```Vous n'avez pas saisi d'arguments.\nLa commande fonctionne comme ça : ,remove id_musique.```");
                return;
            }
            if(objet.list.length >= Number(args[1])){
                objet.list.splice(Number(args[1])-1,1);
                message.channel.send("```Musique supprimée```");
            }else{
                message.channel.send("```Playlist inexistante```");
                return;
            }
    }
    remove();
}

if (message.content.startsWith(`${prefix}list`)) {
    async function list() {
        message.channel.send(objet.playlist);
    }
    list();
}

if (message.content.startsWith(`${prefix}disconnect`)) {
    async function disconnect() {
        message.member.voiceChannel.leave(connection => {
            message.member.voiceConnection.disconnect();
            objet = {} ;
        });
    }
    disconnect();
}
});