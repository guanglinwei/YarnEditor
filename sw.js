try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let n=e;return t.length>0&&(n+=" :: "+JSON.stringify(t)),n};class t extends Error{constructor(t,n){super(e(t,n)),this.name=t,this.details=n}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const n=e=>e&&"object"==typeof e?e:{handle:e};class s{constructor(e,t,s="GET"){this.handler=n(t),this.match=e,this.method=s}}class i extends s{constructor(e,t,n){super(({url:t})=>{const n=e.exec(t.href);if(n&&(t.origin===location.origin||0===n.index))return n.slice(1)},t,n)}}const c=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class r{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,n=this.handleRequest({request:t,event:e});n&&e.respondWith(n)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,n=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(n),e.ports&&e.ports[0]&&n.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const n=new URL(e.url,location.href);if(!n.protocol.startsWith("http"))return;const{params:s,route:i}=this.findMatchingRoute({url:n,request:e,event:t});let c,r=i&&i.handler;if(!r&&this.s&&(r=this.s),r){try{c=r.handle({url:n,request:e,event:t,params:s})}catch(e){c=Promise.reject(e)}return c instanceof Promise&&this.i&&(c=c.catch(s=>this.i.handle({url:n,request:e,event:t}))),c}}findMatchingRoute({url:e,request:t,event:n}){const s=this.t.get(t.method)||[];for(const i of s){let s;const c=i.match({url:e,request:t,event:n});if(c)return s=c,(Array.isArray(c)&&0===c.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(s=void 0),{route:i,params:s}}return{}}setDefaultHandler(e){this.s=n(e)}setCatchHandler(e){this.i=n(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const n=this.t.get(e.method).indexOf(e);if(!(n>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(n,1)}}let o;const a=()=>(o||(o=new r,o.addFetchListener(),o.addCacheListener()),o);function u(e,n,c){let r;if("string"==typeof e){const t=new URL(e,location.href);r=new s(({url:e})=>e.href===t.href,n,c)}else if(e instanceof RegExp)r=new i(e,n,c);else if("function"==typeof e)r=new s(e,n,c);else{if(!(e instanceof s))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=e}return a().registerRoute(r),r}const f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},l=e=>[f.prefix,e,f.suffix].filter(e=>e&&e.length>0).join("-"),d=e=>e||l(f.precache),h=e=>e||l(f.runtime),p=new Set;const b=(e,t)=>e.filter(e=>t in e),w=async({request:e,mode:t,plugins:n=[]})=>{const s=b(n,"cacheKeyWillBeUsed");let i=e;for(const e of s)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},g=async({cacheName:e,request:t,event:n,matchOptions:s,plugins:i=[]})=>{const c=await self.caches.open(e),r=await w({plugins:i,request:t,mode:"read"});let o=await c.match(r,s);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;o=await i.call(t,{cacheName:e,event:n,matchOptions:s,cachedResponse:o,request:r})}return o},m=async({cacheName:e,request:n,response:s,event:i,plugins:r=[],matchOptions:o})=>{const a=await w({plugins:r,request:n,mode:"write"});if(!s)throw new t("cache-put-with-no-response",{url:c(a.url)});const u=await(async({request:e,response:t,event:n,plugins:s=[]})=>{let i=t,c=!1;for(const t of s)if("cacheWillUpdate"in t){c=!0;const s=t.cacheWillUpdate;if(i=await s.call(t,{request:e,response:i,event:n}),!i)break}return c||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:r,response:s,request:a});if(!u)return;const f=await self.caches.open(e),l=b(r,"cacheDidUpdate"),d=l.length>0?await g({cacheName:e,matchOptions:o,request:a}):null;try{await f.put(a,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of p)await e()}(),e}for(const t of l)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:d,newResponse:u,request:a})},v=g;try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const y=async({request:e,fetchOptions:n,event:s,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const c=b(i,"fetchDidFail"),r=c.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const n=t.requestWillFetch,i=e.clone();e=await n.call(t,{request:i,event:s})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const o=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,n);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:s,request:o,response:t}));return t}catch(e){for(const t of c)await t.fetchDidFail.call(t,{error:e,event:s,originalRequest:r.clone(),request:o.clone()});throw e}};let R;async function q(e,t){const n=e.clone(),s={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=t?t(s):s,c=function(){if(void 0===R){const e=new Response("");if("body"in e)try{new Response(e.body),R=!0}catch(e){R=!1}R=!1}return R}()?n.body:await n.blob();return new Response(c,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function x(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:n,url:s}=e;if(!s)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!n){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(s,location.href),c=new URL(s,location.href);return i.searchParams.set("__WB_REVISION__",n),{cacheKey:i.href,url:c.href}}class U{constructor(e){this.o=d(e),this.u=new Map,this.l=new Map,this.h=new Map}addToCacheList(e){const n=[];for(const s of e){"string"==typeof s?n.push(s):s&&void 0===s.revision&&n.push(s.url);const{cacheKey:e,url:i}=x(s),c="string"!=typeof s&&s.revision?"reload":"default";if(this.u.has(i)&&this.u.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.u.get(i),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this.h.has(e)&&this.h.get(e)!==s.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.h.set(e,s.integrity)}if(this.u.set(i,e),this.l.set(i,c),n.length>0){const e=`Workbox is precaching URLs without revision info: ${n.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const n=[],s=[],i=await self.caches.open(this.o),c=await i.keys(),r=new Set(c.map(e=>e.url));for(const[e,t]of this.u)r.has(t)?s.push(e):n.push({cacheKey:t,url:e});const o=n.map(({cacheKey:n,url:s})=>{const i=this.h.get(n),c=this.l.get(s);return this.p({cacheKey:n,cacheMode:c,event:e,integrity:i,plugins:t,url:s})});return await Promise.all(o),{updatedURLs:n.map(e=>e.url),notUpdatedURLs:s}}async activate(){const e=await self.caches.open(this.o),t=await e.keys(),n=new Set(this.u.values()),s=[];for(const i of t)n.has(i.url)||(await e.delete(i),s.push(i.url));return{deletedURLs:s}}async p({cacheKey:e,url:n,cacheMode:s,event:i,plugins:c,integrity:r}){const o=new Request(n,{integrity:r,cache:s,credentials:"same-origin"});let a,u=await y({event:i,plugins:c,request:o});for(const e of c||[])"cacheWillUpdate"in e&&(a=e);if(!(a?await a.cacheWillUpdate({event:i,request:o,response:u}):u.status<400))throw new t("bad-precaching-response",{url:n,status:u.status});u.redirected&&(u=await q(u)),await m({event:i,plugins:c,response:u,request:e===n?o:new Request(e),cacheName:this.o,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.u}getCachedURLs(){return[...this.u.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.u.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,n=this.getCacheKeyForURL(t);if(n){return(await self.caches.open(this.o)).match(n)}}createHandler(e=!0){return async({request:n})=>{try{const e=await this.matchPrecache(n);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.o,url:n instanceof Request?n.url:n})}catch(t){if(e)return fetch(n);throw t}}}createHandlerBoundToURL(e,n=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const s=this.createHandler(n),i=new Request(e);return()=>s({request:i})}}let L;const N=()=>(L||(L=new U),L);const E=(e,t)=>{const n=N().getURLsToCacheKeys();for(const s of function*(e,{ignoreURLParametersMatching:t,directoryIndex:n,cleanURLs:s,urlManipulation:i}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const r=function(e,t=[]){for(const n of[...e.searchParams.keys()])t.some(e=>e.test(n))&&e.searchParams.delete(n);return e}(c,t);if(yield r.href,n&&r.pathname.endsWith("/")){const e=new URL(r.href);e.pathname+=n,yield e.href}if(s){const e=new URL(r.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:c});for(const t of e)yield t.href}}(e,t)){const e=n.get(s);if(e)return e}};let M=!1;function O(e){M||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:n=!0,urlManipulation:s}={})=>{const i=d();self.addEventListener("fetch",c=>{const r=E(c.request.url,{cleanURLs:n,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:s});if(!r)return;let o=self.caches.open(i).then(e=>e.match(r)).then(e=>e||fetch(r));c.respondWith(o)})})(e),M=!0)}const j=[],K={get:()=>j,add(e){j.push(...e)}},S=e=>{const t=N(),n=K.get();e.waitUntil(t.install({event:e,plugins:n}).catch(e=>{throw e}))},T=e=>{const t=N();e.waitUntil(t.activate())};var C;self.addEventListener("install",()=>self.skipWaiting()),C={},function(e){N().addToCacheList(e),e.length>0&&(self.addEventListener("install",S),self.addEventListener("activate",T))}([{url:"css/0.css",revision:"2e96f0c1e8cd06b5e690edbe72dab7f8"},{url:"fonts/context-menu-icons.eot",revision:"cc26e986ac53238679cef6af5cbc5104"},{url:"fonts/context-menu-icons.ttf",revision:"66fe7d78e602880e529daf66c8cb85d3"},{url:"fonts/context-menu-icons.woff",revision:"4568f559933f6b3db786835cf61387b1"},{url:"fonts/context-menu-icons.woff2",revision:"3124260e1569c74431e23dd130111455"},{url:"fonts/droid-sans-mono.ttf",revision:"a267c0b23e4794a4d9f2092027ab0fc7"},{url:"icon.ico",revision:"0158a98eda5da93408305a8f817bd61e"},{url:"icon_128x128.png",revision:"54a04953b96717b70ace1f2bcae537c1"},{url:"icon_192x192.png",revision:"bd585463236696d22e72c822e9e2c36e"},{url:"icon_32x32.ico",revision:"0158a98eda5da93408305a8f817bd61e"},{url:"icon_512x512.png",revision:"41a610c236dfc4ca3db11af9f1d1efd1"},{url:"icon_96x96.png",revision:"4f50d85588e2e334596e0bcc71892e42"},{url:"index.html",revision:"f4ba43e63eb171a9b6122cbfadb4cc39"},{url:"js/main.9818f500ca746c5b4b1f.js",revision:"066a753053ce99522377ee978647ee3c"},{url:"js/runtime.9818f500ca746c5b4b1f.js",revision:"bac88d544bdbbe5a66ee018b2815af84"},{url:"manifest.json",revision:"6b7daa33d864bef972bf5618467f82ac"},{url:"public/dictionaries/en/index.aff",revision:"ff0059b0644df7008c9f635f77da7601"},{url:"public/dictionaries/en/index.dic",revision:"2f6e098411997f3d1217865bb468947f"},{url:"public/droid-sans-mono.ttf",revision:"a267c0b23e4794a4d9f2092027ab0fc7"},{url:"public/icon.ico",revision:"0158a98eda5da93408305a8f817bd61e"},{url:"public/icon.png",revision:"73d45685f29fa05223dbb6cf7fb57097"},{url:"public/images/append.png",revision:"f6d9b17fab77f5116fcb9367bb730da4"},{url:"public/images/dropbox.ico",revision:"51e2de798b41db26b6a0ec187959d394"},{url:"public/images/exp-data.png",revision:"3f259048a63c7510c24191f8f75a3a61"},{url:"public/images/github.png",revision:"665125bd6068ffdbbe1b24ed10dfb5e3"},{url:"public/images/icons.png",revision:"4207a97346300aecc34f2e8ba8d1d3d3"},{url:"public/images/octocat.png",revision:"ad821a254e7d9825608ab2dca943a8c5"},{url:"public/images/open.png",revision:"2fb289a60caf8b144cf79e3a6303538e"},{url:"public/images/pixel.png",revision:"85f678b520893f6007833e0ae0a1f106"},{url:"public/images/settings.png",revision:"b219cce95da1546e5a67b0b2b7172831"},{url:"public/images/sort.png",revision:"ce7bbb86723161b4a009b50262f4b926"},{url:"public/images/twine-favicon-152.png",revision:"83e847f2aeb1d4f8f7f05cbb6be593c8"},{url:"public/images/undo-redo.png",revision:"7270caeb2954001e5e664969bb396998"},{url:"public/images/xml.png",revision:"1d9125c9fff6c12cae0797f710b5e24c"},{url:"public/images/zooms.png",revision:"e38ef1d5f375d28f0f07ad7ee7dde609"},{url:"public/mode-yarn.js",revision:"e20980af69280ee37603e4c6bb8ee7d6"},{url:"public/templates/node.html",revision:"df3a64e933f73f88115992eedc6c80a6"},{url:"public/theme-yarn.js",revision:"2fe43fbb7c796eddba021471ef0262ea"},{url:"public/themes/blueprint.css",revision:"5dcacd2686408d6d659f8850ae85fb73"},{url:"public/themes/classic.css",revision:"87d3fd85e2954b1a2f64c9f5b2efcec3"},{url:"public/version.json",revision:"aba18ab0e0b6c3fa5ca27e878b6ce255"}]),O(C),u(/share-target/,async({event:e})=>{const t=await e.request.formData(),n=await caches.open("images");return alert("er"),await n.put("/images/"+Date.now(),new Response(t.get("image"))),Response.redirect("/",303)},"POST"),u(/\/images\/\d+/,new class{constructor(e={}){this.o=h(e.cacheName),this.g=e.plugins||[],this.m=e.matchOptions}async handle({event:e,request:n}){"string"==typeof n&&(n=new Request(n));const s=await v({cacheName:this.o,request:n,event:e,matchOptions:this.m,plugins:this.g});if(!s)throw new t("no-response",{url:n.url});return s}}({cacheName:"images",plugins:[]}),"GET");
