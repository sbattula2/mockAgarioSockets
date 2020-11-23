//this is the client side socket. When we connect to server, we send over the player name
let socket = io.connect('http://localhost:8080')

function init(){
    draw()
    socket.emit('init',{
        playerName: player.name
    })
}

//after connection and sending over name, server side will send over the orbs data
socket.on('initReturn',(data)=>{
    orbs = data.orbs

    setInterval(()=>{
        
        if(player.xVector==null){
            player.xVector = 0;
        }

        if(player.yVector==null){
            player.yVector = 0;
        }

        socket.emit('tick',{
            xVector: player.xVector,
            yVector: player.yVector
        })
    },33)
})

socket.on('tock',(data)=>{
    players = data.players

    // if(data.playerX!=null){

    //     player.locX = data.playerX;
        
    //     }
    
    // if(data.playerY!=null){
    
    //     player.locY = data.playerY;
            
    //     }
})

socket.on('orbSwitch',(data)=>{
    //console.log(data)
    //console.log()
    orbs.splice(data.orbIndex,1,data.newOrb)
    
    
})

socket.on('tickTock',(data)=>{
    if(data.playerX!=null){
                    
        player.locX = data.playerX;

        }
    
    if(data.playerY!=null){
    
        player.locY = data.playerY;
            
        }
})

socket.on('updateLeaderBoard',(data)=>{
    document.querySelector('.leader-board').innerHTML = ""; 

    for(const child of data){
        document.querySelector('.leader-board').innerHTML += `
        <li class="leaderboard-player">${child.name} - ${child.score}</li>
        `
    }

})

socket.on('playerDeath',(data)=>{
    console.log(`Got killed: ${data.died.name}`);
    console.log(`The killer: ${data.killedBy.name}`);
    document.querySelector('#game-message').innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`
    $("#game-message").css({
        "background-color": "#00e6e6",
        "opacity": 1
    });
    $("#game-message").show();
    $("#game-message").fadeOut(5000);

});