(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();let c={};S(()=>{const t=document.createElement("button");t.innerText="Profilinformationen kopieren",t.onclick=m;const e=document.querySelector('*[data-qa="more-button"]');g(t,e)});function s(){const e=document.querySelector('*[data-xds="IconLocationPin"]').parentNode.lastElementChild.textContent;l("city",e)}function u(){f()}function d(t){const e=/(\d{0,2}) Jahr/g,r=t.matchAll(e);let i=[];for(const n of r)i.push(Number(n[1])*12);return i}function f(){const e=[...document.getElementById("ProfileTimelineModule").querySelectorAll('*[data-xds="Headline"]')].filter(o=>o.innerText.includes("Berufliche Stationen")).at(0),r=[...e.parentNode.querySelectorAll(":scope > div")],i=[...e.parentNode.nextSibling.querySelectorAll('*[data-qa="bucket"]:first-child > div')];let n=[];r.forEach(o=>{n.push(o.querySelector('p[data-xds="BodyCopy"]').nextElementSibling.innerText)}),i.forEach(o=>{n.push(o.querySelector('p[data-xds="BodyCopy"]').nextElementSibling.innerText)}),console.log(d(n.join(" ")))}function m(){y(),p(),h(),u(),s(),console.log(c)}function p(){const e=[...document.querySelectorAll("h2")].filter(r=>r.textContent.includes("Gehaltsvorstellung"));if(e.length>0){const i=e[0].nextElementSibling.textContent;l("salary",i)}else l("salary","Nicht angegeben")}function y(){const e=document.querySelector('#XingIdModule *[data-xds="Hero"]').innerText.replace(/<(.|\n)*?>/g,"").split(`
`)[0].trim().split(" ");let r=e.pop(),i=typeof e=="string"?e:e.join(" ");l("firstname",i),l("lastname",r)}function h(){const t=document.querySelector('#XingIdModule *[data-xds="Hero"]').parentElement.nextElementSibling.querySelector("section p").textContent.split(",");let e=t[1];t.includes("Student")&&(e=t[0]+" "+t[1]),l("currentJob",e.trim())}function l(t,e){c[t]=e}function g(t,e){e&&e.parentNode&&e.parentNode.insertBefore(t,e.nextSibling)}function S(t){document.readyState==="complete"||document.readyState==="interactive"?setTimeout(t,1500):document.addEventListener("DOMContentLoaded",t)}typeof Element.prototype.clearChildren>"u"&&Object.defineProperty(Element.prototype,"clearChildren",{configurable:!0,enumerable:!1,value:function(){for(;this.firstChild;)this.removeChild(this.lastChild)}});
