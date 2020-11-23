let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {}

let orbs = []
let players = []

let canvas = document.querySelector('#the-canvas');
let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;

//shows the login modal
$(window).load(()=>{
    $('#loginModal').modal('show');
});


//so when you usually submit a form, you load a new page. 
//But in this case, this is like 1 app, so we don't want to load a new page
$('.name-form').submit(()=>{
    event.preventDefault();
    //console.log('submitted!');
    player.name = document.querySelector('#name-input').value
    
    //after hitting submit, hides that login form
    $('#loginModal').modal('hide');

    //shows the game options panel
    $('#spawnModal').modal('show');
    document.querySelector('.player-name').innerHTML = player.name;
     
});    

$('.start-game').click((event)=>{
    $('.modal').modal('hide')
    $('.hiddenOnStart').removeAttr('hidden');
    init();
})