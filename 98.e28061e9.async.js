(self.webpackChunkboc_dashboard=self.webpackChunkboc_dashboard||[]).push([[98],{52953:function(){},68179:function(){},93083:function(U,I,a){"use strict";a.d(I,{hU:function(){return y},me:function(){return P}});var m=a(45697),f=a.n(m),d=a(1852),S=a.n(d),C=function(c){var r=c.children,g=(0,d.useMediaQuery)({minWidth:992});return g?r:null};C.propTypes={children:f().element};var W=function(c){var r=c.children,g=(0,d.useMediaQuery)({minWidth:768,maxWidth:991});return g?r:null};W.propTypes={children:f().element};var l=function(c){var r=c.children,g=(0,d.useMediaQuery)({maxWidth:767});return g?r:null};l.propTypes={children:f().element};var B=function(c){var r=c.children,g=(0,d.useMediaQuery)({minWidth:768});return g?r:null};B.propTypes={children:f().element};var P={Desktop:"Desktop",Tablet:"Tablet",Mobile:"Mobile"},y=function(){var c=(0,d.useMediaQuery)({minWidth:992}),r=(0,d.useMediaQuery)({minWidth:768,maxWidth:991});return c?P.Desktop:r?P.Tablet:P.Mobile}},22844:function(U,I,a){"use strict";a.d(I,{O2:function(){return f},DO:function(){return d},Nd:function(){return S},A7:function(){return C}});var m=a(905),f={Mint:"Mint",Deposit:"Deposit",Burn:"Burn",Rebase:"Rebase",Transfer:"Transfer"},d=18,S=(0,m.Z)(1e18),C=4},860:function(U,I,a){"use strict";a.d(I,{E6:function(){return l},_8:function(){return B},mB:function(){return P},Mn:function(){return y},oP:function(){return v},t:function(){return c},ld:function(){return D},fY:function(){return Z},jv:function(){return Y},Qc:function(){return k},wn:function(){return F},q4:function(){return $},wu:function(){return x},bx:function(){return u}});var m=a(93224),f=a(11849),d=a(65367),S=a(96486),C=a.n(S),W=["chainId","vaultAddress"],l=function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:20;try{var o=(0,f.Z)({offset:n,limit:s},t);return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/officialApy"),{params:o})}catch(i){return{content:[]}}},B=function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:20,o=t.chainId,i=t.vaultAddress,p={sort:"gene_time desc",offset:n,limit:s};return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(o,"/vaults/").concat(i,"/allocation"),{params:p})},P=function(t,n){var s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,o=arguments.length>3&&arguments[3]!==void 0?arguments[3]:20,i={offset:s,limit:o};return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(t,"/vaults/").concat(n,"/strategy/detail/list"),{params:i})},y=function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:20,o=t.chainId,i=t.vaultAddress,p=(0,m.Z)(t,W);return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(o,"/vaults/").concat(i,"/verifiedApy"),{params:(0,f.Z)({offset:n,limit:s},p)})},v=function(t,n,s,o,i){if(!(0,S.isNil)(s))return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(t,"/vaults/").concat(n,"/allocation/").concat(s,"/").concat(o),{method:"patch",headers:i})},c=function(t){var n=t.strategyName,s=t.vaultAddress,o=t.chainId,i=t.limit,p=i===void 0?10:i,_=t.offset,M=_===void 0?0:_,h=t.sort,E=h===void 0?"fetch_timestamp desc":h;return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(o,"/vaults/").concat(s,"/strategy/assets"),{params:{strategyName:n,limit:p,offset:M,sort:E}})},r=function(t,n,s){return request("".concat("https://service-pr02-sg.bankofchain.io","/apy/account_apy/accountAddress/").concat(t,"/date/").concat(n),{params:s})},g=function(t,n){return request("".concat("https://service-pr02-sg.bankofchain.io","/profit/account/").concat(t),{params:n})},A=function(t,n){return request("".concat("https://service-pr02-sg.bankofchain.io","/token/balance/account/").concat(t),{params:_objectSpread({limit:365},n)})},T=function(t,n){return request("".concat("https://service-pr02-sg.bankofchain.io","/month_profit/account/").concat(t),{params:n})},O={},D=function(t){var n=t.chainId,s=t.tokenType,o=t.duration,i=t.offset,p=i===void 0?0:i,_=t.limit,M=t.useCache,h=M===void 0?!0:M,E="".concat(n,"-").concat(o,"-").concat(s,"-").concat(p,"-").concat(_);return h&&O[E]?Promise.resolve(O[E]):(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/apy/vault_apy"),{params:{chainId:n,duration:o,offset:p,limit:_,tokenType:s}}).then(function(N){return O[E]=N,N})},L={},Z=function(t){var n=t.chainId,s=t.offset,o=s===void 0?0:s,i=t.limit,p=t.tokenType,_=t.useCache,M=_===void 0?!0:_,h="".concat(n,"-").concat(o,"-").concat(p,"-").concat(i);return M&&L[h]?Promise.resolve(L[h]):(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/token/totalSupply"),{params:{chainId:n,offset:o,limit:i,tokenType:p}}).then(function(E){return L[h]=E,E})},Y=function(){O={},L={}},k=function(t,n,s){var o=arguments.length>3&&arguments[3]!==void 0?arguments[3]:0,i=arguments.length>4&&arguments[4]!==void 0?arguments[4]:20,p={strategyAddress:s,offset:o,limit:i},_="".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(t,"/vaults/").concat(n,"/verifiedApy/daily");return(0,d.WY)(_,{params:p})},j=function(t,n,s){var o=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{limit:30},i="".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(t,"/vaults/").concat(n,"/data_collects/types/").concat(s);return request(i,{params:o})},F=function(t){return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/verifiedApy/riskon"),{params:(0,f.Z)({offset:0,limit:30,sort:"schedule_timestamp asc"},t)})},$=function(t){return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/officialApy/riskon"),{params:(0,f.Z)({offset:0,limit:30,sort:"fetch_time asc"},t)})},x=function(t){return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/riskon/getSampleApy"),{params:t})},u=function(t,n){var s={type:n};return(0,d.WY)("".concat("https://service-pr02-sg.bankofchain.io","/chains/").concat(t,"/data_collects/profit"),{params:s})}},9292:function(U,I,a){"use strict";a.d(I,{FH:function(){return W},Wl:function(){return B},Ik:function(){return P},Ay:function(){return y}});var m=a(905),f=a(96486),d=a.n(f),S=a(41609),C=a.n(S),W=function(c){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;if(!(0,f.isNil)(c)){if((0,f.isNull)(r))return c.toString();var g=(0,m.Z)(r.toString());if(C()(c)||g.isZero())return 0;var A=(0,m.Z)(c.toString()).div(g);if(A.isInteger())return A.toFixed();for(var T=arguments.length,O=new Array(T>2?T-2:0),D=2;D<T;D++)O[D-2]=arguments[D];return A.toFixed.apply(A,O)}},l=2,B=function(c,r){var g=arguments.length>2&&arguments[2]!==void 0?arguments[2]:l,A=(0,m.Z)(c.toString()),T=(0,m.Z)(10).pow(r),O=r>6&&!A.eq(0)&&A.abs().lt((0,m.Z)(10).pow(r-g+1)),D;return O?(D=W(A,T,r-A.abs().toString().length+1),D):(D=W(A,T,g),parseFloat(D))},P=function(c){var r=parseFloat(c);return isNaN(r)?c:r<=1e3?r:"1000+"},y=function(c){var r=parseFloat(c);return isNaN(r)?c:r<=1e3?r:1e3}},4914:function(U,I,a){"use strict";a.d(I,{K:function(){return Z},Z:function(){return x}});var m=a(96156),f=a(28481),d=a(90484),S=a(94184),C=a.n(S),W=a(50344),l=a(67294),B=a(53124),P=a(96159),y=a(24308),v=function(e){var t=e.children;return t},c=v,r=a(22122);function g(u){return u!=null}var A=function(e){var t=e.itemPrefixCls,n=e.component,s=e.span,o=e.className,i=e.style,p=e.labelStyle,_=e.contentStyle,M=e.bordered,h=e.label,E=e.content,N=e.colon,K=n;if(M){var b;return l.createElement(K,{className:C()((b={},(0,m.Z)(b,"".concat(t,"-item-label"),g(h)),(0,m.Z)(b,"".concat(t,"-item-content"),g(E)),b),o),style:i,colSpan:s},g(h)&&l.createElement("span",{style:p},h),g(E)&&l.createElement("span",{style:_},E))}return l.createElement(K,{className:C()("".concat(t,"-item"),o),style:i,colSpan:s},l.createElement("div",{className:"".concat(t,"-item-container")},(h||h===0)&&l.createElement("span",{className:C()("".concat(t,"-item-label"),(0,m.Z)({},"".concat(t,"-item-no-colon"),!N)),style:p},h),(E||E===0)&&l.createElement("span",{className:C()("".concat(t,"-item-content")),style:_},E)))},T=A;function O(u,e,t){var n=e.colon,s=e.prefixCls,o=e.bordered,i=t.component,p=t.type,_=t.showLabel,M=t.showContent,h=t.labelStyle,E=t.contentStyle;return u.map(function(N,K){var b=N.props,w=b.label,V=b.children,Q=b.prefixCls,z=Q===void 0?s:Q,H=b.className,R=b.style,X=b.labelStyle,G=b.contentStyle,q=b.span,tt=q===void 0?1:q,J=N.key;return typeof i=="string"?l.createElement(T,{key:"".concat(p,"-").concat(J||K),className:H,style:R,labelStyle:(0,r.Z)((0,r.Z)({},h),X),contentStyle:(0,r.Z)((0,r.Z)({},E),G),span:tt,colon:n,component:i,itemPrefixCls:z,bordered:o,label:_?w:null,content:M?V:null}):[l.createElement(T,{key:"label-".concat(J||K),className:H,style:(0,r.Z)((0,r.Z)((0,r.Z)({},h),R),X),span:1,colon:n,component:i[0],itemPrefixCls:z,bordered:o,label:w}),l.createElement(T,{key:"content-".concat(J||K),className:H,style:(0,r.Z)((0,r.Z)((0,r.Z)({},E),R),G),span:tt*2-1,component:i[1],itemPrefixCls:z,bordered:o,content:V})]})}var D=function(e){var t=l.useContext(Z),n=e.prefixCls,s=e.vertical,o=e.row,i=e.index,p=e.bordered;return s?l.createElement(l.Fragment,null,l.createElement("tr",{key:"label-".concat(i),className:"".concat(n,"-row")},O(o,e,(0,r.Z)({component:"th",type:"label",showLabel:!0},t))),l.createElement("tr",{key:"content-".concat(i),className:"".concat(n,"-row")},O(o,e,(0,r.Z)({component:"td",type:"content",showContent:!0},t)))):l.createElement("tr",{key:i,className:"".concat(n,"-row")},O(o,e,(0,r.Z)({component:p?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0},t)))},L=D,Z=l.createContext({}),Y={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1};function k(u,e){if(typeof u=="number")return u;if((0,d.Z)(u)==="object")for(var t=0;t<y.c4.length;t++){var n=y.c4[t];if(e[n]&&u[n]!==void 0)return u[n]||Y[n]}return 3}function j(u,e,t){var n=u;return(e===void 0||e>t)&&(n=(0,P.Tm)(u,{span:t})),n}function F(u,e){var t=(0,W.Z)(u).filter(function(i){return i}),n=[],s=[],o=e;return t.forEach(function(i,p){var _,M=(_=i.props)===null||_===void 0?void 0:_.span,h=M||1;if(p===t.length-1){s.push(j(i,M,o)),n.push(s);return}h<o?(o-=h,s.push(i)):(s.push(j(i,h,o)),n.push(s),o=e,s=[])}),n}function $(u){var e,t=u.prefixCls,n=u.title,s=u.extra,o=u.column,i=o===void 0?Y:o,p=u.colon,_=p===void 0?!0:p,M=u.bordered,h=u.layout,E=u.children,N=u.className,K=u.style,b=u.size,w=u.labelStyle,V=u.contentStyle,Q=l.useContext(B.E_),z=Q.getPrefixCls,H=Q.direction,R=z("descriptions",t),X=l.useState({}),G=(0,f.Z)(X,2),q=G[0],tt=G[1],J=k(i,q);l.useEffect(function(){var nt=y.ZP.subscribe(function(et){(0,d.Z)(i)==="object"&&tt(et)});return function(){y.ZP.unsubscribe(nt)}},[]);var at=F(E,J),rt=l.useMemo(function(){return{labelStyle:w,contentStyle:V}},[w,V]);return l.createElement(Z.Provider,{value:rt},l.createElement("div",{className:C()(R,(e={},(0,m.Z)(e,"".concat(R,"-").concat(b),b&&b!=="default"),(0,m.Z)(e,"".concat(R,"-bordered"),!!M),(0,m.Z)(e,"".concat(R,"-rtl"),H==="rtl"),e),N),style:K},(n||s)&&l.createElement("div",{className:"".concat(R,"-header")},n&&l.createElement("div",{className:"".concat(R,"-title")},n),s&&l.createElement("div",{className:"".concat(R,"-extra")},s)),l.createElement("div",{className:"".concat(R,"-view")},l.createElement("table",null,l.createElement("tbody",null,at.map(function(nt,et){return l.createElement(L,{key:et,index:et,colon:_,prefixCls:R,vertical:h==="vertical",bordered:M,row:nt})}))))))}$.Item=c;var x=$},98858:function(U,I,a){"use strict";var m=a(38663),f=a.n(m),d=a(52953),S=a.n(d)},27049:function(U,I,a){"use strict";var m=a(22122),f=a(96156),d=a(94184),S=a.n(d),C=a(67294),W=a(53124),l=function(P,y){var v={};for(var c in P)Object.prototype.hasOwnProperty.call(P,c)&&y.indexOf(c)<0&&(v[c]=P[c]);if(P!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,c=Object.getOwnPropertySymbols(P);r<c.length;r++)y.indexOf(c[r])<0&&Object.prototype.propertyIsEnumerable.call(P,c[r])&&(v[c[r]]=P[c[r]]);return v},B=function(y){var v,c=C.useContext(W.E_),r=c.getPrefixCls,g=c.direction,A=y.prefixCls,T=y.type,O=T===void 0?"horizontal":T,D=y.orientation,L=D===void 0?"center":D,Z=y.orientationMargin,Y=y.className,k=y.children,j=y.dashed,F=y.plain,$=l(y,["prefixCls","type","orientation","orientationMargin","className","children","dashed","plain"]),x=r("divider",A),u=L.length>0?"-".concat(L):L,e=!!k,t=L==="left"&&Z!=null,n=L==="right"&&Z!=null,s=S()(x,"".concat(x,"-").concat(O),(v={},(0,f.Z)(v,"".concat(x,"-with-text"),e),(0,f.Z)(v,"".concat(x,"-with-text").concat(u),e),(0,f.Z)(v,"".concat(x,"-dashed"),!!j),(0,f.Z)(v,"".concat(x,"-plain"),!!F),(0,f.Z)(v,"".concat(x,"-rtl"),g==="rtl"),(0,f.Z)(v,"".concat(x,"-no-default-orientation-margin-left"),t),(0,f.Z)(v,"".concat(x,"-no-default-orientation-margin-right"),n),v),Y),o=(0,m.Z)((0,m.Z)({},t&&{marginLeft:Z}),n&&{marginRight:Z});return C.createElement("div",(0,m.Z)({className:s},$,{role:"separator"}),k&&C.createElement("span",{className:"".concat(x,"-inner-text"),style:o},k))};I.Z=B},48736:function(U,I,a){"use strict";var m=a(38663),f=a.n(m),d=a(68179),S=a.n(d)}}]);
