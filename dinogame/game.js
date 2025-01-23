const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    jumping: false,
    jumpForce: 12,
    gravity: 0.5,
    velocity: 0,
    maxJumpHeight: 120
};

const obstacles = [];
let gameSpeed = 7;
let score = 0;
let maxScore = 0;  // Add max score variable
let gameOver = false;

// Spawn obstacles
function spawnObstacle() {
    // Check if there's enough space for a new obstacle
    const lastObstacle = obstacles[obstacles.length - 1];
    if (lastObstacle && lastObstacle.x > canvas.width - (player.width * 4)) {
        return; // Increased minimum spacing
    }

    // Calculate max possible obstacle height based on jump physics
    const maxHeight = player.maxJumpHeight * 0.7;  // 70% of max jump height
    const minHeight = 30;
    
    // Make heights more varied but always possible to jump over
    let height;
    const heightRange = maxHeight - minHeight;
    const randomValue = Math.random();
    
    if (randomValue < 0.6) {  // 60% chance for lower obstacles
        height = minHeight + (heightRange * 0.4 * Math.random());
    } else {  // 40% chance for higher obstacles
        height = minHeight + heightRange * 0.4 + (heightRange * 0.3 * Math.random());
    }

    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 20,  // Slightly wider obstacles
        height: height
    });
}

// Add double jump capability
let canDoubleJump = true;

// Handle jumping
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (!player.jumping) {
            player.jumping = true;
            player.velocity = -player.jumpForce;
            canDoubleJump = true;
        } else if (canDoubleJump) {
            player.velocity = -player.jumpForce * 0.8;  // Slightly weaker double jump
            canDoubleJump = false;
        }
    }
});

// Game loop
function update() {
    if (gameOver) return;

    // More gradual speed increase
    gameSpeed = 2 + Math.floor(score / 100) * 0.3;  // Slower speed progression

    // Update player
    if (player.jumping) {
        player.velocity += player.gravity;
        player.y += player.velocity;

        // Add small grace period for jumping after falling
        if (player.y > canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.jumping = false;
            player.velocity = 0;
        }
    }

    // Update obstacles - modified spawn rate
    const lastObstacle = obstacles[obstacles.length - 1];
    if (!lastObstacle || 
        (lastObstacle.x <= canvas.width - (player.width * 4) && Math.random() < 0.008)) {
        spawnObstacle();
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Collision detection
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
        }
    });
}

// Draw game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'black';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw scores and instructions
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Max Score: ${maxScore}`, 10, 60);
    
    // Add instruction text - centered at the top
    ctx.font = '16px Arial';
    const instructionText = 'Press SPACE to jump, double press for higher jump!';
    const textWidth = ctx.measureText(instructionText).width;
    const centerX = (canvas.width - textWidth) / 2;
    ctx.fillText(instructionText, centerX, 30);

    if (gameOver) {
        // Update max score when game ends
        maxScore = Math.max(maxScore, score);
        
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width/2 - 100, canvas.height/2);
        
        // Draw final score
        ctx.font = '25px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2 - 70, canvas.height/2 - 50);
        
        // Draw reload button
        ctx.fillStyle = 'black';
        ctx.fillRect(canvas.width/2 - 50, canvas.height/2 + 20, 100, 40);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Reload', canvas.width/2 - 30, canvas.height/2 + 45);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Add click handler for reload button
canvas.addEventListener('click', (event) => {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Check if click is within reload button bounds
        if (clickX >= canvas.width/2 - 50 && 
            clickX <= canvas.width/2 + 50 &&
            clickY >= canvas.height/2 + 20 && 
            clickY <= canvas.height/2 + 60) {
            // Reset game
            obstacles.length = 0;
            score = 0;
            gameSpeed = 2;
            gameOver = false;
            player.y = canvas.height - player.height;
            player.jumping = false;
            player.velocity = 0;
        }
    }
});

gameLoop(); 
