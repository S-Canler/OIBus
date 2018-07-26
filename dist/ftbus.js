!function(e){var t={};function o(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=23)}([function(e,t){e.exports=require("koa-router")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("minimist")},function(e,t,o){const r=o(2);e.exports={parseArgs:()=>{const e=r(process.argv.slice(2));return(({config:e="./fTbus.config.json"})=>!!e||(console.error("No config file specified, exemple: --config ./config/config.json"),!1))(e)?e:null}}},function(e,t,o){const r=o(1),n=(e,t,o)=>{const r=t.split("."),s=r.splice(0,1)[0];if(0!==r.length)return n(e[s],r.join("."),o);const c=e[s];return o&&delete e[s],c},s=(e,t,o={})=>e.reduce((e,r)=>{const s=n(r,t,!0);return e[s]||(e[s]=[]),e[s].push({...r,...o}),e},{}),c=(e,t,o)=>{return e.sort((e,o)=>{const r=n(e,t,!1),s=n(o,t,!1);return parseInt(r,16)-parseInt(s,16)}).reduce((e,r)=>{const s=n(r,t,!1),c=parseInt(s,16),i=16*Math.round(c/16),u=c<=i?i-16:i,a=16*Math.round((i+o)/16),l=((e,t)=>Object.keys(e).find(e=>{const o=e.split("-"),r=parseInt(o[0],10),n=parseInt(o[1],10);return t>=r&&t<=n}))(e,c)||`${u}-${a}`;return e[l]||(e[l]=[]),e[l].push(r),e},{})};e.exports=(e=>{const t=JSON.parse(r.readFileSync(e,"utf8"));if(!t)return console.error(`The file ${e} could not be loaded!`),!1;const o=t.reduce((e,{equipmentId:t,protocol:o,variables:n})=>{const i=JSON.parse(r.readFileSync(`./tests/${o}.config.json`,"utf8")),{addressGap:u}=i;if("modbus"===o){const r=s(n,"scanMode",{equipmentId:t});Object.keys(r).forEach(e=>{r[e]=s(r[e],"equipmentId"),Object.keys(r[e]).forEach(t=>{r[e][t]=s(r[e][t],`${o}.type`),Object.keys(r[e][t]).forEach(n=>{r[e][t][n]=c(r[e][t][n],`${o}.address`,u)})})}),Object.keys(r).forEach(t=>{e[t]||(e[t]={}),e[t]={...e[t],...r[t]}})}return e},{});return r.writeFile("./tests/optimizedConfig.json",JSON.stringify(o),"utf8",()=>{console.info("Optimized config file has been generated.")}),o})},function(e,t){e.exports=require("net")},function(e,t){e.exports=require("jsmodbus")},function(e,t,o){const r=o(6),n=o(5),s=o(4);e.exports=class{constructor(e){this.socket=new n.Socket,this.client=new r.client.TCP(this.socket),this.connected=!1,this.optimizedConfig=s(e)}poll(e){if(this.connected){const t=this.optimizedConfig[e];Object.keys(t).forEach(e=>{Object.keys(t[e]).forEach(o=>{const r=t[e][o],n=`read${`${o.charAt(0).toUpperCase()}${o.slice(1)}`}s`,s=(e,t)=>this.client[n](e,t).then(e=>{console.log("Response: ",JSON.stringify(e.response))}).catch(e=>{console.error(e),this.disconnect()});Object.keys(r).forEach(e=>{const t=e.split("-"),o=parseInt(t[0],10),r=parseInt(t[1],10);s(o,r-o)})})})}else console.error("You must be connected to run pol.")}connect(e){this.socket.connect({host:e,port:502}),this.connected=!0}disconnect(){this.socket.end(),this.connected=!1}}},function(e,t){e.exports=require("cron")},function(e,t){e.exports={getNode:function(e){const{query:t}=e.request,{node:o}=t,r=e.request.header.authorization||"";if(!r.startsWith("Basic "))throw new Error("The authorization header is either empty or isn't Basic.");{const e=r.split(" ")[1],t=Buffer.from(e,"base64").toString().split(":"),o=t[0],n=t[1];console.log(`request from ${o} with password:${n}`)}e.ok({node:o,query:t,comment:" node was requested!"})}}},function(e,t,o){const r=new(o(0)),n=o(9);r.get("/",n.getNode),e.exports=r.routes()},function(e,t){e.exports={getUser:function(e){const{query:t}=e.request,{user:o}=t;e.ok({user:o,query:t,comment:" user was requested!"})}}},function(e,t,o){const r=new(o(0)),n=o(11);r.get("/",n.getUser),e.exports=r.routes()},function(e,t,o){const r=o(12),n=o(10);e.exports=(e=>{e.prefix("/v1"),e.use("/users",r),e.use("/nodes",n)})},function(e,t){e.exports=require("koa-respond")},function(e,t){e.exports=require("koa-helmet")},function(e,t){e.exports=require("koa-bodyparser")},function(e,t,o){"use strict";e.exports=function(e){return e=Object.assign({},{allowMethods:"GET,HEAD,PUT,POST,DELETE,PATCH"},e),Array.isArray(e.exposeHeaders)&&(e.exposeHeaders=e.exposeHeaders.join(",")),Array.isArray(e.allowMethods)&&(e.allowMethods=e.allowMethods.join(",")),Array.isArray(e.allowHeaders)&&(e.allowHeaders=e.allowHeaders.join(",")),e.maxAge&&(e.maxAge=String(e.maxAge)),e.credentials=!!e.credentials,e.keepHeadersOnError=void 0===e.keepHeadersOnError||!!e.keepHeadersOnError,function(t,o){const r=t.get("Origin");if(t.vary("Origin"),!r)return o();let n;if("function"==typeof e.origin){if(!(n=e.origin(t)))return o()}else n=e.origin||r;const s={};function c(e,o){t.set(e,o),s[e]=o}if("OPTIONS"!==t.method)return c("Access-Control-Allow-Origin",n),!0===e.credentials&&c("Access-Control-Allow-Credentials","true"),e.exposeHeaders&&c("Access-Control-Expose-Headers",e.exposeHeaders),e.keepHeadersOnError?o().catch(e=>{throw e.headers=Object.assign({},e.headers,s),e}):o();{if(!t.get("Access-Control-Request-Method"))return o();t.set("Access-Control-Allow-Origin",n),!0===e.credentials&&t.set("Access-Control-Allow-Credentials","true"),e.maxAge&&t.set("Access-Control-Max-Age",e.maxAge),e.allowMethods&&t.set("Access-Control-Allow-Methods",e.allowMethods);let r=e.allowHeaders;r||(r=t.get("Access-Control-Request-Headers")),r&&t.set("Access-Control-Allow-Headers",r),t.status=204}}}},function(e,t){e.exports=require("koa-logger")},function(e,t){e.exports=require("koa-basic-auth")},function(e,t){e.exports=require("koa")},function(e,t,o){const r=o(20),n=o(0),s=o(19),c=(o(18),o(17)),i=o(16),u=o(15),a=o(14),l=new r,f=new n;l.use(u()),l.use(async(e,t)=>{try{await t()}catch(t){if(401!==t.status)throw t;e.status=401,e.set("WWW-Authenticate","Basic"),e.body="access was not authorized"}}),l.use(s({name:"jf",pass:"jfhjfh"})),l.use(c()),l.use(i({enableTypes:["json"],jsonLimit:"5mb",strict:!0,onerror(e,t){t.throw("body parse error",422)}})),l.use(a()),o(13)(f),l.use(f.routes()),l.use(f.allowedMethods()),e.exports=l},function(e,t){e.exports=require("dotenv")},function(e,t,o){o(22).config();const r=o(21),n=o(1),{CronJob:s}=o(8),c=o(7),i=o(3).parseArgs()||{},{configPath:u="./fTbus.config.json"}=i;u.endsWith(".json")||console.error("You must provide a json file for the configuration!");const a=e=>{try{return JSON.parse(n.readFileSync(e,"utf8"))}catch(e){return console.error(e),e}},l=a(u),{scanModes:f,configExemple:d}=l,p=a(f),h=new c(d);p?(h.connect("localhost"),p.forEach(({name:e,cronTime:t})=>{new s({cronTime:t,onTick:()=>h.poll(e),start:!1}).start()})):console.error("Frequences file not found.");const g=process.env.PORT||3333;r.listen(g,()=>console.info(`API server started on ${g}`))}]);