var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

c.height = window.innerHeight;
c.width = window.innerWidth;

//Setup up map
var MAP_HEIGHT = 20,
    MAP_WIDTH = 20;

var map = [];
for(var i = 0;i < MAP_HEIGHT;i++)
{
    map[i] = [];
}
map[0] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
map[1] = [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2];
map[2] = [2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[3] = [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[4] = [2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2];
map[5] = [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[6] = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[7] = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[8] = [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2];
map[9] = [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2];
map[10] =[2, 0, 0, 3, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2];
map[11] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[12] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
map[13] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2];
map[14] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2];
map[15] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2];
map[16] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2];
map[17] =[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2];
map[18] =[2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2];
map[19] =[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

//Setup character object
var character = {
    x: c.width / 2,
    y: (c.height / 2) + 100,
    r: 25,
    angle: 0
};

//Define all rays
var rays = [];
for(var i = 0;i < 300;i++)
{
    rays[i] = {
        x: 0,
        y: 0,
        z: 0,
        travelling: false,
        hit: false,
        type: 0
    };
}

//Seperate sprite rays so that walls can be seen behind sprites
var spriteRays = [];
for(var i = 0;i < 300;i++)
{
    spriteRays[i] = {
        x: 0,
        y: 0,
        travelling: false,
        hit: false,
        type: 0
    };
}
var enemy = { rendered: false };

//GET INPUT
var turningLeft = false,
    turningRight = false,
    movingUp = false,
    movingDown = false;

window.addEventListener('keydown', handleKeyDown, true);
window.addEventListener('keyup', handleKeyUp, true);
function handleKeyDown(e)
{
    switch(e.keyCode)
    {
        case 87: movingUp = true;
            break;
        case 83: movingDown = true;
            break;
        case 65: turningLeft = true;
            break;
        case 68: turningRight = true;
            break;
    }
}
function handleKeyUp(e)
{
    switch(e.keyCode)
    {
        case 87: movingUp = false;
            break;
        case 83: movingDown = false;
            break;
        case 65: turningLeft = false;
            break;
        case 68: turningRight = false;
            break;
    }
}

let time = new Date().getTime();
function gameLoop()
{
    const newTime = new Date().getTime();
    if (newTime - time >= 16.7) {
      render();
      time = newTime;
    }
    update();
    
    window.requestAnimationFrame(gameLoop);
}

function update()
{  
        
    //Allow movement
    if(movingUp)
    {
        if(!detectCharacterCollision(character.x + Math.cos(character.angle) * 2, character.y))
        {
            character.x += Math.cos(character.angle) * 5;
        }
        if(!detectCharacterCollision(character.x, character.y + Math.sin(character.angle) * 2))
        {
            character.y += Math.sin(character.angle) * 5;
        }
    }
    if(movingDown)
    {
        if(!detectCharacterCollision(character.x - Math.cos(character.angle) * 2, character.y))
        {
            character.x -= Math.cos(character.angle) * 3;
        }
        if(!detectCharacterCollision(character.x, character.y - Math.sin(character.angle) * 2))
        {
            character.y -= Math.sin(character.angle) * 3;
        }
    }
    if(turningLeft)
    {
        character.angle -= (Math.PI / 180);
    }
    if(turningRight)
    {
        character.angle += (Math.PI / 180);
    }
        
    //Cast ray
    for(var i = 0;i < rays.length;i++)
    {
        rays[i] = {
            startX: character.x,
            startY: character.y,
            x: character.x,
            y: character.y,
            angle: (i * ((Math.PI / 180) * 60) / rays.length) - (((Math.PI / 180) * 60) / 2),
            travelling: true,
            hit: false,
            type: 0
        };
        
        //Until the ray hits a wall
        while(rays[i].travelling)
        {
            //Detect if ray has hit a wall
            var collision = detectRayCollision(rays[i].x, rays[i].y);
            //Collision has the type of wall which was collided with (0 for no wall)
            switch(collision)
            {
                case 1:
                    rays[i].travelling = false;
                    rays[i].hit = true;
                    rays[i].type = 1;
                    break;
                case 2:
                    rays[i].travelling = false;
                    rays[i].hit = true;
                    rays[i].type = 2;
                    break;
                case 3:
                    rays[i].startX = rays[i].x;
                    rays[i].startY = rays[i].y;
                    rays[i].angle = rays[i].angle + ((Math.PI / 180) * 10);
                    rays[i].x += Math.cos(character.angle + rays[i].angle) * 1.5;
                    rays[i].y += Math.sin(character.angle + rays[i].angle) * 1.5;
                    break;
                default:
                    rays[i].x += Math.cos(character.angle + rays[i].angle) * 1.5;
                    rays[i].y += Math.sin(character.angle + rays[i].angle) * 1.5;
                    break;
            }
            
        }
    }
    
    //Cast sprite rays
    for(var i = 0;i < spriteRays.length;i++)
    {
        spriteRays[i] = {
            x: character.x,
            y: character.y,
            angle: (i * ((Math.PI / 180) * 60) / spriteRays.length) - (((Math.PI / 180) * 60) / 2),
            travelling: true,
            hit: false,
            type: 0,
            rendered: false
        };
        
        while(spriteRays[i].travelling)
        {
            var collision = detectRayCollision(spriteRays[i].x, spriteRays[i].y);
            switch(collision)
            {
                case 1:
                    spriteRays[i].travelling = false;
                    break;
                case 2:
                    spriteRays[i].travelling = false;
                    break;
                case 3:
                    spriteRays[i].travelling = false;
                    spriteRays[i].hit = true;
                    spriteRays[i].type = 3;
                    break;
                default:
                    spriteRays[i].x += Math.cos(character.angle + spriteRays[i].angle) * 1.5;
                    spriteRays[i].y += Math.sin(character.angle + spriteRays[i].angle) * 1.5;
                    break;
            }
        }
    }
}

function detectRayCollision(x, y)
{
    return map[Math.trunc(y / (c.height / MAP_HEIGHT))][Math.trunc(x / (c.width / MAP_WIDTH))];
}

function detectCharacterCollision(x, y)
{
    if(map[Math.trunc(y / (c.height / MAP_HEIGHT))][Math.trunc(x / (c.width / MAP_WIDTH))] == 0)
    {
        return false;
    }
    else
    {
        return true;
    }
}

function getTime()
{
    var date = new Date();
    return date.getTime();
}

function render()
{
    ctx.clearRect(0, 0, c.width, c.height);
    
    //Skybox
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height / 2);
    ctx.fillStyle = 'rgb(135,206,250)';
    ctx.fill();
    ctx.closePath();
    
    //Floor
    ctx.beginPath();
    ctx.rect(0, c.height / 2, c.width, c.height / 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
    
    for(var i = 0;i < rays.length;i++)
    {
        var dx = rays[i].x - character.x;
        var dy = rays[i].y - character.y;
        var angle = Math.atan2(dy, dx);
        rays[i].dist = Math.sqrt((dy * dy) + (dx * dx));
        var z = rays[i].dist * Math.cos(angle - character.angle);
        
        ctx.beginPath();
        
        //Set color (or texture) for wall
        if(rays[i].type == 1)
        {
            ctx.fillStyle = 'grey';
        }
        else if(rays[i].type == 2)
        {
            ctx.fillStyle = 'orange';
        }
        else if(rays[i].type == 3)
        {
            ctx.fillStyle = 'blue';
        }
        
        ctx.fillRect(i * (c.width / rays.length), (c.height / 2) - ((c.height / (z / 200)) / 2), c.width / rays.length + 1, c.height / (z / 200));
        
        ctx.closePath();
        
        //Anti-aliasing
        if(i < rays.length - 1)
        {
            if(rays[i].hit && rays[i + 1].hit)
            {
                if(rays[i].dist < rays[i + 1].dist)
                {
                    //Top of column
                    ctx.beginPath();
                        ctx.moveTo((c.width / rays.length) * i + (c.width / rays.length) + 1, (c.height / 2) - (c.height / (rays[i].dist / 200)) / 2);
                        ctx.lineTo(((c.width / rays.length) * (i + 1)) + (c.width / rays.length) + 1, (c.height / 2) - (c.height / (rays[i + 1].dist / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * i, c.height / 2);
                        ctx.fillStyle = 'grey';
                        ctx.fill();
                    ctx.closePath();
                    
                    //Bottom of column
                    ctx.beginPath();
                        ctx.moveTo((c.width / rays.length) * i + (c.width / rays.length) + 1, (c.height / 2) + (c.height / (rays[i].z / 200)) / 2);
                        ctx.lineTo(((c.width / rays.length) * (i + 1)) + (c.width / rays.length) + 1, (c.height / 2) + (c.height / (rays[i + 1].z / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * i, c.height / 2);
                        ctx.fillStyle = 'grey';
                        ctx.fill();
                    ctx.closePath();
                }
                else
                {
                    ctx.beginPath();
                        ctx.moveTo((c.width / rays.length) * i, (c.height / 2) - (c.height / (rays[i].z / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * (i + 1), (c.height / 2) - (c.height / (rays[i + 1].z / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * i, c.height / 2);
                        ctx.fillStyle = 'grey';
                        ctx.fill();
                    ctx.closePath();
                    
                    ctx.beginPath();
                        ctx.moveTo((c.width / rays.length) * i, (c.height / 2) + (c.height / (rays[i].z / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * (i + 1), (c.height / 2) + (c.height / (rays[i + 1].z / 200)) / 2);
                        ctx.lineTo((c.width / rays.length) * (i + 1), c.height / 2);
                        ctx.fillStyle = 'grey';
                        ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    
    //Render minimap
    ctx.globalAlpha = 0.5;
    for(var i = 0;i < MAP_WIDTH;i++)
    {
        for(var j = 0;j < MAP_HEIGHT;j++)
        {
            if(map[j][i] == 0)
            {
                ctx.fillStyle = 'black';
            }
            else if(map[j][i] == 1)
            {
                ctx.fillStyle = 'grey';
            }
            else if(map[j][i] == 2)
            {
                ctx.fillStyle = 'orange';
            }
            else if(map[j][i] == 3)
            {
                ctx.fillStyle = 'blue';
            }
            
            ctx.beginPath();
            ctx.fillRect(i * (c.width / 200), j * (c.width / 200), c.width / 200, c.width / 200);
            ctx.closePath();
        }
    }
    ctx.globalAlpha = 1;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for(var i = 0;i < rays.length;i++)
    {
        ctx.beginPath();
        ctx.moveTo((rays[i].startX / c.width) * (MAP_WIDTH * (c.width / 200)), (rays[i].startY / c.height) * (MAP_HEIGHT * (c.width / 200)));
        ctx.lineTo((rays[i].x / c.width) * (MAP_WIDTH * (c.width / 200)), (rays[i].y / c.height) * (MAP_HEIGHT * (c.width / 200)));
        ctx.stroke();
        ctx.closePath();
    }
    
    ctx.fillStyle = 'green';
    
    ctx.beginPath();
    ctx.arc((character.x / c.width) * (MAP_WIDTH * (c.width / 200)), (character.y / c.height) * (MAP_HEIGHT * (c.width / 200)), (c.width / 200) / 2, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

window.requestAnimationFrame(gameLoop);
