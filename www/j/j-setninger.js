/* FastClick */
//if ('addEventListener' in document) {
//    document.addEventListener('DOMContentLoaded', function() {
//        FastClick.attach(document.body);
//    }, false);
//}
//



/*
Remember to hook or animate once again when browser changes dimensions / orientation
*/



/*

Structure:

- Front screen
    (choose level, (choose language))
- Level screen
    (build senteces, check hint, go to next, see all previous senteces, buy whole level, buy all levels)
- Previous sentences view



What happens when:

-

*/

/*
    - pamiętaj, żeby wszystkie event listeners przenieść na document itd.... (to ważne)
*/

/*
    - should we change the store, state and opts into private vars?
*/


function Sentence() {

    this.store = {
        content:    document.getElementById('content'),         // main div NODE
        footer:     document.getElementById('wrapper-buttons'), // footer NODE
        contentPosition:    null,                               // position of main div
        sentence:           null,                               // whole sentence OBJECT
        words:              [],                                 // words ARRAY
        clones:             [],                                 // clones ARRAY
        wordPositions:      [],                                 // positions ARRAY
        itemsOnBoard:       null,                               // items-on-board NODE
        wrapper:            null,                               // wrapper NODE
        wrapperBack:        null,                               // wrapperBack NODE
        wrapperBackHeight:  0,                                  // wrapperBack height
        wrapperBackTop:     0,                                  // wrapperBack top
        nextArr:            null,                               // nextArr NODE
        translationSpans:   null,                               // translation spans NODEs
    };

    this.opts = {
        easing:     [0.645,0.045,0.355,1],
        duration:   200,
        valueX:     400
    };

    this.state = {
        transIn: false,
        no:      0,
        level:   'home'
    };

    // Init
    this._loadState();
    this._begin();

}

