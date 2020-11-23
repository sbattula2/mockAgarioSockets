//this file is server side socket

const io = require('../servers').io

const Orb = require('./classes/orbs')
const PlayerData = require('./classes/PlayerData')
const PlayerConfig = require('./classes/PlayerConfig')
const Player = require('./classes/Player')

const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions

let players = []
let locXNums = []

let orbs = []

let settings = {
    defaultOrbs: 50,
    defaultSpeed: 6,
    defaultSize: 6,

    //as player gets bigger, you need to zoom out
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
}

initGame()

setInterval(()=>{
    io.to('game').emit('tock',{
        players
    })
},33);

io.sockets.on('connect',(socket)=>{
    let serverPlayer = {}

    socket.on('init',(data)=>{ 

        socket.join('game');
            //make player config and player data objects
        let playerConfig = new PlayerConfig(settings);
        let playerData = new PlayerData(data.playerName,settings);
        
        //tie together player data and config in player object
        serverPlayer = new Player(socket.id,playerConfig,playerData);
        //send message to every connected socket at 30 FPS

        //console.log(data.playerName)
        //console.log(playerData)

        // setInterval(()=>{
        //     io.to('game').emit('tock',{
        //         players,
        //         playerX: serverPlayer.playerData.locX,
        //         playerY: serverPlayer.playerData.locY
        //     })
        // },33);

        setInterval(()=>{
            socket.emit('tickTock',{
                playerX: serverPlayer.playerData.locX,
                playerY: serverPlayer.playerData.locY
            });
        },33); //there are 30 33's in 1000 milliseconds

        socket.emit('initReturn',{
            orbs
        })
        players.push(playerData)
    })

    //player sent over tick
    socket.on('tick',(data)=>{

        speed = serverPlayer.playerConfig.speed;

        serverPlayer.playerConfig.xVector = data.xVector;
        serverPlayer.playerConfig.yVector = data.yVector;

        xV = serverPlayer.playerConfig.xVector;
        yV = serverPlayer.playerConfig.yVector;

        if((serverPlayer.playerData.locX<5&&serverPlayer.playerData.xVector<0)||(serverPlayer.playerData.locX>settings.worldWidth&&xV>0)){
            serverPlayer.playerData.locY -= speed * yV;
    
        }else if((serverPlayer.playerData.locY<5&&yV>0)||(serverPlayer.playerData.locY>settings.worldHeight&&yV<0)){
            serverPlayer.playerData.locX += speed * xV;
        }else{
            serverPlayer.playerData.locX += speed * xV;
            serverPlayer.playerData.locY -= speed * yV;
        }

        //check for orb collisions

        let capturedOrb = checkForOrbCollisions(serverPlayer.playerData,serverPlayer.playerConfig,orbs,settings)
        capturedOrb.then((data)=>{

            //then runs if resolve runs
            //emit to all sockets the orb to replace

            //console.log(data)

            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            } 

            io.sockets.emit('updateLeaderBoard',getLeaderBoard())
            io.sockets.emit('orbSwitch',orbData)
        }).catch(()=>{
            //catch runs if reject runs
            //console.log("No collision");
        })

        //Check for player collisions

        let playerDeath = checkForPlayerCollisions(serverPlayer.playerData,serverPlayer.playerConfig,players,serverPlayer.socketId)
        playerDeath.then((data)=>{
            //console.log("Player Collision!")
            io.sockets.emit('updateLeaderBoard',getLeaderBoard())
            io.sockets.emit('playerDeath',data);

        }).catch(()=>{

        });

});

socket.on('disconnect',(data)=>{
    // console.log(data)
    // find out who just left... which player in players
    // make sure the player exists
    if(serverPlayer.playerData){
        players.forEach((currPlayer,i)=>{

            // if they match...
            if(currPlayer.uid == serverPlayer.playerData.uid){

                // these are the droids we're looking for
                players.splice(i,1);
                io.sockets.emit('updateLeaderBoard',getLeaderBoard());
            }
        });
        const updateStats = `
        UPDATE stats
            SET highScore = CASE WHEN highScore < ? THEN ? ELSE highScore END,
            mostOrbs = CASE WHEN mostOrbs < ? THEN ? ELSE mostOrbs END,
            mostPlayers = CASE WHEN mostPlayers < ? THEN ? ELSE mostPlayers END
        WHERE username = ?
        `
    }
})
})



function getLeaderBoard(){
    // sort players in desc order
    players.sort((a,b)=>{
        return b.score - a.score;
    });
    let leaderBoard = players.map((curPlayer)=>{
        return{
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    
    return leaderBoard
}


function initGame(){

    for(let i=0;i<settings.defaultOrbs;i++){
        orbs.push(new Orb(settings))

    }

}


module.exports = io
