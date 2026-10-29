// Maze Chase
const pacMap = [
  '###############',
  '#.............#',
  '#.###.###.###.#',
  '#.#.........#.#',
  '#.#.##.#.##.#.#',
  '#.....#.#.....#',
  '###.#.#.#.#.###',
  '#...#.....#...#',
  '#.#.###.###.#.#',
  '#.#.........#.#',
  '#.###.###.###.#',
  '#.............#',
  '###############',
];
const PW = 15;
const PH = 13;
const PAC_START_MS = 220;
const PAC_LEVEL_SPEEDUP_MS = 20;
const PAC_MIN_MS = 90;
let pacDots = new Set();
let pacPlayer = { x: 7, y: 7 };
let pacGhosts = [];
let pacDir = { x: 1, y: 0 };
let pacWanted = null;
let pacScore = 0;
let pacLevel = 1;
let pacTurnCount = 0;
let pacTimer = null;
let pacActive = false;
let pacEnded = false;

const pacVectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const pacArrowEmoji = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };

function pacStepInterval() {
  return Math.max(PAC_MIN_MS, PAC_START_MS - (pacLevel - 1) * PAC_LEVEL_SPEEDUP_MS);
}

function pacMakeDots() {
  const dots = new Set();
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      if (pacMap[y][x] === '.') dots.add(y * PW + x);
    }
  }
  return dots;
}

function pacSetupLevel(level) {
  clearInterval(pacTimer);
  pacLevel = level;
  pacDots = pacMakeDots();
  pacPlayer = { x: 7, y: 7 };
  pacGhosts = [
    { x: 13, y: 1, c: '#ff6b82' },
    { x: 13, y: 11, c: '#65d9ff' },
    { x: 1, y: 1, c: '#d58aff' },
  ];
  pacDir = { x: 1, y: 0 };
  pacWanted = null;
  pacTurnCount = 0;
  pacActive = true;
  pacEnded = false;
  $('#pac-level').textContent = pacLevel;
  $('#pac-left').textContent = pacDots.size;
  $('#pac-message').textContent = `Level ${pacLevel} — use arrows or WASD to turn.`;
  drawPac();
  updatePacTurnIndicator();
  $('#pac-canvas').focus({ preventScroll: true });
  pacTimer = setInterval(stepPac, pacStepInterval());
}

function pacStart() {
  pacScore = 0;
  $('#pac-score').textContent = pacScore;
  $('#pac-start').textContent = '↻ Restart';
  pacSetupLevel(1);
}

