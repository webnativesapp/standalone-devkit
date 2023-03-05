!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="./assets/",t(0)}([function(e,t,n){(function(e){"use strict";var t,n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=t={PROTOCOL:"http",URL_SEPARATOR:"/",CONTENT_TYPE:{TEXT_PLAIN:"text/plain",APPLICATION_URLENCODED:"application/x-www-form-urlencoded",APPLICATION_JSON:"application/json",APPLICATION_XML:"application/xml",MULTIPART_FORM_DATA:"multipart/form-data"},REQUEST:{METHOD:{GET:"GET",POST:"POST",PUT:"PUT",DELETE:"DELETE",UPDATE:"UPDATE"}},RESPONSE:{STATUS:{NO_RESPONSE:{code:0,message:"No response"},OK:{code:200,message:"Ok"},NOT_MODIFIED:{code:304,message:"Not Modified"},UNAUTHORIZED:{code:403,message:"Unauthorized"},NOT_FOUND:{code:404,message:"Not Found"}}}},i=function(e){this.url=e.url||"/",this.formParams=[],this.headers=[],this.query=[],this.contentType=e.contentType||o.CONTENT_TYPE.TEXT_PLAIN,this.withCredentials=e.withCredentials||!1,this.method=e.method||o.REQUEST.METHOD.POST,this.onResponse=function(){},this.onTimeout=function(){},this.getUrl=function(){return this.query.length>0?this.url+"?"+this.buildQueryString(this.query):this.url},this.setUrl=function(e){this.url=e||"/"},this.getMethod=function(){return this.method},this.setMethod=function(e){this.method=e||o.REQUEST.METHOD.POST},this.setContentType=function(e){this.contentType=e},this.setQueryParam=function(e,t){return this.query.push({propName:e,value:t}),this},this.setFormParam=function(e,t){return this.formParams.push({propName:e,value:t}),this},this.setBody=function(e){return this.body=e,this},this.setHeader=function(e,t){var n={};return n[e]=t,this.headers.push(n),this},this.buildQueryString=function(e){for(var t="",n=0;n<e.length;n++){var o=e[n];t+=o[Object.keys(o)[0]]+"="+o[Object.keys(o)[1]],n<e.length-1&&(t+="&")}return t},this.build=function(e){if(e.withCredentials=this.withCredentials,e.overrideMimeType(this.contentType),e.setRequestHeader("Content-Type",this.contentType),this.headers.length>0)for(var t=0;t<this.headers.length;t++){var n=this.headers[t];e.setRequestHeader(Object.keys(n)[0],n[Object.keys(n)[0]])}if(this.formParams.length>0){if(this.contentType===o.CONTENT_TYPE.APPLICATION_URLENCODED)return this.buildQueryString(this.formParams);var i=new FormData;for(var r in this.formParams)i.append(this.formParams[r].propName,this.formParams[r].value);return i}return this.body}},r=function(e){try{this.status=e.status||e.code,404==e.status?this.body=e.response:(this.body=void 0!==e.response?JSON.parse(e.response):e.message,this.headers=e.getAllResponseHeaders())}catch(t){this.status=e.status||e.code,this.body=e.message||e.response}},s=function(e){var t=window.XMLHttpRequest,n=window.XDomainRequest;this.useHttp=e&&e.useHttp||!0,this.corsSupport=e&&e.corsSupport||!0,this.serverRequestFactory=function(e){var t=void 0;switch(e.type){case o.PROTOCOL:default:t=new i(e)}return t},this.sendRequest=function(e){e instanceof i&&this.sendHttpRequest(e)},this.createCORSRequest=function(e,o){var i=new t;return"withCredentials"in i?i.open(e,o,!0):"undefined"!=typeof n?(i=new n,i.open(e,o)):i=null,i},this.sendHttpRequest=function(e){var t=this,n=this.createCORSRequest(e.getMethod(),e.getUrl());if(!n)throw new Error("CORS not supported");n.onload=function(){e.onResponse(new r(n)),clearTimeout(e.timeoutHandler)},e.timeoutHandler=setTimeout(function(){e.onTimeout(new r(o.RESPONSE.STATUS.NO_RESPONSE)),e.timeoutHandler=null,clearTimeout(t)},e.timeout||1e4),n.onProgress=e.onProgress,n.onerror=function(){clearTimeout(e.timeoutHandler),e.onResponse(new r(o.RESPONSE.STATUS.NO_RESPONSE))},n.send(e.build(n))}},a=function(e){this.url=e&&e.baseUrl||"/",this.commLayer=new s({}),this.buildHttpRequest=function(){return this.commLayer.serverRequestFactory({type:t.PROTOCOL})},this.sendHttpRequest=function(e,n,o,i){e.onResponse=function(e){e.status===t.RESPONSE.STATUS.OK.code?n&&n(e.body,e.headers||[]):o&&o({code:e.status,message:e.message||e.body})},e.onRejected=function(){o&&o({code:0,message:"Canceled"})},e.timeout=i||36e5,e.onTimeout=function(){o&&o({code:-1,message:"Timeout"})},this.commLayer.sendRequest(e)},this.HTTP_GET=function(e,n,o){var i=this.buildHttpRequest();i.setUrl(e.url),i.setMethod(t.REQUEST.METHOD.GET),e.query&&e.query.map(function(e){i.setQueryParam(e.key,e.value)}),e.headers&&e.headers.map(function(e){i.setHeader(e.key,e.value)}),this.sendHttpRequest(i,n,o,e.timeout)},this.HTTP_POST=function(e,n,o){var i=this.buildHttpRequest();i.setUrl(e.url),i.setBody(e.body),i.setMethod(t.REQUEST.METHOD.POST),i.setContentType(e.contentType||t.CONTENT_TYPE.APPLICATION_JSON),e.query&&e.query.map(function(e){i.setQueryParam(e.key,e.value)}),e.form&&e.form.map(function(e){i.setFormParam(e.key,e.value)}),e.headers&&e.headers.map(function(e){i.setHeader(e.key,e.value)}),this.sendHttpRequest(i,n,o,e.timeout)}},u=new a({});window.Promise||(window.Promise=function(){function t(e,t){return function(){e.apply(t,arguments)}}function o(e){if("object"!==n(this))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],c(e,t(r,this),t(s,this))}function i(e){var t=this;return null===this._state?void this._deferreds.push(e):void l(function(){var n=t._state?e.onFulfilled:e.onRejected;if(null===n)return void(t._state?e.resolve:e.reject)(t._value);var o;try{o=n(t._value)}catch(t){return void e.reject(t)}e.resolve(o)})}function r(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"===("undefined"==typeof e?"undefined":n(e))||"function"==typeof e)){var o=e.then;if("function"==typeof o)return void c(t(o,e),t(r,this),t(s,this))}this._state=!0,this._value=e,a.call(this)}catch(e){s.call(this,e)}}function s(e){this._state=!1,this._value=e,a.call(this)}function a(){for(var e=0,t=this._deferreds.length;e<t;e++)i.call(this,this._deferreds[e]);this._deferreds=null}function u(e,t,n,o){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=o}function c(e,t,n){var o=!1;try{e(function(e){o||(o=!0,t(e))},function(e){o||(o=!0,n(e))})}catch(e){if(o)return;o=!0,n(e)}}var l="function"==typeof e&&e||function(e){setTimeout(e,1)},f=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};return o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var n=this;return new o(function(o,r){i.call(n,new u(e,t,o,r))})},o.all=function(){var e=Array.prototype.slice.call(1===arguments.length&&f(arguments[0])?arguments[0]:arguments);return new o(function(t,o){function i(s,a){try{if(a&&("object"===("undefined"==typeof a?"undefined":n(a))||"function"==typeof a)){var u=a.then;if("function"==typeof u)return void u.call(a,function(e){i(s,e)},o)}e[s]=a,0===--r&&t(e)}catch(e){o(e)}}if(0===e.length)return t([]);for(var r=e.length,s=0;s<e.length;s++)i(s,e[s])})},o.resolve=function(e){return e&&"object"===("undefined"==typeof e?"undefined":n(e))&&e.constructor===o?e:new o(function(t){t(e)})},o.reject=function(e){return new o(function(t,n){n(e)})},o.race=function(e){return new o(function(t,n){for(var o=0,i=e.length;o<i;o++)e[o].then(t,n)})},o._setImmediateFn=function(e){l=e},o}(void 0));var c="SiYPj5qDbJ",l=function(e){localStorage&&localStorage.setItem(c,btoa(JSON.stringify(e))),window.BUILD_TARGET="browser-desktop",window.BUILD_ENV="browser",window.DEBUG=!1,window.CONFIG=e;var t="al",n="ev",o=function(){var o=e.modules.debug,i=o,r=window[n+t],s="IyBzb3VyY2VVUkw";if(!o){var a=console.log;console.log=function(e){arguments.length>1?!!o&&a.apply(a,arguments):!!o&&a(e)};var c=console.error;console.error=function(e){arguments.length>1?!!o&&c.apply(c,arguments):!!o&&c(e)};var l=console.info;console.info=function(e){arguments.length>1?!!o&&l.apply(l,arguments):!!o&&l(e)};var f=console.warn;console.warn=function(e){arguments.length>1?!!o&&f.apply(f,arguments):!!o&&f(e)}}window.PWA_INSTALL={available:!1,ev:void 0,onReady:void 0},window.addEventListener("beforeinstallprompt",function(e){e.preventDefault(),window.PWA_INSTALL.available=!0,window.PWA_INSTALL.ev=e,window.PWA_INSTALL.onReady&&window.PWA_INSTALL.onReady()}),window.GC_LOADER=function(e){var t,n,o,a,c=e.document,l=e.CONFIG,f={startTime:Date.now(),init:function(e){function t(){++s;var e=i[r];if(e){var n=[];do{try{n.push(e.call())}catch(e){}++r,e=i[r]}while(e&&e.parallel);return Promise.all(n).then(t)}}c.title=l.title,n=l.modules.spritesheetsVersion||"",o="spritesheets/",a="spritesheets."+n+"/",f.scriptName=e;var i=f.pipeline,r=0,s=0;t()},fetchApp:function(){return t||(t=new Promise(function(e){onLoadApp=e})),t},addStep:function(e,t){this.pipeline.push({name:e,call:t})},getStepIndex:function(e){for(var t=this.pipeline.length-1;t>=0;--t)if(this.pipeline[t].name===e)return t},pipeline:[{name:"load-fonts",parallel:!1,call:function(){if(l.modules.fonts&&l.modules.fonts.length)return new Promise(function(e){var t=l.modules.fonts.length;l.modules.fonts.map(function(n){var o=new FontFace(n,"url(resources/fonts/"+n+".ttf)");o.load().then(function(n){c.fonts.add(n),t--,0==t&&e()}).catch(function(t){console.error(t),e()})})})}},{name:"load-fonts-dom",parallel:!0,call:function(){if(l.embeddedFonts=l.modules.fonts,l.embeddedFonts&&l.embeddedFonts.length){var e=1e4,t=0,n=c.body,o=l.embeddedFonts.map(function(e){var o=n.appendChild(c.createElement("span"));return o.innerHTML="giItT1WQy@!-/#",o.style.cssText="position:absolute;left:-9999px;font-size:100px;visibility:hidden;",t||(t=o.offsetWidth),o.style.fontFamily=e,o});return new Promise(function(i){function r(){clearInterval(a),clearTimeout(s),o.map(function(e){n.removeChild(e)}),i()}var s=setTimeout(r,e),a=setInterval(function(){for(var e=!0,n=0,i=o.length;n<i;++n)if(o[n].offsetWidth==t){e=!1;break}e&&r()},50)})}}},{name:"fetch-js",parallel:!0,call:function(){return new Promise(function(e){f.onLoadApp=e,u.HTTP_GET({url:f.scriptName},function(e){try{!i&&(e=e.replace(atob(s+"="),"")),e=e.split(o).join(a),r(e)}catch(e){console.info(e)}})}).then(function(e){f.initialImport=e})}},{name:"orientation-wait",parallel:!1,call:function(){if(!f.isOrientationValid)return new Promise(function(e){f.onOrientation=function(t){t&&(f.onOrientation=null,e())}})}},{name:"start-app",parallel:!1,call:function(){jsio(f.initialImport)}}]};return f}(window);var d=window.CONFIG.target+".js?build="+CONFIG.modules.build;GC_LOADER.isOrientationValid=!0,GC_LOADER.init(d)};o()};u.HTTP_GET({url:"config.json?dt="+Date.now()},l,function(e){try{l(JSON.parse(atob(localStorage&&localStorage.getItem(c)||"")))}catch(e){}}),console.log("%c Licenced Tools [(©)Web Natives CDT/"+((new Date).getFullYear())+ "]","font-weight: bold; font-size: 9px;color: darkred;")}).call(t,n(3).setImmediate)},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(l===setTimeout)return setTimeout(e,0);if((l===n||!l)&&setTimeout)return l=setTimeout,setTimeout(e,0);try{return l(e,0)}catch(t){try{return l.call(null,e,0)}catch(t){return l.call(this,e,0)}}}function r(e){if(f===clearTimeout)return clearTimeout(e);if((f===o||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function s(){m&&h&&(m=!1,h.length?p=h.concat(p):T=-1,p.length&&a())}function a(){if(!m){var e=i(s);m=!0;for(var t=p.length;t;){for(h=p,p=[];++T<t;)h&&h[T].run();T=-1,t=p.length}h=null,m=!1,r(e)}}function u(e,t){this.fun=e,this.array=t}function c(){}var l,f,d=e.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n}catch(e){l=n}try{f="function"==typeof clearTimeout?clearTimeout:o}catch(e){f=o}}();var h,p=[],m=!1,T=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];p.push(new u(e,t)),1!==p.length||m||i(a)},u.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.prependListener=c,d.prependOnceListener=c,d.listeners=function(e){return[]},d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(e,t,n){(function(e,t){!function(e,n){"use strict";function o(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var o={callback:e,args:t};return m[p]=o,h(p),p++}function i(e){delete m[e]}function r(e){var t=e.callback,o=e.args;switch(o.length){case 0:t();break;case 1:t(o[0]);break;case 2:t(o[0],o[1]);break;case 3:t(o[0],o[1],o[2]);break;default:t.apply(n,o)}}function s(e){if(T)setTimeout(s,0,e);else{var t=m[e];if(t){T=!0;try{r(t)}finally{i(e),T=!1}}}}function a(){h=function(e){t.nextTick(function(){s(e)})}}function u(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}function c(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"==typeof n.data&&0===n.data.indexOf(t)&&s(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),h=function(n){e.postMessage(t+n,"*")}}function l(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;s(t)},h=function(t){e.port2.postMessage(t)}}function f(){var e=y.documentElement;h=function(t){var n=y.createElement("script");n.onreadystatechange=function(){s(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function d(){h=function(e){setTimeout(s,0,e)}}if(!e.setImmediate){var h,p=1,m={},T=!1,y=e.document,v=Object.getPrototypeOf&&Object.getPrototypeOf(e);v=v&&v.setTimeout?v:e,"[object process]"==={}.toString.call(e.process)?a():u()?c():e.MessageChannel?l():y&&"onreadystatechange"in y.createElement("script")?f():d(),v.setImmediate=o,v.clearImmediate=i}}("undefined"==typeof self?"undefined"==typeof e?this:e:self)}).call(t,function(){return this}(),n(1))},function(e,t,n){(function(e){function o(e,t){this._id=e,this._clearFn=t}var i="undefined"!=typeof e&&e||"undefined"!=typeof self&&self||window,r=Function.prototype.apply;t.setTimeout=function(){return new o(r.call(setTimeout,i,arguments),clearTimeout)},t.setInterval=function(){return new o(r.call(setInterval,i,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(i,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n(2),t.setImmediate="undefined"!=typeof self&&self.setImmediate||"undefined"!=typeof e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||"undefined"!=typeof e&&e.clearImmediate||this&&this.clearImmediate}).call(t,function(){return this}())}]);
