const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
let current = document.body.dataset.game;
function showDialog(icon,title,copy,action,fn){$('#dialog-icon').textContent=icon;$('#dialog-title').textContent=title;$('#dialog-copy').textContent=copy;$('#dialog-action').textContent=action;$('#dialog-action').onclick=()=>{$('#win-overlay').classList.remove('show');fn()};$('#win-overlay').classList.add('show')}