function drawPac() {
  const canvas = $('#pac-canvas');
  const g = canvas.getContext('2d');
  const s = canvas.width / PW;
  g.fillStyle = '#080c28';
  g.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      if (pacMap[y][x] === '#') {
        g.fillStyle = '#1f3fc4';
        g.fillRect(x * s + 1, y * s + 1, s - 2, s - 2);
        g.strokeStyle = '#3157ed';
        g.strokeRect(x * s + 3, y * s + 3, s - 6, s - 6);
      } else if (pacDots.has(y * PW + x)) {
        g.fillStyle = '#ffe9a9';
        g.beginPath();
        g.arc((x + .5) * s, (y + .5) * s, Math.max(2.5, s * .075), 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  if (pacPlayer) {
    g.fillStyle = '#ffd845';
    g.beginPath();
    g.arc((pacPlayer.x + .5) * s, (pacPlayer.y + .5) * s, s * .38, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#1c2140';
    g.beginPath();
    g.arc((pacPlayer.x + .58) * s, (pacPlayer.y + .37) * s, Math.max(2, s * .07), 0, Math.PI * 2);
    g.fill();
  }

  pacGhosts.forEach(ghost => {
    g.fillStyle = ghost.c;
    g.beginPath();
    g.arc((ghost.x + .5) * s, (ghost.y + .5) * s, s * .34, Math.PI, 0);
    g.lineTo((ghost.x + 1) * s, (ghost.y + 1) * s);
    g.lineTo((ghost.x + .75) * s, (ghost.y + .86) * s);
    g.lineTo((ghost.x + .5) * s, (ghost.y + 1) * s);
    g.lineTo((ghost.x + .25) * s, (ghost.y + .86) * s);
    g.lineTo(ghost.x * s, (ghost.y + 1) * s);
    g.closePath();
    g.fill();
  });
}

function pacCan(x, y) {
  return x >= 0 && x < PW && y >= 0 && y < PH && pacMap[y][x] !== '#';
}

function updatePacTurnIndicator() {
  const direction = pacWanted
    || Object.keys(pacVectors).find(name => pacVectors[name].x === pacDir.x && pacVectors[name].y === pacDir.y)
    || 'right';
  const vector = pacVectors[direction];
  const ready = pacCan(pacPlayer.x + vector.x, pacPlayer.y + vector.y);
  const indicator = $('#pac-turn-indicator');
  if (!indicator) return;
  indicator.classList.toggle('ready', ready);
  indicator.classList.toggle('waiting', !ready);
  $('#pac-turn-label').textContent = pacWanted
    ? (ready ? `Turn ready: ${direction}` : `Queued: ${direction} — waiting for an opening`)
    : `Heading ${direction}`;
  $('#pac-turn-arrow').textContent = `${ready ? '🟢' : '🟡'}${pacArrowEmoji[direction]}`;
}

function queuePacTurn(direction) {
  if (!pacActive) return;
  pacWanted = direction;
  const vector = pacVectors[direction];
  if (pacCan(pacPlayer.x + vector.x, pacPlayer.y + vector.y)) {
    pacDir = vector;
    pacWanted = null;
    $('#pac-message').textContent = `Level ${pacLevel} — turning ${direction}.`;
  } else {
    $('#pac-message').textContent = `Queued ${direction}; waiting for an opening.`;
  }
  updatePacTurnIndicator();
}

function stepPac() {
  if (pacWanted) {
    const turn = pacVectors[pacWanted];
    if (pacCan(pacPlayer.x + turn.x, pacPlayer.y + turn.y)) {
      pacDir = turn;
      pacWanted = null;
    }
  }

  if (pacCan(pacPlayer.x + pacDir.x, pacPlayer.y + pacDir.y)) {
    pacPlayer.x += pacDir.x;
    pacPlayer.y += pacDir.y;
  }

  const dotId = pacPlayer.y * PW + pacPlayer.x;
  if (pacDots.delete(dotId)) {
    pacScore += 10;
    $('#pac-score').textContent = pacScore;
    $('#pac-left').textContent = pacDots.size;
  }

  pacTurnCount++;
  const ghostMoveEvery = Math.max(1, 3 - Math.floor((pacLevel - 1) / 3));
  if (pacTurnCount % ghostMoveEvery === 0) {
    const chaseChance = Math.min(.92, .72 + (pacLevel - 1) * .025);
    for (const ghost of pacGhosts) {
      const choices = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .filter(([x, y]) => pacCan(ghost.x + x, ghost.y + y));
      if (!choices.length) continue;
      choices.sort((a, b) => (
        Math.abs(ghost.x + a[0] - pacPlayer.x) + Math.abs(ghost.y + a[1] - pacPlayer.y)
        - Math.abs(ghost.x + b[0] - pacPlayer.x) - Math.abs(ghost.y + b[1] - pacPlayer.y)
      ));
      const pick = Math.random() < chaseChance ? choices[0] : choices[Math.floor(Math.random() * choices.length)];
      ghost.x += pick[0];
      ghost.y += pick[1];
    }
  }

  updatePacTurnIndicator();
  drawPac();
  if (pacGhosts.some(ghost => ghost.x === pacPlayer.x && ghost.y === pacPlayer.y)) {
    pacEnd(false);
    return;
  }
  if (!pacDots.size) pacEnd(true);
}

function pacEnd(win) {
  clearInterval(pacTimer);
  pacActive = false;
  pacEnded = true;
  if (win) {
    const nextLevel = pacLevel + 1;
    showDialog('🏆', `Level ${pacLevel} cleared!`, `Great run! Level ${nextLevel} starts a little faster.`, 'Next level', () => {
      $('#pac-start').textContent = '↻ Restart';
      pacSetupLevel(nextLevel);
    });
  } else {
    $('#pac-message').textContent = `Caught by a ghost on Level ${pacLevel} — score ${pacScore}.`;
    showDialog('👻', 'Caught!', `Level ${pacLevel} · ${pacScore} points. Ready for another run?`, 'Play again', pacStart);
  }
}

$('#pac-start').addEventListener('click', pacStart);
$$('[data-pac-dir]').forEach(button => button.addEventListener('click', () => queuePacTurn(button.dataset.pacDir)));
drawPac();
updatePacTurnIndicator();

document.addEventListener('keydown', event => {
  if (document.querySelector('.view.active')?.id !== 'view-pacman') return;
  const key = event.key.toLowerCase();
  const direction = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  }[event.code] || {
    arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down',
    arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right',
  }[key];
  if (direction) {
    event.preventDefault();
    queuePacTurn(direction);
  }
}, true);
