/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):'undefined'!=typeof module&&module.exports?module.exports=b():a.ReconnectingWebSocket=b()})(this,function(){function a(b,c,d){function f(o,p){var q=document.createEvent('CustomEvent');return q.initCustomEvent(o,!1,!1,p),q}var g={debug:!1,automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3,maxReconnectAttempts:null,binaryType:'arraybuffer'};d||(d={});var h=new TextEncoder('utf8');for(var i in g)this[i]='undefined'==typeof d[i]?g[i]:d[i];this.url=b,this.reconnectAttempts=0,this.readyState=WebSocket.CONNECTING,this.protocol=null;var k,j=this,l=!1,m=!1,n=document.createElement('div');n.addEventListener('open',function(o){j.onopen(o)}),n.addEventListener('close',function(o){j.onclose(o)}),n.addEventListener('connecting',function(o){j.onconnecting(o)}),n.addEventListener('message',function(o){j.onmessage(o)}),n.addEventListener('error',function(o){j.onerror(o)}),this.addEventListener=n.addEventListener.bind(n),this.removeEventListener=n.removeEventListener.bind(n),this.dispatchEvent=n.dispatchEvent.bind(n),this.open=function(o){if(k=new WebSocket(j.url,c||[]),k.binaryType=this.binaryType,!o)n.dispatchEvent(f('connecting')),this.reconnectAttempts=0;else if(this.maxReconnectAttempts&&this.reconnectAttempts>this.maxReconnectAttempts)return;j.debug||a.debugAll;var p=k,q=setTimeout(function(){j.debug||a.debugAll,m=!0,p.close(),m=!1},j.timeoutInterval);k.onopen=function(){clearTimeout(q),j.debug||a.debugAll,j.protocol=k.protocol,j.readyState=WebSocket.OPEN,j.reconnectAttempts=0;var t=f('open');t.isReconnect=o,o=!1,n.dispatchEvent(t)},k.onclose=function(r){if(clearTimeout(u),k=null,l)j.readyState=WebSocket.CLOSED,n.dispatchEvent(f('close'));else{j.readyState=WebSocket.CONNECTING;var t=f('connecting');t.code=r.code,t.reason=r.reason,t.wasClean=r.wasClean,n.dispatchEvent(t),o||m||(j.debug||a.debugAll,n.dispatchEvent(f('close')));var u=j.reconnectInterval*Math.pow(j.reconnectDecay,j.reconnectAttempts);setTimeout(function(){j.reconnectAttempts++,j.open(!0)},u>j.maxReconnectInterval?j.maxReconnectInterval:u)}},k.onmessage=function(r){j.debug||a.debugAll;var t=f('message');t.data=r.data,n.dispatchEvent(t)},k.onerror=function(){j.debug||a.debugAll,l||n.dispatchEvent(f('error'))}},!0===this.automaticOpen&&this.open(!1),this.send=function(o){if(k)return j.debug||a.debugAll,k.send(o);throw'INVALID_STATE_ERR : Pausing to reconnect websocket'},this.send_string=function(o){this.send(h.encode(o))},this.close=function(o,p){l=!0,'undefined'==typeof o&&(o=1e3),k&&k.close(o,p)},this.refresh=function(){k&&k.close()}}if('WebSocket'in window)return a.prototype.onopen=function(){},a.prototype.onclose=function(){},a.prototype.onconnecting=function(){},a.prototype.onmessage=function(){},a.prototype.onerror=function(){},a.debugAll=!1,a.CONNECTING=WebSocket.CONNECTING,a.OPEN=WebSocket.OPEN,a.CLOSING=WebSocket.CLOSING,a.CLOSED=WebSocket.CLOSED,a});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReconnectingWebSocket__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReconnectingWebSocket___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ReconnectingWebSocket__);
var SyncPlay=function(a,b,c,d){function g(K,L,M){var N={};if('undefined'==typeof M)return!1;var O=0==D||0!=E;O&&(N.playstate={},N.playstate.position=C.currentTime,N.playstate.paused=C.paused,K&&(N.playstate.doSeek=K,F=!1)),N.ping={},null!=L&&(N.ping.latencyCalculation=L),N.ping.clientLatencyCalculation=new Date().getTime()/1e3,N.ping.clientRtt=B,M&&(D+=1),(E||D)&&(N.ignoringOnTheFly={},E&&(N.ignoringOnTheFly.server=E,E=0),D&&(N.ignoringOnTheFly.client=D)),n({State:N})}function h(K){for(var O,L=I.decode(K.data),M=L.split('\r\n'),N=0;N<M.length&&''!=M[N];++N){if(O=JSON.parse(M[N]),O.hasOwnProperty('Hello')&&(w=O.Hello.motd,x({connected:!0,motd:w}),r!==O.Hello.username&&(r=O.Hello.username,C.dispatchEvent(new CustomEvent('namechange',{detail:{username:r}}))),l('joined')),O.hasOwnProperty('Error'))throw O.Error;if(O.hasOwnProperty('Set')&&O.Set.hasOwnProperty('user'))for(var P in O.Set.user){if(O.Set.user[P].hasOwnProperty('event')){var Q=new CustomEvent('userlist',{detail:{user:Object.keys(O.Set.user)[0],evt:Object.keys(O.Set.user[P].event)[0]},bubbles:!0,cancelable:!0});C.dispatchEvent(Q)}if(O.Set.user[P].hasOwnProperty('file')&&Object.keys(O.Set.user)[0]!=r){var Q=new CustomEvent('fileupdate',{detail:O.Set,bubbles:!0,cancelable:!0});C.dispatchEvent(Q)}}if(O.hasOwnProperty('List')){var R=Object.keys(O.List)[0],Q=new CustomEvent('listusers',{detail:O.List[R],bubbles:!0,cancelable:!0});C.dispatchEvent(Q)}if(O.hasOwnProperty('State'))if(B=O.State.ping.yourLatency,G=O.State.ping.latencyCalculation,J){var S=O.State.playstate;if(S.setBy){S.doSeek=!0;var Q=new CustomEvent('userevent',{detail:S,bubbles:!0,cancelable:!0});C.dispatchEvent(Q)}J=!1}else{if(O.State.hasOwnProperty('ignoringOnTheFly')){var T=O.State.ignoringOnTheFly;T.hasOwnProperty('server')?(E=T.server,D=0,H=!1):T.hasOwnProperty('client')&&T.client==D&&(D=0,H=!1)}if(O.State.playstate.hasOwnProperty('setBy')&&null!=O.State.playstate.setBy&&O.State.playstate.setBy!=r){var Q=new CustomEvent('userevent',{detail:O.State.playstate,bubbles:!0,cancelable:!0});H||D||(H=!1,C.dispatchEvent(Q))}g(F,G,H)}}}function j(){var K={Set:{file:{duration:z,name:y,size:A}}};n(K)}function k(){n({List:null})}function l(K){var L=r,M={Set:{user:{}}},N={room:{name:s},event:{}};N.event[K]=!0,M.Set.user[L]=N,n(M)}function m(){var K={Hello:{username:r,room:{name:s},version:q}};null!=t&&'undefined'!=typeof window.md5&&(K.Hello.password=window.md5(t)),n(K),k()}function n(K){var L=JSON.stringify(K);K=L+'\r\n',v.send_string(K)}var r,s,u,v,x,y,z,A,C,G,q='1.3.4',t=null,w=null,B=0,D=0,E=0,F=!1,H=!1,I=new TextDecoder('utf8'),J=!0;return function(K,L,M){u=K.url,s=K.room,C=M,r=K.name,x=L,K.hasOwnProperty('password')&&(t=K.password)}(b,c,a),{connect:function(){v=new __WEBPACK_IMPORTED_MODULE_0__ReconnectingWebSocket___default.a(u),v.onopen=m,v.onmessage=h,v.onerror=d},set_file:function(K,L,M){y=K,z=L,A=M,j()},disconnect:function(){v.close()},playPause:function(){H=!0},seeked:function(){F=!0,H=!0}}};window.SyncPlay=SyncPlay;

/***/ })
/******/ ]);