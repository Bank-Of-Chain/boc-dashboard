(self.webpackChunkboc_dashboard=self.webpackChunkboc_dashboard||[]).push([[566,571],{40684:function(i,o,t){"use strict";var n=t(67294),a=t(19756),e=t(22122),l=t(63349),f=t(41788),r=t(59864),m=t(8679),x=t.n(m);function y(c,h){if(!c){var O=new Error("loadable: "+h);throw O.framesToPop=1,O.name="Invariant Violation",O}}function U(c){console.warn("loadable: "+c)}var W=n.createContext(),M="__LOADABLE_REQUIRED_CHUNKS__";function d(c){return""+c+M}var Z=Object.freeze({__proto__:null,getRequiredChunkKey:d,invariant:y,Context:W}),A={initialChunks:{}},I="PENDING",_="RESOLVED",P="REJECTED";function Y(c){return typeof c=="function"?{requireAsync:c,resolve:function(){},chunkName:function(){}}:c}var Q=function(h){var O=function(et){return n.createElement(W.Consumer,null,function(w){return n.createElement(h,Object.assign({__chunkExtractor:w},et))})};return h.displayName&&(O.displayName=h.displayName+"WithChunkExtractor"),O},X=function(h){return h};function G(c){var h=c.defaultResolveComponent,O=h===void 0?X:h,$=c.render,et=c.onLoad;function w(q,p){p===void 0&&(p={});var C=Y(q),nt={};function at(v){return p.cacheKey?p.cacheKey(v):C.resolve?C.resolve(v):"static"}function rt(v,F,S){var u=p.resolveComponent?p.resolveComponent(v,F):O(v);if(p.resolveComponent&&!(0,r.isValidElementType)(u))throw new Error("resolveComponent returned something that is not a React component!");return x()(S,u,{preload:!0}),u}var ot=function(F){var S=at(F),u=nt[S];return(!u||u.status===P)&&(u=C.requireAsync(F),u.status=I,nt[S]=u,u.then(function(){u.status=_},function(s){console.error("loadable-components: failed to asynchronously load component",{fileName:C.resolve(F),chunkName:C.chunkName(F),error:s&&s.message}),u.status=P})),u},T=function(v){(0,f.Z)(F,v),F.getDerivedStateFromProps=function(s,H){var z=at(s);return(0,e.Z)({},H,{cacheKey:z,loading:H.loading||H.cacheKey!==z})};function F(u){var s;return s=v.call(this,u)||this,s.state={result:null,error:null,loading:!0,cacheKey:at(u)},y(!u.__chunkExtractor||C.requireSync,"SSR requires `@loadable/babel-plugin`, please install it"),u.__chunkExtractor?(p.ssr===!1||(C.requireAsync(u).catch(function(){return null}),s.loadSync(),u.__chunkExtractor.addChunk(C.chunkName(u))),(0,l.Z)(s)):(p.ssr!==!1&&(C.isReady&&C.isReady(u)||C.chunkName&&A.initialChunks[C.chunkName(u)])&&s.loadSync(),s)}var S=F.prototype;return S.componentDidMount=function(){this.mounted=!0;var s=this.getCache();s&&s.status===P&&this.setCache(),this.state.loading&&this.loadAsync()},S.componentDidUpdate=function(s,H){H.cacheKey!==this.state.cacheKey&&this.loadAsync()},S.componentWillUnmount=function(){this.mounted=!1},S.safeSetState=function(s,H){this.mounted&&this.setState(s,H)},S.getCacheKey=function(){return at(this.props)},S.getCache=function(){return nt[this.getCacheKey()]},S.setCache=function(s){s===void 0&&(s=void 0),nt[this.getCacheKey()]=s},S.triggerOnLoad=function(){var s=this;et&&setTimeout(function(){et(s.state.result,s.props)})},S.loadSync=function(){if(!!this.state.loading)try{var s=C.requireSync(this.props),H=rt(s,this.props,D);this.state.result=H,this.state.loading=!1}catch(z){console.error("loadable-components: failed to synchronously load component, which expected to be available",{fileName:C.resolve(this.props),chunkName:C.chunkName(this.props),error:z&&z.message}),this.state.error=z}},S.loadAsync=function(){var s=this,H=this.resolveAsync();return H.then(function(z){var it=rt(z,s.props,D);s.safeSetState({result:it,loading:!1},function(){return s.triggerOnLoad()})}).catch(function(z){return s.safeSetState({error:z,loading:!1})}),H},S.resolveAsync=function(){var s=this.props,H=s.__chunkExtractor,z=s.forwardedRef,it=(0,a.Z)(s,["__chunkExtractor","forwardedRef"]);return ot(it)},S.render=function(){var s=this.props,H=s.forwardedRef,z=s.fallback,it=s.__chunkExtractor,dt=(0,a.Z)(s,["forwardedRef","fallback","__chunkExtractor"]),ut=this.state,lt=ut.error,ct=ut.loading,ht=ut.result;if(p.suspense){var vt=this.getCache()||this.loadAsync();if(vt.status===I)throw this.loadAsync()}if(lt)throw lt;var ft=z||p.fallback||null;return ct?ft:$({fallback:ft,result:ht,options:p,props:(0,e.Z)({},dt,{ref:H})})},F}(n.Component),tt=Q(T),D=n.forwardRef(function(v,F){return n.createElement(tt,Object.assign({forwardedRef:F},v))});return D.displayName="Loadable",D.preload=function(v){D.load(v)},D.load=function(v){return ot(v)},D}function st(q,p){return w(q,(0,e.Z)({},p,{suspense:!0}))}return{loadable:w,lazy:st}}function L(c){return c.__esModule?c.default:c.default||c}var V=G({defaultResolveComponent:L,render:function(h){var O=h.result,$=h.props;return n.createElement(O,$)}}),J=V.loadable,K=V.lazy,E=G({onLoad:function(h,O){h&&O.forwardedRef&&(typeof O.forwardedRef=="function"?O.forwardedRef(h):O.forwardedRef.current=h)},render:function(h){var O=h.result,$=h.props;return $.children?$.children(O):null}}),j=E.loadable,N=E.lazy,k=typeof window!="undefined";function b(c,h){c===void 0&&(c=function(){});var O=h===void 0?{}:h,$=O.namespace,et=$===void 0?"":$,w=O.chunkLoadingGlobal,st=w===void 0?"__LOADABLE_LOADED_CHUNKS__":w;if(!k)return U("`loadableReady()` must be called in browser only"),c(),Promise.resolve();var q=null;if(k){var p=d(et),C=document.getElementById(p);if(C){q=JSON.parse(C.textContent);var nt=document.getElementById(p+"_ext");if(nt){var at=JSON.parse(nt.textContent),rt=at.namedChunks;rt.forEach(function(T){A.initialChunks[T]=!0})}else throw new Error("loadable-component: @loadable/server does not match @loadable/component")}}if(!q)return U("`loadableReady()` requires state, please use `getScriptTags` or `getScriptElements` server-side"),c(),Promise.resolve();var ot=!1;return new Promise(function(T){window[st]=window[st]||[];var tt=window[st],D=tt.push.bind(tt);function v(){q.every(function(F){return tt.some(function(S){var u=S[0];return u.indexOf(F)>-1})})&&(ot||(ot=!0,T()))}tt.push=function(){D.apply(void 0,arguments),v()},v()}).then(c)}var B=J;B.lib=j;var R=K;R.lib=N;var g=null;o.ZP=B},6371:function(i){i.exports={container:"container___3FHkQ"}},91907:function(i,o,t){"use strict";var n=t(13062),a=t(36725),e=t(89032),l=t(1635),f=t(88983),r=t(82530),m=t(67294),x=t(65367),y=t(89850),U=t(53651),W=t(35161),M=t.n(W),d=t(63105),Z=t.n(d),A=t(62904),I=t(43077),_=t(6371),P=t.n(_),Y=t(85893),Q=M()(Z()(y.ZP,function(G){return!(U.ux&&G.id==="137")}),function(G){return{label:G.name,value:G.id}}),X=function(L){var V=L.shouldChangeChain,J=(0,x.tT)("@@initialState"),K=J.initialState,E=(0,I.Z)(),j=E.userProvider,N=E.getWalletName,k=function(B){var R=x.m8.location.query.vault,g=Promise.resolve();V&&(g=(0,A.u)(B,j,N(),{resolveWhenUnsupport:!0})),g.then(function(){x.m8.push({query:{chain:B,vault:R}}),setTimeout(function(){location.reload()},100)})};return(0,Y.jsx)(a.Z,{children:(0,Y.jsx)(l.Z,{span:24,className:P().container,children:(0,Y.jsx)(r.ZP.Group,{size:"large",onChange:function(B){return k(B.target.value)},value:K.chain,buttonStyle:"solid",children:M()(Q,function(b,B){return(0,Y.jsx)(r.ZP.Button,{style:{padding:"1rem 5rem",height:"auto",lineHeight:1},value:b.value,children:b.label},B)})})})})};o.Z=X},98821:function(i,o,t){"use strict";t.d(o,{$c:function(){return m}});var n=t(20228),a=t(11382),e=t(67294),l=t(40684),f=t(85893),r=(0,f.jsx)(a.Z,{style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:20,fontSize:14},tip:"Loading...."}),m=(0,l.ZP)(function(){return Promise.all([t.e(80),t.e(23),t.e(462),t.e(272)]).then(t.bind(t,56272))},{fallback:r}),x=(0,l.ZP)(function(){return Promise.all([t.e(80),t.e(23),t.e(693),t.e(42)]).then(t.bind(t,59042))},{fallback:r}),y=(0,l.ZP)(function(){return Promise.all([t.e(80),t.e(274),t.e(417)]).then(t.bind(t,48417))},{fallback:r})},42411:function(i,o,t){"use strict";t.d(o,{Z:function(){return G}});var n=t(11849),a=t(30381),e=t.n(a),l=t(41609),f=t.n(l),r=t(76492),m="52px";function x(L){var V=!f()(L.seriesData)&&L.dataZoom,J={animation:!1,textStyle:{color:"#fff"},grid:{top:40,left:"0%",right:"5%",bottom:V?m:"0%",containLabel:!0},tooltip:{trigger:"axis",borderWidth:0,backgroundColor:"#292B2E",textStyle:{color:"#fff"}},xAxis:{type:"category",data:L.xAxisData},yAxis:{type:"value"},dataZoom:V?L.dataZoom:null,color:["#A68EFE","#5470c6","#91cc75"],series:[{name:L.seriesName?L.seriesName:"",data:L.seriesData,type:"line",lineStyle:{color:L.color?L.color:{type:"linear",colorStops:[{offset:0,color:"rgb(204, 186, 250)"},{offset:.5,color:"rgb(144, 123, 247)"},{offset:.6,color:"rgb(95, 128, 249)"},{offset:.95,color:"rgb(80, 132, 250)"},{offset:1,color:"rgb(166, 192, 252)"}]},width:3},smooth:L.smooth,step:L.step}]};return(0,n.Z)((0,n.Z)({},(0,r.s)(L.seriesData.length>0)),J)}var y=t(84486),U=t.n(y),W=t(7654),M=t.n(W),d=t(52353),Z=t.n(d),A=t(14293),I=t.n(A),_=t(63105),P=t.n(_),Y=t(84238),Q=t.n(Y),X=function(V,J,K){var E=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},j=E.format,N=j===void 0?"MM-DD HH:mm":j,k=E.xAxis,b=E.yAxis,B=E.smooth,R=B===void 0?!1:B,g=E.step,c=E.dataZoom,h=E.needMinMax,O=h===void 0?!0:h,$=E.yAxisMin,et=$===void 0?function(D){return parseInt(D.min*.9999*Math.pow(10,4))/Math.pow(10,4)}:$,w=E.yAxisMax,st=w===void 0?function(D){return parseInt(D.max*1.0001*Math.pow(10,4))/Math.pow(10,4)}:w,q=E.tootlTipSuffix,p=q===void 0?"(UTC)":q,C=E.tootlTipFormat,nt=C===void 0?"YYYY-MM-DD HH:mm":C,at=[],rt=[],ot={};V.forEach(function(D){var v=e()(D.date).add(1,"days").format(nt);p&&(v="".concat(v," ").concat(p)),ot[v]=e()(D.date).add(1,"days").format(N),at.push(v),rt.push(D[J])});var T=x({xAxisData:at,seriesName:K,seriesData:rt,smooth:R,dataZoom:c});if(T.yAxis=(0,n.Z)((0,n.Z)({},T.yAxis),b),T.xAxis=(0,n.Z)((0,n.Z)({axisLabel:{formatter:function(v){return ot[v]}}},T.xAxis),k),T.yAxis.splitLine={lineStyle:{color:"#454459"}},O&&(T.yAxis.min=et,T.yAxis.max=st),T.series[0].connectNulls=!0,T.series[0].showSymbol=Q()(P()(rt,function(D){return!I()(D)}))===1,T.series[0].lineStyle={width:5,cap:"round"},g){var tt=T.series[0].data;U()(tt,function(D,v){(Z()(D)||M()(D))&&v!==0&&(tt[v]=tt[v-1])})}return T},G=X},76492:function(i,o,t){"use strict";t.d(o,{s:function(){return n}});function n(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;return a?{}:{graphic:{type:"text",left:"center",top:"middle",silent:!0,invisible:!1,style:{fill:"#9d9d9d",fontWeight:"bold",text:"No Data",fontSize:"25px"}}}}},53651:function(i,o,t){"use strict";t.d(o,{Gj:function(){return n},KR:function(){return a},ux:function(){return e}});var n={daily:"daily",monthly:"monthly",weekly:"weekly",yearly:"yearly"},a={usdi:"USDi",ethi:"ETHi"},e=!1},7594:function(i,o,t){"use strict";t.r(o);var n=t(57106),a=t(99683),e=t(57663),l=t(71577),f=t(67294),r=t(65367),m=t(85893),x=function(){return(0,m.jsx)(a.ZP,{status:"404",title:"404",subTitle:"Sorry, the page you visited does not exist.",extra:(0,m.jsx)(l.Z,{type:"primary",onClick:function(){return r.m8.push("/")},children:"Back Home"})})};o.default=x},89129:function(i,o,t){"use strict";t.r(o),t.d(o,{default:function(){return V}});var n=t(32059),a=t(67294),e=t(65367),l=t(42411),f=t(35161),r=t.n(f),m=t(56721),x=t(9292),y=t(21349),U=t(98821),W=t(96486),M=function(K,E){return(0,W.isEmpty)("".concat(K))||(0,W.isEmpty)(E)?Promise.reject("chainId and vaultAddress should not be empty"):(0,e.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(K,"/vaults/").concat(E,"/rate_history"),{})},d=t(85893),Z=function(){var K=(0,e.tT)("@@initialState"),E=K.initialState,j=(0,e.QT)(function(){return M(E.chain,E.vaultAddress)},{manual:!1,paginated:!0,formatResult:function(g){var c=g.content;return{total:g.totalElements,list:r()(c,function(h){return h})}}}),N=j.data,k=j.loading,b=r()(N==null?void 0:N.list,function(R){return{value:(0,x.FH)(R.rate,1e18),date:(0,m.w)(R.validateTime,"YYYY-MM-DD")}}),B=(0,l.Z)(b,"value","price",{format:"MM-DD",yAxisMin:function(g){return(1-Math.max(Math.abs(g.min-1),Math.abs(g.max-1)))*.97},yAxisMax:function(g){return(1+Math.max(Math.abs(g.min-1),Math.abs(g.max-1)))*1.03},xAxis:{axisTick:{alignWithLabel:!0}},yAxis:{axisLabel:{formatter:function(g){return g.toFixed(6)}}},dataZoom:[{end:100,start:b.length<30?0:100*(1-30/b.length)}]});return(0,d.jsx)(y.Z,{children:(0,d.jsx)(a.Suspense,{fallback:null,children:!k&&(0,d.jsx)(U.$c,{option:B,style:{minHeight:"37rem",width:"100%"}})})})},A=Z,I=t(91907),_=function(){var K=(0,e.tT)("@@initialState"),E=K.initialState,j=(0,e.QT)(function(){return M(E.chain,E.vaultAddress)},{manual:!1,paginated:!0,formatResult:function(g){var c=g.content;return{total:g.totalElements,list:r()(c,function(h){return h})}}}),N=j.data,k=j.loading,b=r()(N==null?void 0:N.list,function(R){return{value:(0,x.FH)(R.rate,1e18),date:(0,m.w)(R.validateTime,"YYYY-MM-DD")}}),B=(0,l.Z)(b,"value","date",{format:"MM-DD",yAxisMin:function(g){return(1-Math.max(Math.abs(g.min-1),Math.abs(g.max-1)))*.97},yAxisMax:function(g){return(1+Math.max(Math.abs(g.min-1),Math.abs(g.max-1)))*1.03},xAxis:{axisTick:{alignWithLabel:!0}},yAxis:{axisLabel:{formatter:function(g){return g.toFixed(6)}}},dataZoom:[{end:100,start:b.length<30?0:100*(1-30/b.length)}]});return(0,d.jsxs)(y.Z,{children:[(0,d.jsx)(a.Suspense,{fallback:null,children:(0,d.jsx)(I.Z,{})}),(0,d.jsx)(a.Suspense,{fallback:null,children:!k&&(0,d.jsx)(U.$c,{option:B,style:{minHeight:"37rem",width:"100%"}})})]})},P=_,Y=t(7594),Q=t(1123),X=t(52353),G=t.n(X),L=function(){var K,E=(0,e.tT)("@@initialState"),j=E.initialState,N=(K={},(0,n.Z)(K,Q._.USDi,P),(0,n.Z)(K,Q._.ETHi,A),K)[j.vault];return G()(N)?(0,d.jsx)(Y.default,{}):(0,d.jsx)(N,{})},V=L},56721:function(i,o,t){"use strict";t.d(o,{w:function(){return e}});var n=t(30381),a=t.n(n),e=function(f,r){return a()(f).utcOffset(0).format(r)}},9292:function(i,o,t){"use strict";t.d(o,{FH:function(){return r},Wl:function(){return x},Ik:function(){return y},Ay:function(){return U}});var n=t(905),a=t(96486),e=t.n(a),l=t(41609),f=t.n(l),r=function(M){var d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;if(!(0,a.isNil)(M)){if((0,a.isNull)(d))return M.toString();var Z=(0,n.Z)(d.toString());if(f()(M)||Z.isZero())return 0;var A=(0,n.Z)(M.toString()).div(Z);if(A.isInteger())return A.toFixed();for(var I=arguments.length,_=new Array(I>2?I-2:0),P=2;P<I;P++)_[P-2]=arguments[P];return A.toFixed.apply(A,_)}},m=2,x=function(M,d){var Z=arguments.length>2&&arguments[2]!==void 0?arguments[2]:m,A=(0,n.Z)(M.toString()),I=(0,n.Z)(10).pow(d),_=d>6&&!A.eq(0)&&A.abs().lt((0,n.Z)(10).pow(d-Z+1)),P;return _?(P=r(A,I,d-A.abs().toString().length+1),P):(P=r(A,I,Z),parseFloat(P))},y=function(M){var d=parseFloat(M);return isNaN(d)?M:d<=1e3?d:"1000+"},U=function(M){var d=parseFloat(M);return isNaN(d)?M:d<=1e3?d:1e3}},77412:function(i){function o(t,n){for(var a=-1,e=t==null?0:t.length;++a<e&&n(t[a],a,t)!==!1;);return t}i.exports=o},48983:function(i,o,t){var n=t(40371),a=n("length");i.exports=a},80760:function(i,o,t){var n=t(89881);function a(e,l){var f=[];return n(e,function(r,m,x){l(r,m,x)&&f.push(r)}),f}i.exports=a},54290:function(i,o,t){var n=t(6557);function a(e){return typeof e=="function"?e:n}i.exports=a},62689:function(i){var o="\\ud800-\\udfff",t="\\u0300-\\u036f",n="\\ufe20-\\ufe2f",a="\\u20d0-\\u20ff",e=t+n+a,l="\\ufe0e\\ufe0f",f="\\u200d",r=RegExp("["+f+o+e+l+"]");function m(x){return r.test(x)}i.exports=m},88016:function(i,o,t){var n=t(48983),a=t(62689),e=t(21903);function l(f){return a(f)?e(f):n(f)}i.exports=l},21903:function(i){var o="\\ud800-\\udfff",t="\\u0300-\\u036f",n="\\ufe20-\\ufe2f",a="\\u20d0-\\u20ff",e=t+n+a,l="\\ufe0e\\ufe0f",f="["+o+"]",r="["+e+"]",m="\\ud83c[\\udffb-\\udfff]",x="(?:"+r+"|"+m+")",y="[^"+o+"]",U="(?:\\ud83c[\\udde6-\\uddff]){2}",W="[\\ud800-\\udbff][\\udc00-\\udfff]",M="\\u200d",d=x+"?",Z="["+l+"]?",A="(?:"+M+"(?:"+[y,U,W].join("|")+")"+Z+d+")*",I=Z+d+A,_="(?:"+[y+r+"?",r,U,W,f].join("|")+")",P=RegExp(m+"(?="+m+")|"+_+I,"g");function Y(Q){for(var X=P.lastIndex=0;P.test(Q);)++X;return X}i.exports=Y},63105:function(i,o,t){var n=t(34963),a=t(80760),e=t(67206),l=t(1469);function f(r,m){var x=l(r)?n:a;return x(r,e(m,3))}i.exports=f},84486:function(i,o,t){var n=t(77412),a=t(89881),e=t(54290),l=t(1469);function f(r,m){var x=l(r)?n:a;return x(r,e(m))}i.exports=f},7654:function(i,o,t){var n=t(81763);function a(e){return n(e)&&e!=+e}i.exports=a},14293:function(i){function o(t){return t==null}i.exports=o},81763:function(i,o,t){var n=t(44239),a=t(37005),e="[object Number]";function l(f){return typeof f=="number"||a(f)&&n(f)==e}i.exports=l},47037:function(i,o,t){var n=t(44239),a=t(1469),e=t(37005),l="[object String]";function f(r){return typeof r=="string"||!a(r)&&e(r)&&n(r)==l}i.exports=f},52353:function(i){function o(t){return t===void 0}i.exports=o},84238:function(i,o,t){var n=t(280),a=t(64160),e=t(98612),l=t(47037),f=t(88016),r="[object Map]",m="[object Set]";function x(y){if(y==null)return 0;if(e(y))return l(y)?f(y):y.length;var U=a(y);return U==r||U==m?y.size:n(y).length}i.exports=x}}]);
