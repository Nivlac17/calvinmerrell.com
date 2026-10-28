(function(){
  const id = 'G-RQR96YE3ZD';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
  window.gtag('js', new Date());
  window.gtag('config', id);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);

  let gameStarted = false;
  function recordGameStart(){
    if(gameStarted || !document.body.hasAttribute('data-game')) return;
    gameStarted = true;
    window.gtag('event', 'game_start', {
      game_name: document.title.split(' | ')[0],
      game_path: window.location.pathname,
    });
  }
  document.addEventListener('pointerdown', event => {
    if(event.target.closest('.game-shell')) recordGameStart();
  }, true);
  document.addEventListener('keydown', event => {
    const isGameKey = ['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d','e','f','t','g','y','h','u','j','k'].includes(event.key.toLowerCase());
    if(isGameKey) recordGameStart();
  }, true);
})();
