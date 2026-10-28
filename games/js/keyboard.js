// One code-based keyboard router handles all games, regardless of which control has focus.
    const directionByCode={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
    const directionByKey={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
    window.addEventListener('keydown',e=>{
      const key=e.key.toLowerCase(),direction=directionByCode[e.code]||directionByKey[key];
      const activeView=document.querySelector('.view.active')?.id||'';
      const game=activeView.startsWith('view-')?activeView.slice(5):current;
      let handled=false;
      if(game==='pong'&&['w','s','arrowup','arrowdown'].includes(key)){handled=true;pongKeys.add(key)}
      else if(game==='tetris'&&tActive){const controls={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowDown:'down',KeyS:'down',ArrowUp:'rotate',KeyW:'rotate',Space:'drop'};const action=controls[e.code];if(action){handled=true;if(action==='left')tMove(-1,0);else if(action==='right')tMove(1,0);else if(action==='down')tMove(0,1);else if(action==='rotate')tRotate();else if(action==='drop')while(tMove(0,1)){}}}
      else if(game==='tron'&&trRun&&direction){handled=true;const player=e.code.startsWith('Arrow')||key.startsWith('arrow')?1:0,p=trPlayers[player],v={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];if(!(v[0]===-p.dx&&v[1]===-p.dy))p.next={dx:v[0],dy:v[1]}}
      else if(game==='piano'){const note=pianoNotes.find(n=>n[2]===key);if(note&&!pianoDown.has(key)){handled=true;pianoDown.add(key);const b=$(`.piano-key[data-key="${key}"]`);if(b)playPiano(b)}}
      if(handled)e.preventDefault();
    },true);
    window.addEventListener('keyup',e=>{const key=e.key.toLowerCase();if(current==='pong')pongKeys.delete(key);if(current==='piano')pianoDown.delete(key)},true);