Sentence.prototype = {

    constructor: Sentence,

    /**
     *  TOC
     *
     *  - sequencing
     *  - creation
     *  - removal
     *  - animation
     *  - helpers
     *
     */


    /**
     *  SEQUENCING
     */

    _begin: function() {
        var content = this.store.content;

        this.store.contentPosition = content.getBoundingClientRect();

        if (this.state.level === 'home') {
            this.homeIn();
        } else {
            this._newSentence();
        }

    },

    _newSentence: function() {
        this._changeColor();                    // change color
        this._removeHome();                     // remove the menu
        this._createFooter();                   // create footer
        this._createSentence();                 // create the words
        this._createClones();                   // clone the words
        this._createWrapperBack();              // create the background
        this._createTranslation();              // create translation
        this._newSortable();                    // init. Sortable
        this._watchResize(true);                // watch browser changes
        this._saveState();                      // save state in localStorage

        this._comeIn();                         // let the sentence in
    },

    _finishedSentence: function() {
        this._destroySortable();
        this.showTrans();
        this._itemsOff();
        this._showNextArr();
    },

    nextSentence: function() {
        this.state.no += 1;

        this._comeOut();                        // animate sentence, arrow-next, translation out and destroy them
        this._cleanStore();                     // clean store

        console.log(this.state.no);
    },

    backHome: function() {

        this._watchResize(false);               // stop watching browser changes

        this.state.level = 'home';
        this._saveState();

    },


    /**
     *  CREATION
     */

    _createSentence: function() {
        this._getSentence();

        var sentence = this.store.sentence, // sentence object
            s = sentence.s,                 // array of good answers
            b = sentence.b;                 // string - word you can't touch

        if (b === undefined) {          // if there are no restricted word
            b = false;
        }

        var content = this.store.content,
            // New nodes
            itemsOnBoard = document.createElement('div'),
            wrapper = document.createElement('div'),
            word = document.createElement('div'),
            wordInner = document.createElement('div'),
            spill, clone, wordsCount;

        // Prepare nodes
        itemsOnBoard.id = 'items';
        itemsOnBoard.className = 'items items-on-board';
        wrapper.id = 'wrapper-items';
        word.className = 'btn-outer';
        wordInner.className = "btn-word";

        word.appendChild(wordInner);        // append inside the word

        // copy the first correct answer and sort words randomly
        spill = s[0].concat();
        spill = spill.sort(function() { return 0.5 - Math.random(); });

        // sort once again while spill and answer are the same
        while (this._checkSpill(spill, s)) {
            spill = spill.sort(function() { return 0.5 - Math.random(); });
        }

        // Append words into the wrapper
        for (var i=0, len=spill.length; i < len; i++) {
            clone = word.cloneNode(true);
            clone.dataset.pos = i + 1;
            clone.firstChild.innerHTML = spill[i];
            wrapper.appendChild(clone);

            // store words
            wordsCount = this.store.words.push(clone);
        }

        this.store.wrapper = wrapper;                   // store wrapper
        this.store.itemsOnBoard = itemsOnBoard;         // store items-on-board

        itemsOnBoard.appendChild(wrapper);                      // append wrapper
        content.insertBefore(itemsOnBoard, content.firstChild); // append items-on-board
    },

    _createClones: function() {
        var _this = this,
            wrapper = this.store.wrapper,
            contentPosition = this.store.contentPosition,
            words = this.store.words,
            x = this.opts.valueX,
            wordPositions = [],
            storedClones = [],
            countStoredClones, countWordPositions, word, wordPosition, clone,

            // new node
            clones = document.createElement('div');

        // prepare new node
        clones.className = 'clones';

        // for each word, store its position and create a clone
        (function() {
            for (var i=0, len=words.length; i < len; i++) {
                word = words[i];
                wordPosition = word.getBoundingClientRect();
                wordPositions[i] = {
                    left: Math.round(wordPosition.left - contentPosition.left),
                    top: Math.round(wordPosition.top - contentPosition.top),
                    bottom: Math.round(wordPosition.bottom),
                };

                countWordPositions = _this.store.wordPositions.push(wordPositions);    // pre-store positions

                clone = word.cloneNode(true);
                clone.className = clone.className + " clone";

                Velocity.hook(clone, "translateX", wordPositions[i].left + x + "px");
                Velocity.hook(clone, "translateY", wordPositions[i].top + "px");
                //Velocity.hook(clone, "left", wordPositions[i].left + x + "px");
                //Velocity.hook(clone, "top", wordPositions[i].top + "px");

                clones.appendChild(clone);                          // append clone
                countStoredClones = storedClones.push(clone);       // pre-store clones
            }
        })();

        this.store.clones = storedClones;               // store clones
        this.store.wordPositions = wordPositions;       // store positions

        wrapper.parentNode.appendChild(clones);         // append clones


    },

    _createWrapperBack: function() {
        this._checkBackSize();
        var _this = this,
            wrapper = this.store.wrapper,
            wrapperBackHeight = this.store.wrapperBackHeight,
            wrapperBackTop = this.store.wrapperBackTop,

            // new node
            wrapperBack = document.createElement('div');

        // prepare new node
        wrapperBack.className = 'wrapper-back';

        wrapperBack.style.height = wrapperBackHeight + "px";
        wrapperBack.style.top = wrapperBackTop + "px";
        Velocity.hook(wrapperBack, 'scaleY', 0);

        this.store.wrapperBack = wrapperBack;           // store background
        wrapper.parentNode.appendChild(wrapperBack);    // append background

        // animate background
        Velocity(wrapperBack, { scaleY: [1, 0] }, {duration: 300, easing: _this.opts.easing, queue: false});
    },

    _createTranslation: function() {
        var wrapperBack = this.store.wrapperBack,
            sentence = this.store.sentence,
            t = sentence.t,                             // string - translation
            translation = document.createElement('p'),
            span, tSplited;

        // Append spans in translation
        tSplited = t.split(" ");
        for (var i=0, len=tSplited.length; i < len; i++) {
            span = document.createElement("span");
            span.appendChild( document.createTextNode(tSplited[i]) );
            translation.appendChild( span );
            if (i < len - 1) {
                translation.appendChild( document.createTextNode(" ") );
            }
        }
        translation.id = 'translation';
        translation.className = 'translation';

        wrapperBack.appendChild(translation);
    },

    _createFooter: function() {
        var _this = this,
            footer = this.store.footer,
            fragment = document.createDocumentFragment(),
            footerTips = document.createElement('button'),
            footerBack = document.createElement('button'),
            footerShop = footer.querySelector('.btn-shop');

        footerTips.className = 'btn-footer btn-translate';
        footerTips.appendChild( document.createTextNode('? Tips') );
        footerTips.type = 'button';

        footerBack.className = 'btn-footer btn-back';
        footerBack.appendChild( document.createTextNode('= Back') );
        footerBack.type = 'button';

        footerTips.addEventListener('click', function _tips() {
            _this.showTrans();
            footerTips.removeEventListener('click', _tips, false);
        }, false);

        footerBack.addEventListener('click', function _back() {
            _this.backhome();
            footerBack.removeEventListener('click', _back, false);
        }, false);

        footerShop.addEventListener('click', function _shop() {
            _this._resetState();
            footerShop.removeEventListener('click', _shop, false);
        }, false);

        fragment.appendChild(footerBack);
        fragment.appendChild(footerTips);

        footer.appendChild(fragment);

        //footer.parentNode.className += ' app-footer-full';
    },

    _newSortable: function() {
        var _this = this,
            wrapper = this.store.wrapper,
            sortable;

        if (wrapper) {
            sortable = new Sortable(wrapper, {
                animation: 0,
                onStart: function (evt) {                   // dragging started
                    _this._toggleOpacity(evt.item, "0.5");
                },
                onEnd: function (evt) {                     // dragging ended
                    _this._toggleOpacity(evt.item, "1");
                    _this._checkSentence();
                },
            });
            this.store.sortable = sortable;
        }
    },


    /**
     *  REMOVAL
     */

    _removeHome: function() {
        try {
            var content = this.store.content,
                menu = document.getElementById('menu-home'),
                menuCopy = menu.cloneNode(true),
                replacedMenu = content.replaceChild(menuCopy, menu),
                removedMenu = content.removeChild(menuCopy);
                replacedMenu =
                removedMenu = null;
        } catch (ex) {}
    },

    _removeFooter: function() {     // this whole thing is in flux
        //var _this = this,
        //    content = this.store.content,
        //    footer = document.querySelector('.app-footer'),
        //    translate = document.getElementById('translate');

        //Velocity( translate, {opacity: 0, translateY: '1rem'}, {duration: _this.opts.duration, easing: _this.opts.easing, visibility: 'hidden',
        //    complete: function() {
        //        _this._destroy(footer);
        //    }
        //} );
    },

    _removeSentence: function() {
        if (this.state.level === 'home') { return; }    // if in main menu

        var itemsOnBoard = this.store.itemsOnBoard,
            wrapperBack = this.store.wrapperBack;

        this._destroy(itemsOnBoard.firstChild);     // destroy words
        this._destroy(itemsOnBoard.firstChild);     // destroy clones
        this._destroy(wrapperBack.firstChild);      // destroy translation
        this._destroy(itemsOnBoard.lastChild);      // destroy next-arrow
    },

    _destroySortable: function() {
        if (this.state.level === 'home') { return; } // if in main menu

        var sortable = this.store.sortable;
        sortable.destroy();
        this.store.sortable = null;
    },


    /**
     *  ANIMATION
     */

    homeIn: function() {
        var _this = this,
            menu = document.createElement('div'),
            menuItemClass = "btn-menu btn-menu-hidden",
            menuItemOne = document.createElement('button'),
            menuItemTwo = menuItemOne.cloneNode(true),
            menuItemThree = menuItemOne.cloneNode(true),
            content = this.store.content,
            menuItems, menuItem;

        menu.className = "items center";
        menu.id = "menu-home";

        menuItemOne.className = menuItemClass + " btn-menu-1";
        menuItemOne.innerHTML = '<span>Od podstaw</span><div class="percent">87%</div>';
        menuItemOne.addEventListener('click', function() {
            _this.homeOut('a');
        });

        menuItemTwo.className = menuItemClass + " btn-menu-2";
        menuItemTwo.innerHTML = '<span>Średnio-zaawansowane</span><div class="percent">100%</div>';
        menuItemTwo.addEventListener('click', function() {
            _this.homeOut('b');
        });

        menuItemThree.className = menuItemClass + " btn-menu-3";
        menuItemThree.innerHTML = '<span>Zaawansowane</span><div class="percent">5%</div>';
        menuItemThree.addEventListener('click', function() {
            _this.homeOut('c');
        });

        menu.appendChild(menuItemOne);
        menu.appendChild(menuItemTwo);
        menu.appendChild(menuItemThree);

        content.appendChild(menu);                                          // append menu

        menuItems = [menuItemOne, menuItemTwo, menuItemThree];

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [1, 0], translateX: [0, '200px'] }, { duration: 400, easing: _this.opts.easing, delay: i*100 } );
        }
    },

    homeOut: function(level) {
        if (this.state.level !== 'home') { return; }

        var _this = this,
            menuItems = document.querySelectorAll('.btn-menu'),
            menuItem;

        this.state.level = level;       // store level state

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [0, 1], translateX: ['-200px', 0] }, { duration: 400, easing: _this.opts.easing, delay: i*100,
                complete: function(elements) {
                    elements.forEach( function(item, index, array) {
                        if ( item === menuItems[len - 1] ) {
                            _this._newSentence();
                        }
                    } );
                }
            } );

        }
    },

    //
    // czy możemy połączyć {_comeIn()} tak, żeby to {animate()} robiło animację????
    //

    animate: function() {
        var _this = this,
            words = this.store.words,
            clones = this.store.clones,
            contentPosition = this.store.contentPosition,
            wrapperBack = this.store.wrapperBack,
            wordPositionsOld = this.store.wordPositions,
            wrapper = this.store.wrapper,
            wordPositionsNew = [],
            len = words.length,
            wordPosition, lastChild, lastChildPosition, newPadding, animateClones, animateWrapperBack;

        (function() {
            for (var i=0; i < len; i++) {
                //words[i].style.paddingRight = '';   // reset padding;
            }
        })();

        (function() {
            for (var i=0; i < len; i++) {
                wordPosition = words[i].getBoundingClientRect();

                wordPositionsNew[i] = {
                    left: Math.round(wordPosition.left - contentPosition.left),
                    top: Math.round(wordPosition.top - contentPosition.top),
                    bottom: Math.round(wordPosition.bottom - contentPosition.top),
                };
            }
        })();
        this.store.wordPositions = wordPositionsNew;    // store each word's position

        animateClones = this._debounce(function() {
            for (var i=0; i < len; i++) {
                Velocity( clones[i], {
                    translateX: [wordPositionsNew[i].left, wordPositionsOld[i].left],
                    translateY: [wordPositionsNew[i].top, wordPositionsOld[i].top],
                    //left: [wordPositionsNew[i].left, wordPositionsOld[i].left],
                    //top: [wordPositionsNew[i].top, wordPositionsOld[i].top],
                }, { duration: _this.opts.duration, easing: _this.opts.easing, queue: false,
                });
            }
        }, 10);
        animateClones();

        animateWrapperBack = this._debounce(function() {
            var changedWrapperBack = _this._checkBackSize();
            if (changedWrapperBack) {
                var wrapperBackHeight = _this.store.wrapperBackHeight;
                var wrapperBackTop = _this.store.wrapperBackTop;

                Velocity(wrapperBack, { height: wrapperBackHeight, top: wrapperBackTop }, {duration: 300, easing: _this.opts.easing, queue: false});
            }
        }, 100);
        animateWrapperBack();

        // add padding to the last element
        //lastChild = wrapper.lastChild;
        //lastChildPosition = lastChild.getBoundingClientRect();
        //newPadding = Math.floor( wrapperPosition.right - lastChildPosition.right );
        //Velocity.hook(lastChild, 'paddingRight', newPadding + "px" );

    },

    showTrans: function() {
        if (this.state.transIn) { return; }
        if (this.state.level === 'home') { return; }

        var _this = this,
            content = this.store.content,
            translation = content.querySelector(".translation"),
            spans = translation.querySelectorAll("span"),
            footer = this.store.footer,
            translate = footer.querySelector('.btn-translate'),
            span;

        this.store.translationSpans = spans;       // store translation, it will be used in nextSentence

        for (var i=0, len=spans.length; i < len; i++) {
            span = spans[i];
            Velocity( span, { opacity: [1, 0],  translateX: [0, '200px'] }, { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 } );
        }

        Velocity( translate, { opacity: [0, 1],  }, { duration: _this.opts.duration, easing: _this.opts.easing, visibility: "hidden" } );

        this.state.transIn = true;
    },

    _comeIn: function() {
        var _this = this,
            contentPosition = this.store.contentPosition,
            wordPositions = this.store.wordPositions,
            clones = this.store.clones,
            x = this.opts.valueX,
            left;

        (function() {
            for (var i=0, len=clones.length; i < len; i++) {
                left = wordPositions[i].left;
                Velocity(
                    clones[i],
                    { opacity: 1, translateX: [left, left + x]},
                    { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 + 200, queue: false }
                );
            }
        })();
    },

    _comeOut: function() {
        if (this.state.level === 'home') { return; }

        var _this = this,
            wordPositions = this.store.wordPositions,
            clones = this.store.clones,
            nextArr = this.store.nextArr,
            translationSpans = this.store.translationSpans,
            x = this.opts.valueX,
            actualWords = this.store.wrapper.childNodes,
            span, left, position, removeSentence;

        (function() {
            for (var i=0, len=translationSpans.length; i < len; i++) {
                span = translationSpans[i];
                Velocity( span, { opacity: [0, 1],  translateX: ['-200px', 0] }, { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 } );
            }
        })();

        removeSentence = this._debounce(function() {
            _this._removeSentence();
        }, 300);

        (function() {
            for (var i=0, len=actualWords.length; i < len; i++) {
                position = actualWords[i].dataset.pos - 1;
                left = wordPositions[position].left;
                Velocity(
                    clones[position],
                    { opacity: 1, translateX: [left - x, left]},
                    { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 + 200, queue: false,
                        complete: function(elements) {
                            elements.forEach( function(item, index, array) {
                                if ( item === clones[len - 1] ) {
                                    removeSentence();
                                }
                            } );
                        }
                    }
                );
            }
        })();

        Velocity(nextArr, { scale: [0, 1] }, { duration: _this.opts.duration*2, easing: _this.opts.easing });
    },



    _showNextArr: function() {
        if (this.state.level === 'home') { return; }

        var _this = this,
            itemsOnBoard = this.store.itemsOnBoard,
            nextArrWrap = document.createElement('div'),
            nextArr = document.createElement('button');

        // prepare new nodes
        nextArrWrap.className = 'wrapper-next-arr';
        nextArr.className = 'next-arr';
        nextArr.id = 'next-arr';
        nextArr.type = 'button';
        nextArr.innerHTML = '&raquo';

        this.store.nextArr = nextArr;       // store nextArr for referance

        nextArr.addEventListener('click', function _fu() {
            _this.nextSentence();
            nextArr.removeEventListener('click', _fu, false);
        }, false);

        nextArrWrap.appendChild(nextArr);               // append into arrow wrapper
        itemsOnBoard.appendChild(nextArrWrap);          // append into items-on-board

        Velocity(nextArr, {scale: [1, 0]}, { duration: _this.opts.duration*2, easing: _this.opts.easing, delay: 200});
    },

    _changeColor: function() {
        try {
            var section = document.getElementById('section'),
                sectionClass = ' section-100',
                level = this.state.level;

            switch (level) {
                case 'a':    section.className = 'section-green' + sectionClass; break;
                case 'b':    section.className = 'section-orange' + sectionClass; break;
                case 'c':    section.className = 'section-red' + sectionClass; break;
                case 'menu': section.className = 'section-dark' + sectionClass; break;
            }

        } catch (ex) {}
    },

    _toggleOpacity: function(el, op) {
        try {
            var pos = el.dataset.pos - 1,
                clone = this.store.clones[pos];
            Velocity.hook(clone, "opacity", op);
        } catch (ex) {}
    },

    _itemsOff: function() {
        var itemsOnBoard = this.store.itemsOnBoard;

        itemsOnBoard.className = itemsOnBoard.className + " items-off";
    },


    /**
     *  HELPERS
     */

    _getSentence: function() {
        try {
            var no = this.state.no,
                level = this.state.level,
                sentence;

            switch (level) {
                case 'a': sentence = arrayA(no); break;
                case 'b': sentence = arrayB(no); break;
                case 'c': sentence = arrayC(no); break;
            }
            return this.store.sentence = sentence;  // store sentence
        } catch (ex) { console.log(ex); }
    },

    _getLevels: function() {
        // some way of geting percent of levels done to show on home
    },

    // tu trzeba usunąć debounce (przenieść tak, gdzie ta funkcja jest called)
    _checkSentence: function() {        // check if sentence is correct
        var _this = this,
            sentence = this.store.sentence,
            wrapper = this.store.wrapper,
            wordsOrder = [],
            currentResult = false,
            checkSentence,
            words, count, result, currentSentence;

        checkSentence = this._debounce(function(){
            words = wrapper.querySelectorAll('.btn-word');

            (function() {
                for (var i=0, len=words.length; i < len; i++) {
                    count = wordsOrder.push(words[i].innerHTML);
                }
            })();

            /*
             *  !!! NOT EFICIENT
             */
            result = function() {
                for (var i=0, len=sentence.s.length; i < len; i++) {
                    currentSentence = sentence.s[i];
                    (function() {
                        for (var i=0, len=wordsOrder.length; i < len; i++) {
                            if (wordsOrder[i] !== currentSentence[i]) { return false; }
                        }
                        currentResult = true;
                    })();
                }
                return currentResult;
            };

            if ( result() ) {
                _this._finishedSentence();       // if the sentence is correct call the end
            }

        }, 200);

        checkSentence();
    },

    _checkBackSize: function() {
        try {
            var wordPositions = this.store.wordPositions,
                wrapperBackHeight = this.store.wrapperBackHeight,
                wrapperBackTop = this.store.wrapperBackTop,
                wordTops = [],
                wordBottoms = [],
                top, bottom, newHeight, newTop;

            for (var i=0, len=wordPositions.length; i < len; i++) {
                top = wordPositions[i].top;
                bottom = wordPositions[i].bottom;
                wordTops.push(top);
                wordBottoms.push(bottom);
            }

            wordTops.sort();
            wordBottoms.sort();

            newHeight = Math.floor( wordBottoms[wordBottoms.length -1] - wordTops[0] ) + 6;
            newTop = Math.floor( wordTops[0] - 3 );

            if (wrapperBackHeight !== newHeight) {
                this.store.wrapperBackHeight = newHeight;
                this.store.wrapperBackTop = newTop;
                return true;        // if the size changed, return true
            }

        } catch(ex) {}
    },

    _watchResize: function(state) {
        var resize,
            _this = this;
        if (state) {
            resize = _this._debounce(function() {
                _this.animate();
            }, 250);
            _this.store.resize = resize;
            window.addEventListener('resize', resize, false);
        } else {
            resize = _this.store.resize;
            window.removeEventListener('resize', resize, false);
        }
    },

    _cleanStore: function() {
        var store = this.store;

        store.sentence =
        store.nextArr =
        store.translationSpans = null;
        store.words =
        store.clones = [];
    },

    _saveState: function() {
        var state = this.state,
            storage = localStorage;

        storage.setItem('level', state.level);
        storage.setItem('no', state.no);
        console.log('state saved');
    },

    _loadState: function() {
        var state = this.state,
            storage = localStorage;

        if (storage.length > 0) {
            state.level = storage.getItem('level');
            state.no = storage.getItem('no');
            console.log('state loaded');
        }
    },

    _resetState: function() {
        var storage = localStorage;

        if (storage.length > 0) {
            storage.clear();
            console.log('reset');
        }
    },


    // Returns a function, _this, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    _destroy: function(el) {
        try {
            var parent = el.parentNode,
                copy = el.cloneNode(true),
                replaceEl = parent.replaceChild(copy, el),
                removeEl = parent.removeChild(copy);

            el =
            copy =
            replaceEl =
            removeEl = null;
        } catch (ex) {console.log(ex);}
    },

    _compareArrays: function(array1, array2) {
        if (!array1 || !array2) { return; }
        if (array1.length !== array2.length) { return false; }

        for (var i, len=array1.length; i < len; i++) {
            if (array1[i] !== array2[i]) { return false; }
        }
        return true;
    },

    _checkSpill: function(spill, s) {
        var _this = this,
            result = s.every(function(item, index, array){
                _this._compareArrays(spill, item);
            });

        return result;
    },


};

var sentence = new Sentence();