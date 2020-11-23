
//DRAWINGHEREDRAWINGHEREDRAWINGHEREDRAWINGHERE
//DRAWINGHEREDRAWINGHEREDRAWINGHEREDRAWINGHERE
//DRAWINGHEREDRAWINGHEREDRAWINGHEREDRAWINGHERE  
  

function draw(){
    

    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,canvas.width,canvas.height);


    const camX = -player.locX + canvas.width/2
    const camY = -player.locY + canvas.height/2

    //this essentially moves over the whole view
    context.translate(camX,camY)

    players.forEach((p)=>{
        //put down the pencil
        context.beginPath();

        //give the pencil a red color
        context.fillStyle = p.color;

        //give arguments of the arc. First 2 are the x,y arguments of the center of the arc
        //Now give radius of the circle
        context.arc(p.locX,p.locY,p.radius,0,Math.PI*2);
        context.fill();

        //now add border to the circle
        //context.arc(randomX,randomY,)
        context.lineWidth = 3;
        context.strokeStyle = "rgb(0,255,0)";
        context.stroke();
    });

    orbs.forEach((orb)=>{
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX,orb.locY,orb.radius,0,Math.PI*2)
        context.fill()
    })

    //This keeps re rendering
    requestAnimationFrame(draw);
}

//records everytime the mouse is moved, it initiates some angle logic
canvas.addEventListener('mousemove',(event)=>{
        

    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        // console.log("Mouse is in the lower right quad")
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        // console.log("Mouse is in the lower left quad")
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        // console.log("Mouse is in the upper left quad")
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        // console.log("Mouse is in the upper right quad")
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }


    if(xVector==null||yVector==null){
        console.log('Fuck Vectors');
    }       

    player.xVector = xVector;
    player.yVector = yVector;

   
})