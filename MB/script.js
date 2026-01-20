const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CM_TO_PX = 4;
const QUADRATO_CM = 60;
const QUADRATO = {
    x: 180, y: 120, width: 240, height: 240
};

let robot = {
    x: QUADRATO.x + 12,
    y: QUADRATO.y + QUADRATO.height - 12,
    angle: 0, size: 20, speed: 0.4,
    running: false, 
    cycle: 0, 
    isM2Active: false
};

function drawRobot() {
    ctx.save();
    ctx.translate(robot.x, robot.y);
    ctx.rotate(robot.angle);
    
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-robot.size/2, -robot.size/2, robot.size, robot.size);
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 2;
    ctx.strokeRect(-robot.size/2, -robot.size/2, robot.size, robot.size);
    
    ctx.fillStyle = robot.isM2Active ? '#ff8c00' : '#444';
    ctx.fillRect(robot.size/2 - 3.5, -robot.size/2 + 5, 8, 6);
    ctx.fillStyle = robot.isM2Active ? '#ff8c00' : '#666';
    ctx.fillRect(-robot.size/2 - 5, -robot.size/2 + 5, 8, 6);
    
    ctx.restore();
}

function drawPath() {
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 8;
    ctx.strokeRect(QUADRATO.x, QUADRATO.y, QUADRATO.width, QUADRATO.height);
    
    ctx.strokeStyle = '#ff5722';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(QUADRATO.x + 12, QUADRATO.y + QUADRATO.height - 12);
    ctx.lineTo(QUADRATO.x + QUADRATO.width - 12, QUADRATO.y + QUADRATO.height - 12);
    ctx.lineTo(QUADRATO.x + QUADRATO.width - 12, QUADRATO.y + 12);
    ctx.lineTo(QUADRATO.x + 12, QUADRATO.y + 12);
    ctx.lineTo(QUADRATO.x + 12, QUADRATO.y + QUADRATO.height - 12);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', QUADRATO.x + 12, QUADRATO.y + QUADRATO.height + 25);
    ctx.fillText('SU', QUADRATO.x + QUADRATO.width + 30, QUADRATO.y + QUADRATO.height/2);
    ctx.fillText('SINISTRA', QUADRATO.x + QUADRATO.width/2, QUADRATO.y - 25);
    ctx.fillText('GIÙ', QUADRATO.x - 30, QUADRATO.y + QUADRATO.height/2);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
    drawRobot();
}

function moveRight() {
    const distance = QUADRATO.width - 24;
    const steps = 33;
    let step = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            robot.x += distance / steps;
            update();
            step++;
            if (step > steps) {
                robot.x = QUADRATO.x + QUADRATO.width - 12;
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}

function moveUp() {
    const distance = QUADRATO.height - 24;
    const steps = 33;
    let step = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            robot.y -= distance / steps;
            update();
            step++;
            if (step > steps) {
                robot.y = QUADRATO.y + 12;
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}

function moveLeft() {
    const distance = QUADRATO.width - 24;
    const steps = 33;
    let step = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            robot.x -= distance / steps;
            update();
            step++;
            if (step > steps) {
                robot.x = QUADRATO.x + 12;
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}

function moveDown() {
    const distance = QUADRATO.height - 24;
    const steps = 33;
    let step = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            robot.y += distance / steps;
            update();
            step++;
            if (step > steps) {
                robot.y = QUADRATO.y + QUADRATO.height - 12;
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}

function turnCorner() {
    robot.isM2Active = true;
    const steps = 13;
    let step = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            update();
            step++;
            if (step > steps) {
                clearInterval(interval);
                robot.isM2Active = false;
                resolve();
            }
        }, 30);
    });
}

function simulatePause(time) {
    return new Promise(r => setTimeout(r, time));
}

async function startRobot() {
    if (robot.running) return;
    robot.running = true;
    
    await moveRight();
    await simulatePause(300);
    await turnCorner();
    await simulatePause(500);
    
    await moveUp();
    await simulatePause(300);
    await turnCorner();
    await simulatePause(500);
    
    await moveLeft();
    await simulatePause(300);
    await turnCorner();
    await simulatePause(500);
    
    await moveDown();
    
    robot.running = false;
}

update();
