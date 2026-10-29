(() => {
  const canvas = document.querySelector('#bat-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const scoreEl = document.querySelector('#bat-score');
  const bestEl = document.querySelector('#bat-best');
  const firefliesEl = document.querySelector('#bat-fireflies');
  const messageEl = document.querySelector('#bat-message');
  const startButton = document.querySelector('#bat-start');
  const pauseButton = document.querySelector('#bat-pause');
  const bestKey = 'littleArcadeBattyFlightBest';
  let best = Number(localStorage.getItem(bestKey) || 0);
  let score = 0;
  let fireflies = 0;
  let bat = { x: 174, y: H / 2, vy: 0 };
  let webs = [];
  let motes = [];
  let particles = [];
  let running = false;
  let paused = false;
  let over = false;
  let waitingForFlap = false;
  let spawnClock = 0;
  let lastTime = 0;
  let animationFrame = null;
  let frame = 0;

  bestEl.textContent = best;

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#171b32');
    sky.addColorStop(.56, '#29324a');
    sky.addColorStop(1, '#55465b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#fff0bd';
    ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.arc(572, 92, 34, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .16;
    ctx.beginPath(); ctx.arc(572, 92, 52, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    for (let i = 0; i < 42; i++) {
      const x = (i * 173 + 37) % W;
      const y = (i * 97 + 23) % 340;
      const twinkle = .35 + (Math.sin(frame * .045 + i * 2) + 1) * .25;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = i % 5 === 0 ? '#c9f3dc' : '#f9e7c3';
      ctx.beginPath(); ctx.arc(x, y, i % 4 === 0 ? 2 : 1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Jagged cave edges keep the flight path open while adding a little depth.
    ctx.fillStyle = '#171a2c';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 39);
    for (let x = W; x >= 0; x -= 40) ctx.lineTo(x, 28 + Math.sin(x * .035) * 12 + (x % 3) * 3);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#25263a';
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.lineTo(W, H - 38);
    for (let x = W; x >= 0; x -= 40) ctx.lineTo(x, H - 28 - Math.sin(x * .027) * 14);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9c7485';
    for (let x = 18; x < W; x += 80) {
      const tip = 28 + Math.sin(x * .035) * 12 + (x % 3) * 3;
      ctx.beginPath(); ctx.moveTo(x - 7, tip); ctx.lineTo(x + 7, tip); ctx.lineTo(x, tip + 19 + (x % 5)); ctx.closePath(); ctx.fill();
    }
  }

  function drawWeb(web) {
    const r = web.r;
    ctx.save(); ctx.translate(web.x, web.y);
    ctx.shadowColor = '#c6a7ed'; ctx.shadowBlur = 13;
    ctx.strokeStyle = '#e2d7f2'; ctx.lineWidth = 1.6;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    for (let ring = 1; ring <= 4; ring++) {
      const radius = r * ring / 4;
      ctx.beginPath();
      for (let i = 0; i <= 32; i++) {
        const a = i * Math.PI * 2 / 32;
        const wobble = radius + Math.sin(a * 8) * 2;
        const x = Math.cos(a) * wobble;
        const y = Math.sin(a) * wobble;
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#f4d89b';
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawFirefly(fly) {
    const glow = .65 + Math.sin(frame * .15 + fly.phase) * .3;
    ctx.save(); ctx.globalAlpha = glow; ctx.shadowColor = '#f8f48c'; ctx.shadowBlur = 18;
    ctx.fillStyle = '#fff7a5'; ctx.beginPath(); ctx.arc(fly.x, fly.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = .72;
    ctx.fillStyle = '#d9ef9a';
    ctx.beginPath(); ctx.ellipse(fly.x - 6, fly.y - 3, 4, 2.5, -.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(fly.x + 6, fly.y - 3, 4, 2.5, .5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawBat() {
    const flap = Math.sin(frame * .48) * 9;
    ctx.save(); ctx.translate(bat.x, bat.y);
    ctx.shadowColor = '#151525'; ctx.shadowBlur = 9;
    ctx.fillStyle = '#453458';
    ctx.beginPath(); ctx.moveTo(-5, 0); ctx.quadraticCurveTo(-22, -19 - flap, -34, -11 - flap); ctx.lineTo(-29, 4); ctx.lineTo(-37, 13 - flap); ctx.quadraticCurveTo(-18, 18, -4, 9); ctx.fill();
    ctx.beginPath(); ctx.moveTo(5, 0); ctx.quadraticCurveTo(22, -19 - flap, 34, -11 - flap); ctx.lineTo(29, 4); ctx.lineTo(37, 13 - flap); ctx.quadraticCurveTo(18, 18, 4, 9); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#76517f'; ctx.beginPath(); ctx.ellipse(0, 1, 11, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#76517f';
    ctx.beginPath(); ctx.moveTo(-8, -7); ctx.lineTo(-11, -20); ctx.lineTo(-1, -11); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8, -7); ctx.lineTo(11, -20); ctx.lineTo(1, -11); ctx.fill();
    ctx.fillStyle = '#ffe39b'; ctx.beginPath(); ctx.arc(5, -1, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#342840'; ctx.beginPath(); ctx.arc(5.5, -1, .8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function draw() {
    drawBackground();
    webs.forEach(drawWeb);
    motes.forEach(drawFirefly);
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawBat();
    if (!running || waitingForFlap) {
      ctx.fillStyle = '#11132688'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff4dc';
      ctx.font = '700 34px "Space Grotesk", sans-serif';
      ctx.fillText(over ? 'Tangled up!' : paused ? 'Paused' : 'Ready to flutter?', W / 2, H / 2 - 10);
      ctx.fillStyle = '#e5d9ee'; ctx.font = '500 14px "DM Sans", sans-serif';
      ctx.fillText(over ? `Final score: ${score} · Fireflies: ${fireflies}` : waitingForFlap ? 'Tap or press Space to take off.' : 'Dodge the webs and follow the fireflies.', W / 2, H / 2 + 20);
    }
  }

  function spawnWeb() {
    const y = 88 + Math.random() * (H - 176);
    webs.push({ x: W + 42, y, r: 28 + Math.random() * 9, passed: false });
    if (Math.random() < .82) {
      const offset = Math.random() < .5 ? -72 : 72;
      const flyY = Math.max(70, Math.min(H - 70, y + offset));
      motes.push({ x: W + 42, y: flyY, phase: Math.random() * 7 });
    }
  }

  function burst(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 110;
      const life = .3 + Math.random() * .35;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life, size: 2 + Math.random() * 3, color });
    }
  }

  function flap() {
    if (!running) return;
    waitingForFlap = false;
    bat.vy = -315;
  }

  function update(dt) {
    frame++;
    if (waitingForFlap) return;
    const speed = 192 + Math.min(score, 60) * 2.1;
    bat.vy = Math.min(440, bat.vy + 820 * dt);
    bat.y += bat.vy * dt;
    if (bat.y < 43 || bat.y > H - 43) { endGame(); return; }

    spawnClock += dt;
    if (spawnClock >= 1.48) { spawnClock -= 1.48; spawnWeb(); }
    webs.forEach(web => { web.x -= speed * dt; });
    motes.forEach(fly => { fly.x -= speed * dt; fly.y += Math.sin(frame * .08 + fly.phase) * 15 * dt; });

    for (const web of webs) {
      if (!web.passed && web.x < bat.x - 36) {
        web.passed = true; score++; scoreEl.textContent = score;
        if (score > best) { best = score; bestEl.textContent = best; localStorage.setItem(bestKey, best); }
      }
      if (Math.hypot(web.x - bat.x, web.y - bat.y) < web.r + 12) { endGame(); return; }
    }
    for (let i = motes.length - 1; i >= 0; i--) {
      const fly = motes[i];
      if (Math.hypot(fly.x - bat.x, fly.y - bat.y) < 22) {
        motes.splice(i, 1); fireflies++; firefliesEl.textContent = fireflies;
        score += 5; scoreEl.textContent = score;
        if (score > best) { best = score; bestEl.textContent = best; localStorage.setItem(bestKey, best); }
        burst(fly.x, fly.y, '#fff0a0');
      }
    }
    webs = webs.filter(web => web.x > -50);
    motes = motes.filter(fly => fly.x > -30);
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);
  }

  function loop(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000 || 0, .04);
    lastTime = time; update(dt); draw();
    if (running) animationFrame = requestAnimationFrame(loop);
    else animationFrame = null;
  }

  function startGame() {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    score = 0; fireflies = 0; bat = { x: 174, y: H / 2, vy: 0 };
    webs = []; motes = []; particles = []; spawnClock = .65;
    over = false; paused = false; waitingForFlap = true; running = true;
    scoreEl.textContent = '0'; firefliesEl.textContent = '0';
    messageEl.textContent = 'Tap, click, or press Space to flap · Avoid the webs · Collect fireflies';
    startButton.textContent = '↻ Restart'; pauseButton.disabled = false; pauseButton.textContent = 'Ⅱ Pause';
    lastTime = performance.now(); animationFrame = requestAnimationFrame(loop); canvas.focus();
  }

  function endGame() {
    running = false; over = true; waitingForFlap = false;
    messageEl.textContent = `Tangled up — score ${score}, fireflies ${fireflies}. Press Play again to take another flight.`;
    startButton.textContent = '↻ Play again'; pauseButton.disabled = true; draw();
  }

  function togglePause() {
    if (!running && !paused) return;
    if (running) {
      running = false; paused = true;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null; pauseButton.textContent = '▶ Resume'; messageEl.textContent = 'Paused — take your time.'; draw();
    } else {
      running = true; paused = false; pauseButton.textContent = 'Ⅱ Pause';
      messageEl.textContent = 'Tap, click, or press Space to flap · Avoid the webs · Collect fireflies';
      lastTime = performance.now(); animationFrame = requestAnimationFrame(loop);
    }
  }

  document.addEventListener('keydown', event => {
    if (event.code === 'Space' && !event.repeat) { event.preventDefault(); flap(); }
    if (event.key === 'Escape' && (running || paused)) togglePause();
  });
  canvas.addEventListener('pointerdown', event => { event.preventDefault(); canvas.focus(); flap(); });
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', togglePause);
  draw();
})();
