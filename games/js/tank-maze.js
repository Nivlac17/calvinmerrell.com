(() => {
  const canvas = document.querySelector('#tank-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, TILE = 40, COLS = W / TILE, ROWS = H / TILE;
  const rows = [
    '##################',
    '#...#....#....#..#',
    '#...#....#....#..#',
    '#..............#.#',
    '###.###.##.##.##.#',
    '#...#....#....#..#',
    '#................#',
    '#.##.#.##.##.#.###',
    '#................#',
    '#...#....#....#..#',
    '###.###.##.##.##.#',
    '#.#..............#',
    '#...#....#....#..#',
    '##################',
  ];
  const scoreEl = document.querySelector('#tank-kos');
  const livesEl = document.querySelector('#tank-lives');
  const rivalsEl = document.querySelector('#tank-rivals');
  const messageEl = document.querySelector('#tank-message');
  const startButton = document.querySelector('#tank-start');
  const pauseButton = document.querySelector('#tank-pause');
  const wallColors = ['#d8bd8c', '#bc986c', '#98744f'];
  const colors = { player: '#74b85e', red: '#ee7961', blue: '#73aee0', purple: '#bd91d6' };
  let maze = [];
  let tanks = [];
  let bullets = [];
  let particles = [];
  let keys = Object.create(null);
  let running = false;
  let paused = false;
  let finished = false;
  let won = false;
  let lastTime = 0;
  let rafId = null;
  let elapsed = 0;
  let kills = 0;
  let frame = 0;

  const spawns = [
    { x: 1.5, y: 1.5, dir: 'right', color: colors.player, player: true },
    { x: 16.5, y: 1.5, dir: 'left', color: colors.red },
    { x: 1.5, y: 12.5, dir: 'right', color: colors.blue },
    { x: 16.5, y: 12.5, dir: 'left', color: colors.purple },
  ];
  const vectors = { up: { x: 0, y: -1 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 } };

  function makeMaze() {
    return rows.map((row, y) => row.split('').map((tile, x) => ({
      hp: tile === '#' ? 3 : 0,
    })));
  }

  function resetTanks() {
    return spawns.map((spawn, i) => ({
      x: spawn.x * TILE, y: spawn.y * TILE, dir: spawn.dir, color: spawn.color,
      player: !!spawn.player, lives: 2, spawn: i, alive: true, fireClock: .5 + i * .3,
      moveClock: 0, decisionClock: .3 + i * .2, stun: 0,
    }));
  }

  function roundRect(x, y, w, h, radius) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
  }

  function tankBlocked(x, y, radius = 13) {
    if (x - radius < 0 || x + radius > W || y - radius < 0 || y + radius > H) return true;
    const left = Math.floor((x - radius) / TILE), right = Math.floor((x + radius) / TILE);
    const top = Math.floor((y - radius) / TILE), bottom = Math.floor((y + radius) / TILE);
    for (let ty = top; ty <= bottom; ty++) for (let tx = left; tx <= right; tx++) {
      if (!maze[ty] || !maze[ty][tx] || maze[ty][tx].hp <= 0) continue;
      const nearestX = Math.max(tx * TILE, Math.min(x, (tx + 1) * TILE));
      const nearestY = Math.max(ty * TILE, Math.min(y, (ty + 1) * TILE));
      if (Math.hypot(x - nearestX, y - nearestY) < radius) return true;
    }
    return false;
  }

  function tankAt(x, y, except) {
    return tanks.find(other => other !== except && other.alive && Math.hypot(other.x - x, other.y - y) < 27);
  }

  function canMove(tank, x, y) {
    return !tankBlocked(x, y) && !tankAt(x, y, tank);
  }

  function drawMaze() {
    ctx.fillStyle = '#26343d'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const wall = maze[y][x];
      if (wall.hp > 0) {
        ctx.fillStyle = wall.hp === Infinity ? '#46545a' : wallColors[wall.hp - 1];
        ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
        ctx.fillStyle = wall.hp === Infinity ? '#5d6b6f' : '#ffffff26';
        ctx.fillRect(x * TILE + 4, y * TILE + 4, TILE - 8, 4);
        ctx.strokeStyle = wall.hp === Infinity ? '#25343c' : '#80684d'; ctx.lineWidth = 1.5;
        ctx.strokeRect(x * TILE + 2.5, y * TILE + 2.5, TILE - 5, TILE - 5);
        if (wall.hp !== Infinity) {
          ctx.fillStyle = '#5a443244';
          for (let crack = 0; crack < 3 - wall.hp; crack++) {
            ctx.fillRect(x * TILE + 8 + crack * 10, y * TILE + 17 + (crack % 2) * 7, 8, 2);
          }
        }
      } else {
        ctx.fillStyle = (x + y) % 2 ? '#2a3941' : '#2c3b43';
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        ctx.strokeStyle = '#ffffff08'; ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
  }

  function drawTank(tank) {
    if (!tank.alive) return;
    ctx.save(); ctx.translate(tank.x, tank.y);
    const angle = { up: -Math.PI / 2, right: 0, down: Math.PI / 2, left: Math.PI }[tank.dir];
    ctx.rotate(angle);
    if (tank.stun > 0 && frame % 8 < 4) ctx.globalAlpha = .5;
    ctx.fillStyle = '#111b20';
    roundRect(-17, -14, 34, 9, 4); ctx.fill();
    roundRect(-17, 5, 34, 9, 4); ctx.fill();
    ctx.fillStyle = tank.color;
    roundRect(-13, -12, 26, 24, 7); ctx.fill();
    ctx.fillStyle = '#ffffff35';
    roundRect(-10, -9, 20, 5, 3); ctx.fill();
    ctx.fillStyle = '#27343b';
    roundRect(-3.5, -19, 7, 24, 3); ctx.fill();
    ctx.fillStyle = '#e9dfbb';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#596769';
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (tank.lives > 1) {
      ctx.fillStyle = '#fff'; ctx.font = '700 10px "DM Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(`${tank.lives}♥`, tank.x, tank.y - 22);
    }
  }

  function draw() {
    drawMaze();
    tanks.forEach(drawTank);
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.owner.player ? '#fff1a6' : '#ff9d70';
      ctx.beginPath(); ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff8a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bullet.x - bullet.vx * .035, bullet.y - bullet.vy * .035); ctx.lineTo(bullet.x, bullet.y); ctx.stroke();
    });
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife); ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!running) {
      ctx.fillStyle = '#10191ebd'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '700 34px "Space Grotesk", sans-serif';
      ctx.fillText(finished ? (won ? 'Maze cleared!' : 'Tank knocked out') : paused ? 'Paused' : 'Ready, commander?', W / 2, H / 2 - 12);
      ctx.fillStyle = '#e5e7dc'; ctx.font = '500 14px "DM Sans", sans-serif';
      ctx.fillText(finished ? `${kills} rival${kills === 1 ? '' : 's'} defeated` : 'Break the blocks. Outsmart the rival tanks.', W / 2, H / 2 + 20);
    }
  }

  function burst(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2, speed = 35 + Math.random() * 145, life = .3 + Math.random() * .45;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life, size: 1.5 + Math.random() * 2.5, color });
    }
  }

  function fire(tank) {
    const v = vectors[tank.dir];
    bullets.push({ x: tank.x + v.x * 19, y: tank.y + v.y * 19, vx: v.x * 310, vy: v.y * 310, owner: tank, life: 2.4 });
  }

  function lineOfSight(tank, target) {
    const sameCol = Math.abs(tank.x - target.x) < 20;
    const sameRow = Math.abs(tank.y - target.y) < 20;
    if (!sameCol && !sameRow) return null;
    const dir = sameCol ? (target.y < tank.y ? 'up' : 'down') : (target.x < tank.x ? 'left' : 'right');
    const v = vectors[dir], distance = Math.hypot(target.x - tank.x, target.y - tank.y);
    for (let step = 18; step < distance - 18; step += 8) {
      const x = tank.x + v.x * step, y = tank.y + v.y * step;
      if (maze[Math.floor(y / TILE)]?.[Math.floor(x / TILE)]?.hp > 0) return null;
    }
    return dir;
  }

  function cellAt(x, y) { return { x: Math.floor(x / TILE), y: Math.floor(y / TILE) }; }
  function walkableCell(x, y) { return !!maze[y]?.[x] && maze[y][x].hp === 0; }

  function nextPathCell(start, goal) {
    const startKey = `${start.x},${start.y}`;
    const queue = [{ x: start.x, y: start.y }], previous = new Map([[startKey, null]]);
    let found = null;
    for (let i = 0; i < queue.length; i++) {
      const cell = queue[i];
      if (cell.x === goal.x && cell.y === goal.y) { found = cell; break; }
      for (const dir of ['up', 'right', 'down', 'left']) {
        const v = vectors[dir], nx = cell.x + v.x, ny = cell.y + v.y, key = `${nx},${ny}`;
        if (!walkableCell(nx, ny) || previous.has(key)) continue;
        previous.set(key, `${cell.x},${cell.y}`); queue.push({ x: nx, y: ny });
      }
    }
    if (!found) return null;
    let key = `${found.x},${found.y}`;
    while (previous.get(key) && previous.get(key) !== startKey) key = previous.get(key);
    return key === startKey ? null : key.split(',').map(Number);
  }

  function chooseCpuDirection(tank) {
    const player = tanks[0];
    if (!player.alive) return ['up', 'right', 'down', 'left'][Math.floor(Math.random() * 4)];
    const start = cellAt(tank.x, tank.y), target = cellAt(player.x, player.y);
    const next = nextPathCell(start, target);
    if (next) {
      const dx = next[0] - start.x, dy = next[1] - start.y;
      return dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
    }
    const options = ['up', 'right', 'down', 'left'].filter(dir => {
      const v = vectors[dir]; return canMove(tank, tank.x + v.x * 16, tank.y + v.y * 16);
    });
    return options[Math.floor(Math.random() * options.length)] || tank.dir;
  }

  function damageTank(target, owner) {
    target.lives--;
    burst(target.x, target.y, target.color, 22);
    if (target.lives <= 0) {
      target.alive = false;
      if (owner.player) {
        owner.lives++;
        kills++;
        scoreEl.textContent = kills;
        livesEl.textContent = owner.lives;
        messageEl.textContent = `Rival tank destroyed! +1 life · ${owner.lives} lives remaining.`;
      }
      const aliveRivals = tanks.slice(1).filter(tank => tank.alive).length;
      rivalsEl.textContent = aliveRivals;
      if (aliveRivals === 0) endGame(true);
    } else {
      target.stun = .7;
      target.x = spawns[target.spawn].x * TILE;
      target.y = spawns[target.spawn].y * TILE;
      target.dir = spawns[target.spawn].dir;
    }
  }

  function updateBullets(dt) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; bullet.life -= dt;
      if (bullet.life <= 0 || bullet.x < 0 || bullet.x >= W || bullet.y < 0 || bullet.y >= H) { bullets.splice(i, 1); continue; }
      const tx = Math.floor(bullet.x / TILE), ty = Math.floor(bullet.y / TILE), wall = maze[ty]?.[tx];
      if (!wall || wall.hp > 0) {
        if (wall && wall.hp !== Infinity) {
          wall.hp--;
          if (wall.hp === 0) burst(bullet.x, bullet.y, '#d4b58b', 8);
          else burst(bullet.x, bullet.y, '#f1d7a7', 4);
        } else burst(bullet.x, bullet.y, '#8b9b9b', 3);
        bullets.splice(i, 1); continue;
      }
      const target = tanks.find(tank => tank.alive && tank !== bullet.owner && Math.hypot(tank.x - bullet.x, tank.y - bullet.y) < 17);
      if (target) { bullets.splice(i, 1); damageTank(target, bullet.owner); }
    }
  }

  function updatePlayer(dt) {
    const player = tanks[0]; if (!player.alive) return;
    let direction = null;
    if (keys.ArrowUp || keys.KeyW) direction = 'up';
    else if (keys.ArrowRight || keys.KeyD) direction = 'right';
    else if (keys.ArrowDown || keys.KeyS) direction = 'down';
    else if (keys.ArrowLeft || keys.KeyA) direction = 'left';
    if (direction) {
      player.dir = direction;
      const v = vectors[direction], speed = 145;
      const nx = player.x + v.x * speed * dt, ny = player.y + v.y * speed * dt;
      if (canMove(player, nx, ny)) { player.x = nx; player.y = ny; }
    }
    player.fireClock -= dt;
    if (keys.Space && player.fireClock <= 0) { fire(player); player.fireClock = .34; }
  }

  function updateCpu(tank, dt) {
    if (!tank.alive) return;
    tank.decisionClock -= dt; tank.moveClock -= dt; tank.fireClock -= dt; tank.stun -= dt;
    const aim = lineOfSight(tank, tanks[0]);
    if (aim) tank.dir = aim;
    if (tank.fireClock <= 0) {
      if (aim) fire(tank);
      tank.fireClock = .85 + Math.random() * .6;
    }
    if (tank.decisionClock <= 0) {
      tank.decisionClock = .28 + Math.random() * .22;
      const target = aim ? tank.dir : chooseCpuDirection(tank);
      tank.dir = target;
    }
    if (tank.stun > 0) return;
    const v = vectors[tank.dir], speed = 88;
    const nx = tank.x + v.x * speed * dt, ny = tank.y + v.y * speed * dt;
    if (canMove(tank, nx, ny)) { tank.x = nx; tank.y = ny; }
    else if (tank.moveClock <= 0) {
      tank.dir = chooseCpuDirection(tank); tank.moveClock = .25;
    }
  }

  function update(dt) {
    frame++; elapsed += dt;
    updatePlayer(dt);
    tanks.slice(1).forEach(tank => updateCpu(tank, dt));
    updateBullets(dt);
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .98; p.vy *= .98; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);
    if (!tanks[0].alive && !finished) endGame(false);
  }

  function loop(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000 || 0, .04); lastTime = time;
    update(dt); draw();
    if (running) rafId = requestAnimationFrame(loop); else rafId = null;
  }

  function startGame() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    maze = makeMaze(); tanks = resetTanks(); bullets = []; particles = []; keys = Object.create(null);
    running = true; paused = false; finished = false; won = false; kills = 0; elapsed = 0;
    scoreEl.textContent = '0'; livesEl.textContent = '2'; rivalsEl.textContent = '3';
    messageEl.textContent = 'Drive with ← → ↑ ↓ or WASD · Space to fire · Every wall takes 3 hits';
    startButton.textContent = '↻ Restart'; pauseButton.textContent = 'Ⅱ Pause'; pauseButton.disabled = false;
    lastTime = performance.now(); rafId = requestAnimationFrame(loop);
  }

  function endGame(playerWon) {
    running = false; finished = true; won = playerWon; keys = Object.create(null);
    pauseButton.disabled = true; startButton.textContent = '↻ Play again';
    messageEl.textContent = playerWon ? `You cleared the maze! ${kills} rival tanks defeated.` : `Your tank is out. You defeated ${kills} rival${kills === 1 ? '' : 's'}.`;
    draw();
  }

  function togglePause() {
    if (!running && !paused) return;
    if (running) {
      running = false; paused = true; keys = Object.create(null);
      if (rafId !== null) cancelAnimationFrame(rafId); rafId = null;
      pauseButton.textContent = '▶ Resume'; messageEl.textContent = 'Paused — your rivals are taking a breather too.'; draw();
    } else {
      running = true; paused = false; pauseButton.textContent = 'Ⅱ Pause';
      messageEl.textContent = 'Drive with ← → ↑ ↓ or WASD · Space to fire · Every wall takes 3 hits';
      lastTime = performance.now(); rafId = requestAnimationFrame(loop);
    }
  }

  function setMobileKey(key, pressed) { keys[key] = pressed; }

  document.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code.startsWith('Arrow') || ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) keys[event.code] = true;
    if (event.code === 'Escape' && (running || paused)) togglePause();
  });
  document.addEventListener('keyup', event => { keys[event.code] = false; });
  window.addEventListener('blur', () => { keys = Object.create(null); });

  document.querySelectorAll('[data-tank-dir]').forEach(button => {
    const code = { up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown', left: 'ArrowLeft' }[button.dataset.tankDir];
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); setMobileKey(code, true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => button.addEventListener(type, () => setMobileKey(code, false)));
  });
  const fireButton = document.querySelector('#tank-fire');
  fireButton.addEventListener('pointerdown', event => { event.preventDefault(); fireButton.setPointerCapture(event.pointerId); setMobileKey('Space', true); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => fireButton.addEventListener(type, () => setMobileKey('Space', false)));
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', togglePause);
  maze = makeMaze();
  tanks = resetTanks();
  draw();
})();
