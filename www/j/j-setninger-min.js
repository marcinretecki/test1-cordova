function Sentence(){this.store={content:document.getElementById("content"),footer:document.getElementById("wrapper-buttons"),contentPosition:null,sentence:null,words:[],clones:[],wordPositions:[],itemsOnBoard:null,wrapper:null,wrapperBack:null,wrapperBackHeight:0,wrapperBackTop:0,nextArr:null,translationSpans:null},this.opts={easing:[.645,.045,.355,1],duration:200,valueX:400},this.state={rolling:!1,transIn:!1,no:0,level:""}}Sentence.prototype={constructor:Sentence,newSentence:function(){this._removeHome(),this._createSentence(),this._createFooter(),this._createClones(),this._createWrapperBack(),this._createTranslation(),this._newSortable(),this._comeIn(),this._watchResize(!0),this.state.rolling=!0,this._saveState()},_finishedSentence:function(){this._destroySortable(),this.showTrans(),this._itemsOff(),this._showNextArr()},nextSentence:function(){this.state.no+=1,this._comeOut(),this._cleanStore()},backHome:function(){this._watchResize(!1)},_createSentence:function(){function t(t){var e=o.forEach(function(e,n,o){return t===e?!1:void 0})}this._getSentence();var e=this,n=this.store.sentence,o=n.s,s=n.b;void 0===s&&(s=!1);var r=this.store.content,a=document.createElement("div"),i=document.createElement("div"),c=document.createElement("div"),l=document.createElement("div"),h,d,p,u,f;for(h=o[0].concat(),a.id="items",a.className="items items-on-board",i.id="wrapper-items",c.className="btn-outer",l.className="btn-word",c.appendChild(l),h=h.sort(function(){return.5-Math.random()});t(h);)h=h.sort(function(){return.5-Math.random()});for(var m=0,v=h.length;v>m;m++)d=c.cloneNode(!0),d.dataset.pos=m+1,d.firstChild.innerHTML=h[m],i.appendChild(d),u=this.store.words.push(d);this.store.wrapper=i,this.store.itemsOnBoard=a,a.appendChild(i),r.insertBefore(a,r.firstChild)},_createClones:function(){var t=this,e=this.store.wrapper,n=this.store.contentPosition,o=this.store.words,s=this.opts.valueX,r=[],a=[],i,c,l,h,d,p=document.createElement("div");p.className="clones",function(){for(var e=0,u=o.length;u>e;e++)l=o[e],h=l.getBoundingClientRect(),r[e]={left:h.left-n.left,top:h.top-n.top,bottom:h.bottom},c=t.store.wordPositions.push(r),d=l.cloneNode(!0),d.className=d.className+" clone",Velocity.hook(d,"translateX",Math.round(r[e].left)+s+"px"),Velocity.hook(d,"translateY",r[e].top+"px"),p.appendChild(d),i=a.push(d)}(),this.store.clones=a,this.store.wordPositions=r,e.parentNode.appendChild(p)},_createWrapperBack:function(){this._checkBackSize();var t=this,e=this.store.wrapper,n=this.store.wrapperBackHeight,o=this.store.wrapperBackTop,s=document.createElement("div");s.className="wrapper-back",s.style.height=n+"px",s.style.top=o+"px",Velocity.hook(s,"scaleY",0),this.store.wrapperBack=s,e.parentNode.appendChild(s),Velocity(s,{scaleY:[1,0]},{duration:300,easing:t.opts.easing,queue:!1})},_createTranslation:function(){var t=this,e=this.store.wrapperBack,n=this.store.sentence,o=n.t,s=document.createElement("p"),r;tSplited=o.split(" ");for(var a=0,i=tSplited.length;i>a;a++)r=document.createElement("span"),r.appendChild(document.createTextNode(tSplited[a])),s.appendChild(r),i-1>a&&s.appendChild(document.createTextNode(" "));s.id="translation",s.className="translation",e.appendChild(s)},_createFooter:function(){var t=this,e=this.store.footer,n=document.createDocumentFragment();footerTips=document.createElement("button"),footerBack=document.createElement("button"),footerShop=e.querySelector(".btn-shop"),footerTips.className="btn-footer btn-translate",footerTips.appendChild(document.createTextNode("? Tips")),footerTips.type="button",footerBack.className="btn-footer btn-back",footerBack.appendChild(document.createTextNode("= Back")),footerBack.type="button",footerTips.addEventListener("click",function o(){t.showTrans(),footerTips.removeEventListener("click",o,!1)},!1),footerBack.addEventListener("click",function s(){t.backhome(),footerBack.removeEventListener("click",s,!1)},!1),footerShop.addEventListener("click",function r(){t._resetState(),footerShop.removeEventListener("click",r,!1)},!1),n.appendChild(footerBack),n.appendChild(footerTips),e.appendChild(n),e.parentNode.className+=" app-footer-full"},_newSortable:function(){var t=this,e=this.store.wrapper,n;e&&(n=new Sortable(e,{animation:0,onStart:function(e){t._toggleOpacity(e.item,"0.5")},onEnd:function(e){t._toggleOpacity(e.item,"1"),t._checkSentence()}}),this.store.sortable=n)},_removeHome:function(){try{var t=this.store.content,e=document.getElementById("menu-home"),n=e.cloneNode(!0),o=t.replaceChild(n,e),s=t.removeChild(n);o=s=null}catch(r){}},_removeFooter:function(){},_removeSentence:function(){if(this.state.rolling){var t=this.store.itemsOnBoard,e=this.store.wrapperBack,n=this.store.nextArr;this._destroy(t.firstChild),this._destroy(t.firstChild),this._destroy(e.firstChild),this._destroy(t.lastChild)}},_destroySortable:function(){if(this.state.rolling){var t=this.store.sortable;t.destroy(),this.store.sortable=null}},homeIn:function(){var t=this,e=document.createElement("div"),n="btn-menu btn-menu-hidden",o=document.createElement("button"),s=o.cloneNode(!0),r=o.cloneNode(!0),a=this.store.content,i,c;e.className="items center",e.id="menu-home",o.className=n+" btn-menu-1",o.innerHTML='<span>Od podstaw</span><div class="percent">87%</div>',o.addEventListener("click",function(){t.homeOut("a")}),s.className=n+" btn-menu-2",s.innerHTML='<span>Średnio-zaawansowane</span><div class="percent">100%</div>',s.addEventListener("click",function(){t.homeOut("b")}),r.className=n+" btn-menu-3",r.innerHTML='<span>Zaawansowane</span><div class="percent">5%</div>',r.addEventListener("click",function(){t.homeOut("c")}),e.appendChild(o),e.appendChild(s),e.appendChild(r),a.appendChild(e),this.store.contentPosition=a.getBoundingClientRect(),i=[o,s,r];for(var l=0,h=i.length;h>l;l++)c=i[l],Velocity(c,{opacity:[1,0],translateX:[0,"200px"]},{duration:400,easing:t.opts.easing,delay:100*l})},homeOut:function(t){var e=this,n=document.querySelectorAll(".btn-menu"),o;this._changeColor(t),this.state.level=t;for(var s=0,r=n.length;r>s;s++)o=n[s],Velocity(o,{opacity:[0,1],translateX:["-200px",0]},{duration:400,easing:e.opts.easing,delay:100*s,complete:function(t){t.forEach(function(t,o,s){t===n[r-1]&&e.newSentence()})}})},animate:function(){var t=this,e=this.store.words,n=this.store.clones,o=this.store.contentPosition,s=this.store.wrapperBack,r=this.store.wordPositions,a=this.store.wrapper,i=[],c=e.length,l,h,d,p,u,f,m;!function(){for(var t=0;c>t;t++);}(),function(){for(var t=0;c>t;t++)l=e[t].getBoundingClientRect(),i[t]={left:Math.round(l.left)-o.left,top:l.top-o.top,bottom:l.bottom-o.top}}(),this.store.wordPositions=i,f=this._debounce(function(){for(var e=0;c>e;e++)Velocity(n[e],{translateX:[i[e].left,r[e].left],translateY:[i[e].top,r[e].top]},{duration:t.opts.duration,easing:t.opts.easing,queue:!1})},10),f(),(m=this._debounce(function(){var e=t._checkBackSize();if(e){var n=t.store.wrapperBackHeight,o=t.store.wrapperBackTop;Velocity(s,{height:n,top:o},{duration:300,easing:t.opts.easing,queue:!1})}},100))()},showTrans:function(){if(!this.state.transIn&&this.state.rolling){var t=this,e=this.store.content,n=e.querySelector(".translation"),o=n.querySelectorAll("span"),s=this.store.footer,r=s.querySelector(".btn-translate"),a;this.store.translationSpans=o;for(var i=0,c=o.length;c>i;i++)a=o[i],Velocity(a,{opacity:[1,0],translateX:[0,"200px"]},{duration:t.opts.duration,easing:t.opts.easing,delay:100*i});Velocity(r,{opacity:[0,1]},{duration:t.opts.duration,easing:t.opts.easing,visibility:"hidden"}),this.state.transIn=!0}},_comeIn:function(){var t=this,e=this.store.contentPosition,n=this.store.wordPositions,o=this.store.clones,s=this.opts.valueX,r;!function(){for(var e=0,a=o.length;a>e;e++)r=Math.round(n[e].left),Velocity(o[e],{opacity:1,translateX:[r,r+s]},{duration:t.opts.duration,easing:t.opts.easing,delay:100*e+200,queue:!1})}()},_comeOut:function(){if(this.state.rolling){var t=this,e=this.store.wordPositions,n=this.store.clones,o=this.store.nextArr,s=this.store.translationSpans,r=this.opts.valueX,a=this.store.wrapper.childNodes,i,c,l,h;!function(){for(var e=0,n=s.length;n>e;e++)i=s[e],Velocity(i,{opacity:[0,1],translateX:["-200px",0]},{duration:t.opts.duration,easing:t.opts.easing,delay:100*e})}(),h=this._debounce(function(){t._removeSentence()},300),function(){for(var o=0,s=a.length;s>o;o++)l=a[o].dataset.pos-1,c=Math.round(e[l].left),Velocity(n[l],{opacity:1,translateX:[c-r,c]},{duration:t.opts.duration,easing:t.opts.easing,delay:100*o+200,queue:!1,complete:function(t){t.forEach(function(t,e,o){t===n[s-1]&&h()})}})}(),Velocity(o,{scale:[0,1]},{duration:2*t.opts.duration,easing:t.opts.easing})}},_showNextArr:function(){if(this.state.rolling){var t=this,e=this.store.itemsOnBoard,n=document.createElement("div"),o=document.createElement("button");n.className="wrapper-next-arr",o.className="next-arr",o.id="next-arr",o.type="button",o.innerHTML="&raquo",this.store.nextArr=o,o.addEventListener("click",function s(){t.nextSentence(),o.removeEventListener("click",s,!1)},!1),n.appendChild(o),e.appendChild(n),Velocity(o,{scale:[1,0]},{duration:2*t.opts.duration,easing:t.opts.easing,delay:200})}},_changeColor:function(t){try{var e=document.getElementById("section"),n=" section-100";switch(t){case"a":e.className="section-green"+n;break;case"b":e.className="section-orange"+n;break;case"c":e.className="section-red"+n;break;case"menu":e.className="section-dark"+n}}catch(o){}},_toggleOpacity:function(t,e){try{var n=t.dataset.pos-1,o=this.store.clones[n];Velocity.hook(o,"opacity",e)}catch(s){}},_itemsOff:function(){var t=this.store.itemsOnBoard;t.className=t.className+" items-off"},_getSentence:function(){try{var t=this.state.no,e=this.state.level,n;switch(e){case"a":n=arrayA(t);break;case"b":n=arrayB(t);break;case"c":n=arrayC(t)}return this.store.sentence=n}catch(o){}},_getLevels:function(){},_checkSentence:function(){var t=this,e=this.store.sentence,n=this.store.wrapper,o=[],s=!1,r,a,i,c,l;(r=this._debounce(function(){a=n.querySelectorAll(".btn-word"),function(){for(var t=0,e=a.length;e>t;t++)i=o.push(a[t].innerHTML)}(),c=function(){for(var t=0,n=e.s.length;n>t;t++)l=e.s[t],function(){for(var t=0,e=o.length;e>t;t++)if(o[t]!==l[t])return!1;s=!0}();return s},c()&&t._finishedSentence()},200))()},_checkBackSize:function(){try{for(var t=this.store.wordPositions,e=this.store.wrapperBack,n=this.store.wrapperBackHeight,o=this.store.wrapperBackTop,s=[],r=[],a,i,c,l=0,h=t.length;h>l;l++)a=Math.round(t[l].top),i=Math.round(t[l].bottom),s.push(a),r.push(i);if(s.sort(),r.sort(),c=Math.floor(r[r.length-1]-s[0])+6,newTop=Math.floor(s[0]-3),n!==c)return this.store.wrapperBackHeight=c,this.store.wrapperBackTop=newTop,!0}catch(d){}},_watchResize:function(t){var e;_this=this,t?(e=_this._debounce(function(){_this.animate()},250),_this.store.resize=e,window.addEventListener("resize",e,!1)):(e=_this.store.resize,window.removeEventListener("resize",e,!1))},_cleanStore:function(){var t=this.store;t.sentence=t.nextArr=t.translationSpans=null,t.words=t.clones=[]},_saveState:function(){var t=this.state,e=localStorage;e.setItem("level",t.level),e.setItem("no",t.no)},_loadState:function(){var t=this.state,e=localStorage;e.length>0&&(t.level=e.getItem("level"),t.no=e.getItem("no"),console.log("storage is populated"))},_resetState:function(){var t=this.state,e=localStorage;e.length>0&&e.clear()},_debounce:function(t,e,n){var o;return function(){var s=this,r=arguments,a=function(){o=null,n||t.apply(s,r)},i=n&&!o;clearTimeout(o),o=setTimeout(a,e),i&&t.apply(s,r)}},_destroy:function(t){try{var e=t.parentNode,n=t.cloneNode(!0),o=e.replaceChild(n,t),s=e.removeChild(n);t=n=o=s=null}catch(r){console.log(r)}}};var sentence=new Sentence;window.addEventListener("load",function(){sentence.homeIn()},!1);