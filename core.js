"use strict";
const CaminoCore=(()=>{
function coords(lat,lng){return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180}
function parseEmbed(input){let text=String(input).trim();if(text.includes('<')){let match=text.match(/\bsrc\s*=\s*["']([^"']+)["']/i);if(!match)throw Error('В коде не найден src iframe.');text=match[1].replace(/&amp;/g,'&')}
let u;try{u=new URL(text)}catch(e){throw Error('Вставьте полный код iframe или его HTTPS-ссылку.')}
if(u.protocol!=='https:'||!['www.google.com','maps.google.com','google.com'].includes(u.hostname)||!/^\/maps\/embed\/?$/.test(u.pathname)||u.username||u.password||u.port)throw Error('Нужна ссылка Google /maps/embed?pb=…, не обычная ссылка «Поделиться» и не Embed API.');
let pb=u.searchParams.get('pb')||'';if(!pb.includes('!6m8')||!pb.match(/!1s[^!]+/))throw Error('Не найдено встраивание Street View. Скопируйте код именно из режима панорамы.');
let m=pb.match(/!2m2!1d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/);if(!m||!coords(Number(m[1]),Number(m[2])))throw Error('Не удалось извлечь координаты панорамы. Выберите другое готовое встраивание.');
return {url:u.origin+u.pathname+'?'+new URLSearchParams({pb}),lat:Number(m[1]),lng:Number(m[2])}}
function distance(a,b){if(!coords(a.lat,a.lng)||!coords(b.lat,b.lng))throw Error('Недопустимые координаты');let rad=v=>v*Math.PI/180,x=rad(b.lat-a.lat),y=rad(b.lng-a.lng);let h=Math.sin(x/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(y/2)**2;return 6371*2*Math.atan2(Math.sqrt(Math.min(1,h)),Math.sqrt(Math.max(0,1-h)))}
function points(km){return km<=0.05?5000:Math.max(0,Math.round(5000*Math.exp(-km/100)))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function cleanLocation(x,i){if(!x||typeof x!=='object')throw Error('Некорректная запись');let lat=Number(x.lat),lng=Number(x.lng);if(!coords(lat,lng))throw Error('Некорректные координаты');let embed='';if(x.embed){let p=parseEmbed(x.embed);embed=p.url;lat=p.lat;lng=p.lng}let source='';try{let u=new URL(x.source);if(u.protocol==='https:')source=u.href}catch(e){}
return {id:String(x.id||'location-'+i).slice(0,100),name:String(x.name||'Место').slice(0,150),country:String(x.country||'').slice(0,80),route:String(x.route||'').slice(0,150),note:String(x.note||'').slice(0,2000),lat,lng,embed,source,confirmed:x.confirmed===true&&!!embed}}
function collection(data){if(!Array.isArray(data)||data.length>500)throw Error('Нужен JSON-массив, не более 500 точек');return data.map(cleanLocation)}
return {parseEmbed,distance,points,shuffle,cleanLocation,collection};
})();
