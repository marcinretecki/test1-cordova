function Sentence(){this.store={content:document.getElementById("content"),contentPosition:null,sentence:null,words:[],clones:[],wordPositions:[],wrapper:null,wrapperBack:null,wrapperBackHeight:0},this.opts={easing:[.645,.045,.355,1],duration:200},this.rolling=!1}Sentence.prototype={constructor:Sentence,homeIn:function(){var e=this,t=document.createElement("div"),n="btn-menu btn-menu-hidden",o=document.createElement("button"),a=o.cloneNode(!0),r=o.cloneNode(!0),i=this.store.content,s,c;t.className="items center",t.id="menu-home",o.className=n+" btn-menu-1",o.innerHTML='<span>Od podstaw</span><div class="percent">87%</div>',o.addEventListener("click",function(){e.homeOut("a")}),a.className=n+" btn-menu-2",a.innerHTML='<span>Średnio-zaawansowane</span><div class="percent">100%</div>',a.addEventListener("click",function(){e.homeOut("b")}),r.className=n+" btn-menu-3",r.innerHTML='<span>Zaawansowane</span><div class="percent">5%</div>',r.addEventListener("click",function(){e.homeOut("c")}),t.appendChild(o),t.appendChild(a),t.appendChild(r),i.appendChild(t),this.store.contentPosition=i.getBoundingClientRect(),s=[o,a,r];for(var l=0,d=s.length;d>l;l++)c=s[l],Velocity(c,{opacity:[1,0],translateX:[0,"200px"]},{duration:400,easing:e.opts.easing,delay:100*l})},homeOut:function(e){var t=this,n=document.querySelectorAll(".btn-menu"),o,a;this._changeColor(e);for(var r=0,i=n.length;i>r;r++)o=n[r],Velocity(o,{opacity:[0,1],translateX:["-200px",0]},{duration:400,easing:t.opts.easing,delay:100*r,complete:function(o){o.forEach(function(o,r,i){o===n[n.length-1]&&t._createSentence(e,a)})}})},comeIn:function(){var e=this,t=this.store.wrapper,n=this.store.contentPosition,o=this.store.words,a=400,r=[],i=[],s,c,l,d,h,p,u,m=document.createElement("div"),f=document.createElement("div");m.className="clones",f.className="wrapper-back",function(){for(var t=0,p=o.length;p>t;t++)l=o[t],d=l.getBoundingClientRect(),r[t]={left:d.left-n.left,top:d.top-n.top,bottom:d.bottom},c=e.store.wordPositions.push(r),h=l.cloneNode(!0),h.className=h.className+" clone",Velocity.hook(h,"translateX",r[t].left+a+"px"),Velocity.hook(h,"translateY",r[t].top+"px"),m.appendChild(h),s=i.push(h)}(),this.store.clones=i,this.store.wordPositions=r,this.store.wrapperBack=f,t.parentNode.appendChild(m),t.parentNode.appendChild(f),this._checkBackSize(),u=this.store.wrapperBackHeight,f.style.height=u+"px",Velocity.hook(f,"translateY",-(u/2)+"px"),Velocity.hook(f,"scaleY",0),Velocity(f,{scaleY:[1,0]},{duration:300,easing:e.opts.easing,queue:!1}),function(){for(var t=0,n=o.length;n>t;t++)Velocity(i[t],{opacity:1,translateX:[r[t].left,r[t].left+a]},{duration:e.opts.duration,easing:e.opts.easing,delay:100*t+200,queue:!1})}(),this._newSortable(),this._watchResize(!0)},animate:function(){var e=this,t=this.store.words,n=this.store.clones,o=this.store.contentPosition,a=this.store.wrapperBack,r=this.store.wordPositions,i=this.store.wrapper,s=[],c=t.length,l,d,h,p,u,m,f;!function(){for(var e=0;c>e;e++);}(),function(){for(var e=0;c>e;e++)l=t[e].getBoundingClientRect(),s[e]={left:l.left-o.left,top:l.top-o.top,bottom:l.bottom-o.top}}(),this.store.wordPositions=s,m=this._debounce(function(){for(var t=0;c>t;t++)Velocity(n[t],{translateX:[s[t].left,r[t].left],translateY:[s[t].top,r[t].top]},{duration:e.opts.duration,easing:e.opts.easing,queue:!1})},10),m(),(f=this._debounce(function(){var t=e._checkBackSize();if(t){var n=e.store.wrapperBackHeight;Velocity(a,{height:n,translateY:-(n/2)+"px"},{duration:300,easing:e.opts.easing,queue:!1})}},100))()},showTrans:function(){for(var e=this,t=document.querySelector(".translation"),n=t.querySelectorAll("span"),o,a=0,r=n.length;r>a;a++)o=n[a],Velocity(o,{opacity:[1,0],translateX:[0,"200px"]},{duration:e.opts.duration,easing:e.opts.easing,delay:100*a});this._removeFooter()},_showNextArr:function(){try{var e=this,t=document.createElement("div"),n=document.createElement("button"),o=this.store.itemsOnBoard;t.className="wrapper-next-arr",n.className="next-arr",n.id="next-arr",n.type="button",n.innerHTML="&raquo",t.appendChild(n),o.appendChild(t),Velocity(n,{scale:[1,0]},{duration:400,easing:e.opts.easing})}catch(a){}},_createSentence:function(e,t){function n(e){var t=r.forEach(function(t,n,o){return e===t?!1:void 0})}var t=0;this._getSentence(e,t);var o=this,a=this.store.sentence,r=a.s,i=a.b;void 0===i&&(i=!1);var s=this.store.content,c=document.createElement("div"),l=document.createElement("div"),d=document.createElement("div"),h=document.createElement("div"),p,u,m,f,v;for(p=r[0].concat(),c.id="items",c.className="items items-on-board",l.id="wrapper-items",d.className="btn-outer",h.className="btn-word",d.appendChild(h),p=p.sort(function(){return.5-Math.random()});n(p);)p=p.sort(function(){return.5-Math.random()});for(var g=0,w=p.length;w>g;g++)u=d.cloneNode(!0),u.firstChild.innerHTML=p[g],l.appendChild(u),f=this.store.words.push(u);this.store.wrapper=l,this.store.itemsOnBoard=c,this._removeHome(),c.appendChild(l),s.appendChild(c),this._createFooter(),this._createTranslation(e,t),this.comeIn()},_checkSentence:function(){var e=this,t=this.store.sentence,n=this.store.wrapper,o=[],a=!1,r,i,s,c,l;(r=this._debounce(function(){i=n.querySelectorAll(".btn-word"),function(){for(var e=0,t=i.length;t>e;e++)s=o.push(i[e].innerHTML)}(),c=function(){for(var e=0,n=t.s.length;n>e;e++)l=t.s[e],function(){for(var e=0,t=o.length;t>e;e++)if(o[e]!==l[e])return!1;a=!0}();return a},c()&&e._finishedSentence()},200))()},_finishedSentence:function(){this._destroySortable(),this.showTrans(),this._showNextArr()},_createTranslation:function(){var e=this,t=this.store.wrapperBack,n=this.store.sentence,o=n.t,a=document.createElement("p"),r;tSplited=o.split(" ");for(var i=0,s=tSplited.length;s>i;i++)r=document.createElement("span"),r.appendChild(document.createTextNode(tSplited[i])),a.appendChild(r),s-1>i&&a.appendChild(document.createTextNode(" "));a.id="translation",a.className="translation",t.appendChild(a)},_createFooter:function(){var e=this,t=this.store.content,n=document.createElement("footer"),o=document.createElement("div"),a=document.createElement("button");n.className="app-footer",o.className="section-content section-1-1 group centered",o.id="wrapper-buttons",a.className="btn btn-translate",a.appendChild(document.createTextNode("Tips")),a.id="translate",a.type="button",a.addEventListener("click",function r(){e.showTrans(),a.removeEventListener("click",r,!1)},!1),o.appendChild(a),n.appendChild(o),t.appendChild(n)},_removeFooter:function(){var e=this,t=this.store.content,n=document.querySelector(".app-footer"),o=document.getElementById("translate");Velocity(o,{opacity:0,translateY:"1rem"},{duration:e.opts.duration,easing:e.opts.easing,visibility:"hidden",complete:function(){var e=t.removeChild(n);e=null}})},_removeHome:function(){try{var e=this.store.content,t=document.getElementById("menu-home"),n=t.cloneNode(!0),o=e.replaceChild(n,t),a=e.removeChild(n);o=a=null}catch(r){}},_getSentence:function(e,t){var n;return"a"===e?n=arrayA(t):"b"===e?n=arrayB(t):"c"===e?n=arrayC(t):console.log("level not provided"),this.store.sentence=n},_getLevels:function(){},_changeColor:function(e){try{var t=document.getElementById("section"),n=" section-100";switch(e){case"a":t.className="section-green"+n;break;case"b":t.className="section-orange"+n;break;case"c":t.className="section-red"+n;break;case"menu":t.className="section-dark"+n}}catch(o){}},_toggleOpacity:function(e,t){try{var n=e.dataset.pos-1,o=this.store.clones[n];Velocity.hook(o,"opacity",t)}catch(a){}},_checkBackSize:function(){try{for(var e=this.store.wordPositions,t=this.store.wrapperBack,n=this.store.wrapperBackHeight,o=[],a=[],r,i,s,c=0,l=e.length;l>c;c++)r=e[c].top,i=e[c].bottom,o.push(r),a.push(i);if(o.sort(),a.sort(),s=Math.floor(a[a.length-1]-o[0])+6,n!==s)return this.store.wrapperBackHeight=s,!0}catch(d){}},_newSortable:function(){var e=this.store.wrapper,t=this,n;e&&(n=new Sortable(e,{animation:0,onStart:function(e){t._toggleOpacity(e.item,"0.5")},onEnd:function(e){t._toggleOpacity(e.item,"1"),t._checkSentence()}}),this.store.sortable=n)},_destroySortable:function(){var e=this.store.sortable;e.destroy()},_watchResize:function(e){var t;that=this,e?(t=that._debounce(function(){that.animate()},250),that.store.resize=t,window.addEventListener("resize",t,!1)):(t=that.store.resize,window.removeEventListener("resize",t,!1))},_debounce:function(e,t,n){var o;return function(){var a=this,r=arguments,i=function(){o=null,n||e.apply(a,r)},s=n&&!o;clearTimeout(o),o=setTimeout(i,t),s&&e.apply(a,r)}}};var sentence=new Sentence;window.addEventListener("load",function(){sentence.homeIn()},!1);