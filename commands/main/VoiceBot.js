//author : Mouhamad Jaber!
const Discord  = require('discord.js');
const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const oneLine = require('common-tags').oneLine;
const fetch = require('node-fetch');
const fs = require('fs');
const Sonus = require('sonus');
const speech = require('@google-cloud/speech');
const dialogflow = require('dialogflow');
const projectId = 'voicebot-194800';
var sox = require('sox-stream');
const rimraf = require('rimraf');

var exec = require('child_process').exec;


process.env.GOOGLE_APPLICATION_CREDENTIALS="/home/user/xxxx.json";

const apiKey = "xxxxxxxxxxxxxxxx";

const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US'
    },
    singleUtterance: false,
    interimResults: false,
  }

const client = new speech.SpeechClient({
    projectId: projectId,
    keyFilename: './JSON/VoiceBotJSON.json'
    });

const sessionId = '9f2334ef-b33c-4b72-b6bc-693a6d6a1712';

//const sessionId = 'session';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.

const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const hotwords = [
    {file: './hotwords/alexa.umdl', hotword: 'alexa'}

];

var audioStream, outputStream, dispatcher, active, key;
var sonus, inputStream, keyPhrase;
var volume = 1;

function generateOutputFile(channel, member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./temp_stream/${channel.id}-${member.id}-${Date.now()}.pcm`;
    
    return fs.createWriteStream(fileName);
  }
  
 
    module.exports = class SummonBot extends commando.Command {
	constructor(client) {
		super(client, {
            name: 'summon',
            aliases: ["alexa"],
			group: 'main',
			memberName: 'summon',
			description: 'Open communication with a bootleg Alexa',
			details: oneLine`
            Speak to Alexa. Say Alexa [play, stop, pause, resume, leave, join].
            Play audio from any youtube video.
            Control Volume by saying Volume Up or Down.
			`,
			examples: ['!summon', '!alexa', '!summon leave']
		});
    }

    async run(message, args) {

    if (!message.guild) return;
             //is the user in a channel
                if (message.member.voiceChannel)
                {
                    message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection

                            if (args === 'leave') 
                            {
                                connection.disconnect();
                            }      
                            else
                            {

                            message.channel.send('I\'m Listening');  
                                               
                            const receiver = connection.createReceiver();
                          // dispatcher = connection.playStream(ytdl("https://www.youtube.com/watch?v=DLHRN8yH1EQ&list=FLmlO1-A_rdEJgHtHKc4UEvQ&index=2&t=0s", {fitler: "audioonly"}));
                            connection.on('speaking', function(user, speaking) {
                                
                                sonus = Sonus.init({hotwords, recordProgram: "rec" }, client);   
                            
                                var transcode = sox({
                                    global: { G: true ,  guard: true, 'no-dither': true },
                                    input: {type: 'raw', e:'signed', bits: 32, rate: 48000, channels: 1},
                                    output: {type: 'raw', bits: 16, e: 'signed', rate: 16000, channels:1},
                                });
                                                           
                                 if (speaking)
                                 {
                                    console.log('Start');
                                        //creates read stream
                                        audioStream = receiver.createPCMStream(user); 

                                        console.log(receiver.destroyed);
                                      //  console.log(receiver.voiceConnection);
                                        receiver.on('pcm', function(e, d){
                                            //console.log(d);
                                        });

                                        // receiver.on('warn', function(e, d){
                                        //     console.log(e);
                                        //     console.log(d);
                                        // });
                                       
                                        // receiver.on('opus', function(e, d){
                                        //     console.log(d);
                                        // });
                                        outputStream = generateOutputFile(message.channel, user);
                                      // outputStream = fs.createWriteStream('./temp_stream/stream.pcm');
                                        inputStream = audioStream.pipe(transcode);
                                      
                                        inputStream.pipe(sonus.detector);
                                        inputStream.pipe(outputStream);
                                
                                        sonus.started = true;
                                        Sonus.start(sonus);
     
                                        sonus.on('hotword', function(index, keyword){
                                            console.log("\n   Hotword Detected: " , keyword);
                                            key = keyword;
                                    
                                          
                                        });
                                       
                             
                                       outputStream.on('finish', () => {  
                                       Sonus.stop(sonus);
                                        var child;
                                        exec("killall -9 rec", function (error, stdout, stderr) {
                                            // console.log(stdout);
                                            // console.log(stderr);
                                            // console.log(error);
                                        });

                                         switch(key)
                                         {
                                             case 'alexa':             
                                                 transcribe(connection, message, outputStream.path);
                                             break;
                                         }
                                         console.log('Stop');
                                         key = '';
                                         try { 
                                             rimraf('./temp_stream/*', function(){});
                                             }
                                         catch(error){}
                                         
                                     });    
                                }
                                                          
                            }); //connection on speakingnp
                    }//end else
                
                }).catch(err => console.error("VOICE Connection: " + err)); //connection instance of VoiceConnection
                        
            }//end  if (message.member.voiceChannel)
         
            else //user is not in a channel
            {
                message.reply('You need to join a voice channel first!');
            } 
    }//end async
}; //end command Summon

function puts(error, stdout, stderr) { sys.puts(stdout) }


function play(connection, video, message, keyPhrase){

   switch(video){

        case 'stop':
            dispatcher.end();
        break;

        case 'pauseMusic':
            dispatcher.pause();
        break;

        case 'resumeMusic':
            dispatcher.resume();
        break;

        case 'join':
            message.member.voiceChannel.join()
        break;

        case 'leave':
            dispatcher.end();
            message.member.voiceChannel.leave()
        break;

        case 'volumeUp':
            dispatcher.setVolume(dispatcher.volume + 0.5);
        
        break;

        case 'volumeDown':
            dispatcher.setVolume(dispatcher.volume - 0.5);
        break;

        //default:

      case 'play':
        
        dispatcher = connection.playStream(ytdl("https://www.youtube.com/watch?v=" + keyPhrase, {fitler: "audioonly"}));

        ytdl.getInfo("https://www.youtube.com/watch?v=" + keyPhrase, function(err, info) {
    
            const embed = new Discord.RichEmbed()
            .setTitle(info.title)
            .setAuthor(info.author.name, info.author.avatar)
            .setColor(0x4bf702)
            .setDescription(":notes:")
            .setURL(info.video_url)
            .setFooter(info.view_count + " Views")
            .setThumbnail(info.thumbnail_url)
            .setTimestamp()     
            message.channel.send({embed});        
        });      

        keyPhrase = '';
        break;

    
    // dispatcher.on('end', (reason) => {
    //     // The song has finished
    //     dispatcher.end();
    //     dispatcher = null;
    //     console.log("Stream has finished. " + reason);
    // });
    // dispatcher.on('error', function(error){
    //     dispatcher.end();
    //     dispatcher = null;
    //     console.log("Stream has an error. " + error);
    // });
    
    }//end switch
}

function playStart(connection){
    const dispatcher = connection.playFile('./sounds/wake.wav'); 
    dispatcher.setVolume(20);
    dispatcher.end();
}

function playEnd(connection){
    const dispatcher = connection.playFile('./sounds/end.wav');
    dispatcher.end();    
}


function transcribe(connection, message, currentStream){
  //  play(connection, 'fKopy74weus', message);
  audioStream.destroy();

  outputStream.destroy();

  inputStream.destroy();

    const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
        //remove the keyword and declare the intent
        var query  = data.results[0].alternatives[0].transcript.split(' ').slice(1).join(' ');

        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: query,
                languageCode: languageCode,
              },
            },
          };
            // Send request and log result
            sessionClient
            .detectIntent(request)
            .then(responses => {
            //console.log('Detected intent');
            const result = responses[0].queryResult;
            //console.log(`  Query: ${result.queryText}`);
            //console.log(`  Response: ${result.fulfillmentText}`);
            if (result.intent) {
                console.log(`   Intent: ${result.intent.displayName}`);
                switch(result.intent.displayName)
                {
                    case 'pauseMusic':
                    console.log(`   Pause: ${result.queryText}`);
                        key = 'pauseMusic'
                        play(connection, key, message);
                    break;
                    case 'resumeMusic':
                    console.log(`   Resume: ${result.queryText}`);
                        key = 'resumeMusic'
                        play(connection, key, message);
                    break;
                    case 'stop music':
                    console.log(`   Stop: ${result.queryText}`);
                       // playStart(connection);
                        key = 'stop'
                        play(connection, key, message);
                    break;
                    case 'volumeDown':
                    console.log(`   Volume Down: ${result.queryText}`);
                        key = 'volumeDown'
                        if (active)
                        {
                            play(connection, key, message);
                        }
                    break;
                    case 'volumeUp':
                    console.log(`   Volume Up: ${result.queryText}`);
                        key = 'volumeUp'
                        if (active)
                        {
                            play(connection, key, message);
                        }
                    break;
                    case 'playMusic':
                    console.log(`   Play: ${result.queryText.split(' ').slice(1).join(' ')}`);
                        //playStart(connection);
                        key = 'play'
                            findYoutubeVideo(result.queryText.split(' ').slice(1).join(' '), connection, message)
                            
                    break;
                }
            } else {
                console.log(`   No intent matched. Searching Youtube...`);
                //play music
                findYoutubeVideo(query, connection, message);
                active = true;
            }
            })
            .catch(err => {
            console.error('ERROR DialogFlow:', err);
            });
    });

    //input.pipe(recognizeStream);
    //fs.createReadStream('./temp_stream/stream.pcm').pipe(recognizeStream);
    fs.createReadStream(currentStream).pipe(recognizeStream);
}

function findYoutubeVideo(query, connection, message){
    keyPhrase = 'play';
    var requestUrl = 'https://www.googleapis.com/youtube/v3/search' +
        `?part=snippet&q=${escape(query)}&key=${apiKey}`;
        console.log("   Searching Youtube for: "+ query);
    
        fetch(requestUrl)
        .then(response => {
            response.json().then(json => {
                    //console.log(json);
                    for (var item of json.items) {
                        if (item.id.kind === 'youtube#video') {
                            var vid = item.id.videoId;
                            console.log("   Video Found: https://YouTube.com/watch?v=" + vid);
                            play(connection, keyPhrase, message, vid);
                            return;
                        }
                    }
            });
        }).catch(error => {
            console.log(error);
        });


}
