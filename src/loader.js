/* eslint-disable */

// tiny script loader <https://gist.github.com/FND/69a7d6d59c7774a5ddb54cd93156a1fc>
export default function loadScripts(t,e){if(!t.length)return void(e&&e());t=t.slice();var r=t.shift();loadScript(r,function(){t.length?loadScripts(t,e):e&&e()},function(){throw new Error("failed to load script "+r)})}function loadScript(t,e,r){var n=document.createElement("script");n.addEventListener("load",e),r&&n.addEventListener("error",r),n.src=t,document.head.appendChild(n)}
