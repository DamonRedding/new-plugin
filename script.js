(()=>{function d(n){if(n===document.body)return null;if(n.tagName!=="A")return d(n.parentElement);let t=n.getAttribute("href");return t===null||t[0]!=="#"?null:t.slice(1)}var S=".menu",g=".menu-toggle-button",f="--menu-visible",_=960;function w(){let n=document.querySelector(S),t=document.querySelector(g);function r(){document.body.classList.contains(f)===!0?document.body.classList.remove(f):document.body.classList.add(f),t.setAttribute("aria-expanded",t.getAttribute("aria-expanded")==="true"?"false":"true")}function l(e){window.innerWidth<_&&n.contains(e.target)&&d(e.target)!==null&&r()}n.addEventListener("click",l);function i(){r()}t.addEventListener("click",i);function a(e){document.body.classList.contains(f)===!1||t===e.target||n.contains(e.target)===!0||r()}window.addEventListener("click",a)}var y=".menu__toc",E="menu__active",M="[id]:not(h1)";function h(){window.history.scrollRestoration="manual";let n=document.querySelector(y);if(n===null)return;let t=L();function r(o,{pushState:c}){let u=t.find(function(T){return T.id===o});if(typeof u=="undefined")return l(),!1;let m={scrollY:u.scrollY};return c===!0?history.pushState(m,null,`#${o}`):history.replaceState(m,null,`#${o}`),window.scrollTo({top:u.scrollY}),l(),!0}function l(){let o=n.querySelector(`.${E}`);o!==null&&o.classList.remove(E);let c=Y(t);if(c===null)return;let u=n.querySelector(`[href="#${c}"]`);u!==null&&u.classList.add(E)}function i(o){if(o.metaKey===!0||o.shiftKey===!0)return;let c=d(o.target);c!==null&&r(c,{pushState:!0})===!0&&o.preventDefault()}window.addEventListener("click",i);function a(o){if(o.preventDefault(),o.state===null){window.scrollTo({top:0});return}window.scrollTo({top:o.state.scrollY})}window.addEventListener("popstate",a);function e(){t=L(),s()}window.addEventListener("resize",e);function s(){l(),history.replaceState({scrollY:window.scrollY},null,window.location.hash)}window.addEventListener("scroll",s);let p=window.location.hash.slice(1);p!==""&&r(p,{pushState:!1})}function L(){let n=Array.prototype.slice.call(document.body.querySelectorAll(M)),t=[];for(let e of n){let s=parseInt(getComputedStyle(e).scrollMarginTop);t.push({id:e.getAttribute("id"),scrollY:e.offsetTop-s})}let r=document.documentElement.offsetHeight-window.innerHeight,l=t[t.length-1].scrollY;if(l<=r)return t;let i=r-window.innerHeight,a=window.innerHeight/(l-i);return t.map(function(e,s){return e.scrollY<=i?e:s===t.length-1?{...e,scrollY:r}:{...e,scrollY:Math.round(i+(e.scrollY-i)*a)}})}function Y(n){for(let t of n.slice().reverse())if(t.scrollY<=window.scrollY)return t.id;return null}function A(){w(),h()}A();})();
