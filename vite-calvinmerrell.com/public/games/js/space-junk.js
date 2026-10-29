(() => {
  const canvas = document.querySelector('#space-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const scoreEl = document.querySelector('#space-score');
  const bestEl = document.querySelector('#space-best');
  const livesEl = document.querySelector('#space-lives');
  const messageEl = document.querySelector('#space-message');
  const startButton = document.querySelector('#space-start');
  const pauseButton = document.querySelector('#space-pause');
  const bestKey = 'littleArcadeSpaceJunkBest';
  let best = Number(localStorage.getItem(bestKey) || 0);
  let score = 0;
  let lives = 3;
  let nextExtraShipScore = 5000;
  let ship = { x: W / 2, y: H - 42, w: 38, speed: 330 };
  let debris = [];
  let shots = [];
  let particles = [];
  let stars = Array.from({ length: 85 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + .3, a: Math.random() * .65 + .2 }));
  let keys = { left: false, right: false, fire: false };
  let running = false;
  let paused = false;
  let over = false;
  let spawnClock = 0;
  let fireClock = 0;
  let lastTime = 0;
  let animationFrame = null;
  let frame = 0;
  let touchX = null;
  let aimTouch = false;

  bestEl.textContent = best;

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#101a38');
    gradient.addColorStop(1, '#263b5a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    stars.forEach((star, i) => {
      ctx.globalAlpha = star.a * (.7 + Math.sin(frame * .025 + i) * .3);
      ctx.fillStyle = i % 8 === 0 ? '#a9d9ff' : '#fff6d5';
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#253e45';
    ctx.fillRect(0, H - 13, W, 13);
    ctx.fillStyle = '#a7cf73';
    ctx.fillRect(0, H - 13, W, 3);
    ctx.fillStyle = '#d6e4a1';
    for (let x = 12; x < W; x += 39) ctx.fillRect(x, H - 7, 14, 2);
  }

  function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.fillStyle = '#ff9d70';
    ctx.beginPath(); ctx.moveTo(-7, 15); ctx.lineTo(-13, 25 + Math.sin(frame * .4) * 2); ctx.lineTo(-3, 22); ctx.fill();
    ctx.beginPath(); ctx.moveTo(7, 15); ctx.lineTo(13, 25 + Math.sin(frame * .4 + 1) * 2); ctx.lineTo(3, 22); ctx.fill();
    ctx.fillStyle = '#a9d9ff';
    ctx.beginPath(); ctx.moveTo(0, -22); ctx.quadraticCurveTo(17, -3, 14, 16); ctx.lineTo(-14, 16); ctx.quadraticCurveTo(-17, -3, 0, -22); ctx.fill();
    ctx.fillStyle = '#f8f7f2';
    ctx.beginPath(); ctx.ellipse(0, -5, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#516e95';
    ctx.beginPath(); ctx.ellipse(0, -5, 3, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c7e5ff';
    roundedRect(-2, -29, 4, 11, 2); ctx.fill();
    ctx.restore();
  }

  function drawRock(item) {
    ctx.save(); ctx.translate(item.x, item.y); ctx.rotate(item.rot);
    ctx.fillStyle = item.color;
    ctx.beginPath();
    item.points.forEach((p, i) => i ? ctx.lineTo(p.x * item.r, p.y * item.r) : ctx.moveTo(p.x * item.r, p.y * item.r));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffffff38'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#25334a55';
    ctx.beginPath(); ctx.arc(-item.r * .18, -item.r * .12, item.r * .2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(item.r * .3, item.r * .25, item.r * .12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawSaucer(item) {
    ctx.save(); ctx.translate(item.x, item.y);
    ctx.fillStyle = '#a7cf73';
    ctx.beginPath(); ctx.ellipse(0, 3, item.r * 1.5, item.r * .48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e4f5bd';
    ctx.beginPath(); ctx.ellipse(0, -2, item.r * .7, item.r * .56, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff1a6';
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * item.r * .65, 5, 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function draw() {
    drawBackground();
    debris.forEach(item => item.type === 'saucer' ? drawSaucer(item) : drawRock(item));
    ctx.fillStyle = '#fff1a6';
    shots.forEach(shot => { roundedRect(shot.x - 2, shot.y - 9, 4, 15, 2); ctx.fill(); });
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawShip();
    if (!running) {
      ctx.fillStyle = '#07101c77'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff'; ctx.font = '700 34px "Space Grotesk", sans-serif';
      ctx.fillText(over ? 'Ship down!' : paused ? 'Paused' : 'Ready, pilot?', W / 2, H / 2 - 10);
      ctx.fillStyle = '#d8e6ee'; ctx.font = '500 14px "DM Sans", sans-serif';
      ctx.fillText(over ? `Final score: ${score}` : 'Blast the junk. Save the planet.', W / 2, H / 2 + 20);
    }
  }

  function spawnDebris() {
    const saucer = Math.random() < .1;
    const r = saucer ? 16 : 13 + Math.random() * 12;
    const sides = 7;
    const points = Array.from({ length: sides }, (_, i) => {
      const angle = i * Math.PI * 2 / sides;
      const radius = .74 + Math.random() * .35;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    });
    debris.push({ type: saucer ? 'saucer' : 'rock', x: 30 + Math.random() * (W - 60), y: -r - 8, r, speed: 68 + Math.random() * 55 + Math.min(score, 800) * .025, drift: (Math.random() - .5) * 42, rot: Math.random() * 6, spin: (Math.random() - .5) * 1.8, color: ['#aeb4bf', '#c3a77e', '#8e9caa', '#bd8b75'][Math.floor(Math.random() * 4)], points });
  }

  function burst(x, y, color, count = 13) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 155;
      const life = .35 + Math.random() * .4;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life, size: 1.5 + Math.random() * 3, color });
    }
  }

  function shoot() {
    shots.push({ x: ship.x, y: ship.y - 25, speed: 480 });
  }

  function update(dt) {
    frame++;
    if (touchX !== null) ship.x += (touchX - ship.x) * Math.min(1, dt * 12);
    else ship.x += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * ship.speed * dt;
    ship.x = Math.max(ship.w / 2 + 3, Math.min(W - ship.w / 2 - 3, ship.x));

    spawnClock += dt;
    const spawnEvery = Math.max(.48, 1.03 - score * .0001);
    if (spawnClock >= spawnEvery) { spawnClock = 0; spawnDebris(); }
    fireClock -= dt;
    if (keys.fire && fireClock <= 0) { shoot(); fireClock = .19; }

    shots.forEach(shot => { shot.y -= shot.speed * dt; });
    shots = shots.filter(shot => shot.y > -15);
    debris.forEach(item => {
      item.y += item.speed * dt;
      item.x += item.drift * dt;
      item.rot += item.spin * dt;
      if (item.x < item.r || item.x > W - item.r) item.drift *= -1;
    });

    for (let i = debris.length - 1; i >= 0; i--) {
      const item = debris[i];
      const shotIndex = shots.findIndex(shot => Math.hypot(shot.x - item.x, shot.y - item.y) < item.r + 5);
      if (shotIndex !== -1) {
        shots.splice(shotIndex, 1); debris.splice(i, 1);
        score += item.type === 'saucer' ? 30 : 10;
        scoreEl.textContent = score;
        if (score > best) { best = score; bestEl.textContent = best; localStorage.setItem(bestKey, best); }
        while (score >= nextExtraShipScore) {
          lives++;
          livesEl.textContent = lives;
          nextExtraShipScore += 5000;
        }
        burst(item.x, item.y, item.type === 'saucer' ? '#dcf49c' : '#ffd29a', item.type === 'saucer' ? 20 : 13);
        continue;
      }
      if (item.y + item.r >= ship.y - 15 && Math.abs(item.x - ship.x) < item.r + 13) {
        debris.splice(i, 1); lives--; livesEl.textContent = lives; burst(ship.x, ship.y, '#ff9d70', 22);
        if (lives <= 0) { endGame(); return; }
        ship.x = W / 2;
        continue;
      }
      if (item.y - item.r > H - 13) {
        debris.splice(i, 1); lives--; livesEl.textContent = lives; burst(item.x, H - 17, '#ff9d70', 12);
        if (lives <= 0) { endGame(); return; }
      }
    }
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);
  }

  function loop(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000 || 0, .04);
    lastTime = time;
    update(dt);
    draw();
    if (running) animationFrame = requestAnimationFrame(loop);
    else animationFrame = null;
  }

  function startGame() {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    score = 0; lives = 3; nextExtraShipScore = 5000; debris = []; shots = []; particles = []; ship.x = W / 2;
    spawnClock = .3; fireClock = 0; over = false; paused = false; running = true;
    scoreEl.textContent = '0'; livesEl.textContent = '3';
    messageEl.textContent = 'Move with ← → or A / D · Hold Space to fire · Extra ship every 5,000 points';
    startButton.textContent = '↻ Restart'; pauseButton.disabled = false; pauseButton.textContent = 'Ⅱ Pause';
    lastTime = performance.now(); animationFrame = requestAnimationFrame(loop);
  }

  function endGame() {
    running = false; over = true; keys.fire = false;
    messageEl.textContent = `Game over — you scored ${score}. Press Play again to relaunch.`;
    startButton.textContent = '↻ Play again'; pauseButton.disabled = true;
    draw();
  }

  function togglePause() {
    if (!running && !paused) return;
    if (running) {
      running = false; paused = true;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null; keys = { left: false, right: false, fire: false };
      pauseButton.textContent = '▶ Resume'; messageEl.textContent = 'Paused — take your time.'; draw();
    } else {
      running = true; paused = false; pauseButton.textContent = 'Ⅱ Pause';
      messageEl.textContent = 'Move with ← → or A / D · Hold Space to fire · Extra ship every 5,000 points';
      lastTime = performance.now(); animationFrame = requestAnimationFrame(loop);
    }
  }

  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (['arrowleft', 'arrowright', ' ', 'a', 'd'].includes(key)) event.preventDefault();
    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === ' ') keys.fire = true;
    if (key === 'escape' && (running || paused)) togglePause();
  });
  document.addEventListener('keyup', event => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
    if (key === ' ') keys.fire = false;
  });
  window.addEventListener('blur', () => { keys = { left: false, right: false, fire: false }; });

  function holdButton(id, key) {
    const button = document.querySelector(id);
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); keys[key] = true; });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => button.addEventListener(type, () => { keys[key] = false; }));
  }
  holdButton('#space-left', 'left');
  holdButton('#space-right', 'right');
  holdButton('#space-fire', 'fire');

  canvas.addEventListener('pointerdown', event => {
    if (!running) return;
    canvas.setPointerCapture(event.pointerId);
    const bounds = canvas.getBoundingClientRect();
    touchX = (event.clientX - bounds.left) * W / bounds.width;
    aimTouch = true; keys.fire = true;
  });
  canvas.addEventListener('pointermove', event => {
    if (!aimTouch || !running) return;
    const bounds = canvas.getBoundingClientRect();
    touchX = (event.clientX - bounds.left) * W / bounds.width;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, () => { aimTouch = false; touchX = null; keys.fire = false; }));
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', togglePause);
  draw();
})();
