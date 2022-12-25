"use strict";(()=>{function d(o){if(o===document.body)return null;if(o.tagName!=="A")return d(o.parentElement);let n=o.getAttribute("href");return n===null||n[0]!=="#"?null:n.slice(1)}function w({menuElementSelector:o,menuToggleButtonElementSelector:n,menuVisibleBodyClassName:t}){let e=document.querySelector(o),l=document.querySelector(n);function c(){document.body.classList.contains(t)===!0?document.body.classList.remove(t):document.body.classList.add(t),l.setAttribute("aria-expanded",l.getAttribute("aria-expanded")==="true"?"false":"true")}function u(r){window.innerWidth<960&&e.contains(r.target)&&d(r.target)!==null&&c()}e.addEventListener("click",u);function s(){c()}l.addEventListener("click",s);function i(r){document.body.classList.contains(t)===!1||l===r.target||e.contains(r.target)===!0||c()}window.addEventListener("click",i)}function E({headersElementSelector:o,tocElementSelector:n,activeTocItemClassName:t}){let e=h(o);if(window.innerWidth<960){let r=function(){a({activeTocItemClassName:t,headers:e,tocElementSelector:n})};var s=r;window.addEventListener("scroll",r);return}window.history.scrollRestoration="manual";function l(r){if(r.metaKey===!0||r.shiftKey===!0)return;let p=d(r.target);p!==null&&m({activeTocItemClassName:t,headers:e,id:p,pushState:!0,tocElementSelector:n})===!0&&r.preventDefault()}window.addEventListener("click",l);function c(r){if(r.preventDefault(),r.state===null){window.scrollTo({top:0});return}window.scrollTo({top:r.state.scrollY})}window.addEventListener("popstate",c);function u(){e=h(o),s()}window.addEventListener("resize",u);function s(){a({activeTocItemClassName:t,headers:e,tocElementSelector:n}),history.replaceState({scrollY:window.scrollY},null,window.location.hash)}window.addEventListener("scroll",s);let i=window.location.hash.slice(1);i!==""&&m({activeTocItemClassName:t,headers:e,id:i,pushState:!1,tocElementSelector:n})}function h(o){let n=Array.prototype.slice.call(document.body.querySelectorAll(o)),t=[];for(let i of n)t.push({id:i.getAttribute("id"),scrollY:i.offsetTop});let e=document.documentElement.offsetHeight-window.innerHeight;if(t[t.length-1].scrollY<=e)return t;let l=function(){let i=t.length-1;for(;i>=0;){if(t[i].scrollY<=e)return i;i-=1}return 0}(),c=e-t[l].scrollY,u=t[t.length-1].scrollY-t[l].scrollY,s=c/u;return t.map(function(i,r){return r<=l?i:r===t.length-1?{...i,scrollY:e}:{...i,scrollY:Math.round(t[l].scrollY+(i.scrollY-t[l].scrollY)*s)}})}function m({headers:o,id:n,pushState:t,tocElementSelector:e,activeTocItemClassName:l}){let c=o.find(function(s){return s.id===n});if(typeof c>"u")return a({activeTocItemClassName:l,headers:o,tocElementSelector:e}),!1;let u={scrollY:c.scrollY};return t===!0?history.pushState(u,null,`#${n}`):history.replaceState(u,null,`#${n}`),window.scrollTo({top:c.scrollY}),a({activeTocItemClassName:l,headers:o,tocElementSelector:e}),!0}function a({headers:o,tocElementSelector:n,activeTocItemClassName:t}){let e=document.querySelector(n),l=e.querySelector(`.${t}`);l!==null&&l.classList.remove(t);let c=g(o);if(c===null)return;let u=e.querySelector(`[href="#${c}"]`);u!==null&&u.classList.add(t)}function g(o){let n=Math.ceil(window.scrollY);for(let t of o.slice().reverse())if(t.scrollY<=n)return t.id;return null}function L(){w({menuElementSelector:".menu",menuToggleButtonElementSelector:".menu-toggle-button",menuVisibleBodyClassName:"--menu-visible"}),window.addEventListener("load",function(){E({activeTocItemClassName:"menu__active",headersElementSelector:"h2[id], h3[id], h4[id]",tocElementSelector:".menu__toc"})})}L();})();
