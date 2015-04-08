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




function Sentence() {

    this.store = {
        section:    document.getElementById('section'),         // main section NODE
        content:    document.getElementById('content'),         // main div NODE
        footer:     document.getElementById('wrapper-buttons'), // footer NODE
        contentPosition:    null,                               // position of main div OBJECT
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
        translationSpans:   [],                                 // translation spans ARRAY of NODEs
        menuItems:          [],                                 // menu buttons ARRAY of NODEs
    };

    this.opts = {
        easing:     [0.645,0.045,0.355,1],
        duration:   200,
        valueX:     400,
    };

    this.state = {
        transIn:    false,
        footerIn:   false,
        btns:       {
                        showTrans:  false,
                        backHome:   false,
                        nextArr:    false,
                    },
        level:      'home',
        a:          0,
        b:          0,
        c:          0,
        pct:        [],
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

        this._attachListeners();

        if (this.state.level === 'home') {
            this._createMenu();
            this.menuIn();
        } else {
            this._newSentence();
        }

    },

    _newSentence: function() {
        this._changeColor();                    // change color
        this._removeHome();                     // remove the menu
        this._toggleFooter();                   // show footer
        this._getSentence();                    // get the words
        this._createItemsOnBoard();             // create items-on-board
        this._createSentence();                 // create the words
        this._createClones();                   // clone the words
        this._createWrapperBack();              // create the background
        this._createTranslation();              // create translation
        this._createNextArr();                  // create next arr
        this._newSortable();                    // init. Sortable
        this._watchResize(true);                // watch browser changes

        this._saveState();                      // save state in localStorage

        this._comeIn();                         // let the sentence in
    },

    _finishedSentence: function() {
        var level = this.state.level,
            no = this.state[level];

        if (level !== 'home') {
            this._destroySortable();            // destroy sortable
            this.state[level] = no + 1;         // save sentence number
            this._saveState();                  // save state in localStorage
            this.showTrans();                   // show translation
            this._toggleItems();                // change color of words
            this._toggleNextArr();              // show arrow next
        }
    },

    nextSentence: function() {
        var level = this.state.level;

        if (level !== 'home') {
            var _this = this,
                onComplete = this._debounce(function() {
                                _this._toggleItems();               // back to normal color of words
                                _this._removeSentence();            // remove sentence and translate
                                _this._cleanStore();                // clean store

                                _this._getSentence();               // get the words
                                _this._createSentence();            // create the words
                                _this._createClones();              // clone the words
                                _this._animateWrapperBack();        // animate back
                                _this._createTranslation();         // create translation
                                _this._createNextArr();             // create next arr
                                _this._newSortable();               // init. Sortable
                                _this._watchResize(true);           // watch browser changes
                                _this._toggleBtn('showTrans',true); // reset showTrans

                                _this._comeIn();                    // let the sentence in
                            }, 300);

            this._comeOut(onComplete);           // animate everything out
        }
    },

    backHome: function() {
        if (this.state.level === 'home') { return; }

        var _this = this,
            itemsOnBoard = this.store.content.firstChild;

        this._watchResize(false);                       // stop watching browser changes
        this._toggleFooter();                           // hide footer

        function onComplete() {
            _this.state.level = 'home';                 // save state
            _this._saveState();
            _this._removeSentence();                    // remove sentence and translation

            function onCompleteBack() {
                _this._destroy(itemsOnBoard);
                _this._changeColor();                   // change color
                _this._cleanStore();                    // clean store

                _this._createMenu();
                _this.menuIn();
            };
            _this._removeWrapperBack(onCompleteBack);   // remove wrapper back
        };
        this._comeOut(onComplete);            // animate sentence, destroy it, animate back, destroy it

    },


    /**
     *  CREATION
     */

    _createMenu: function() {
        var _this = this,
            content = this.store.content,
            menu = document.createElement('div'),               // new nodes
            menuItemOne = document.createElement('button');

        // prepare nodes
        menu.className = "items center";
        menu.id = "menu-home";
        menuItemOne.className = 'btn-menu btn-menu-hidden';

        // clone nodes
        var menuItemTwo = menuItemOne.cloneNode(true),
            menuItemThree = menuItemOne.cloneNode(true);

        this._getLevelsPct();                                   // get percentage of each level

        menuItemOne.className += " btn-menu-1";
        menuItemOne.id = "menuOutA";
        menuItemOne.innerHTML = '<span>Od podstaw</span><div class="percent">' + this.state.pct[0] + '%</div>';

        menuItemTwo.className += " btn-menu-2";
        menuItemTwo.id = "menuOutB";
        menuItemTwo.innerHTML = '<span>Średnio-zaawansowane</span><div class="percent">' + this.state.pct[1] + '%</div>';

        menuItemThree.className += " btn-menu-3";
        menuItemThree.id = "menuOutC";
        menuItemThree.innerHTML = '<span>Zaawansowane</span><div class="percent">' + this.state.pct[2] + '%</div>';

        this.store.menuItems = [menuItemOne, menuItemTwo, menuItemThree];       // store menu items

        menu.appendChild(menuItemOne);
        menu.appendChild(menuItemTwo);
        menu.appendChild(menuItemThree);

        content.appendChild(menu);                  // append menu
    },

    _createItemsOnBoard: function() {
        var content = this.store.content,
            itemsOnBoard = document.createElement('div');

        itemsOnBoard.id = 'items';
        itemsOnBoard.className = 'items items-on-board';

        this.store.itemsOnBoard = itemsOnBoard;                 // store items-on-board
        content.insertBefore(itemsOnBoard, content.firstChild); // append items-on-board
    },

    _createSentence: function() {
        var sentence = this.store.sentence, // sentence object
            s = sentence.s,                 // array of good answers
            b = sentence.b;                 // string - word you can't touch

        if (b === undefined) {              // if there are no restricted word
            b = false;
        }

        var content = this.store.content,
            itemsOnBoard = this.store.itemsOnBoard,
            // New nodes
            wrapper = document.createElement('div'),
            word = document.createElement('div'),
            wordInner = document.createElement('div'),
            spill, newWord, wordsCount;

        // Prepare nodes
        wrapper.id = 'wrapper-words';
        word.className = 'btn-outer';
        wordInner.className = "btn-word";

        word.appendChild(wordInner);                            // append inside the word

        // copy the first correct answer and sort words randomly
        spill = s[0].concat();
        spill = spill.sort(function() { return 0.5 - Math.random(); });

        // sort once again while spill and answer are the same
        while (this._checkSpill(spill, s)) {
            spill = spill.sort(function() { return 0.5 - Math.random(); });
        }

        // Append words into the wrapper
        for (var i=0, len=spill.length; i < len; i++) {
            newWord = word.cloneNode(true);
            newWord.dataset.pos = i + 1;
            newWord.firstChild.innerHTML = spill[i];
            wrapper.appendChild(newWord);                         // append words
            wordsCount = this.store.words.push(newWord);          // store words
        }

        this.store.wrapper = wrapper;                           // store wrapper
        itemsOnBoard.appendChild(wrapper);                      // append wrapper
    },

    _createClones: function() {
        var _this = this,
            wrapper = this.store.wrapper,
            contentPosition = this.store.contentPosition,
            words = this.store.words,
            x = this.opts.valueX,
            wordPositions = [],
            storedClones = [],
            countStoredClones, countWordPositions, wordPosition, clone,

            // new node
            clones = document.createElement('div');

        // prepare new node
        clones.className = 'clones';
        clones.id = 'wrapper-clones';

        // for each word, store its position and create a clone
        (function() {
            for (var i=0, len=words.length; i < len; i++) {
                var word = words[i];
                wordPosition = word.getBoundingClientRect();
                wordPositions[i] = {
                    left: Math.round(wordPosition.left - contentPosition.left),
                    top: Math.round(wordPosition.top - contentPosition.top),
                    bottom: Math.round(wordPosition.bottom),
                };

                clone = word.cloneNode(true);
                clone.className = clone.className + " clone";

                Velocity.hook(clone, "translateX", wordPositions[i].left + x + "px");
                Velocity.hook(clone, "translateY", wordPositions[i].top + "px");

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

        Velocity(wrapperBack, { scaleY: [1, 0] }, {duration: _this.opts.easing * 1.5, easing: _this.opts.easing, queue: false});
    },

    _createTranslation: function() {
        var wrapperBack = this.store.wrapperBack,
            sentence = this.store.sentence,
            t = sentence.t,                                 // string - translation
            translation = document.createElement('p'),
            tSplited = t.split(" "),
            translationSpans = [],
            span, count;

        // prepare new node
        translation.id = 'translation';
        translation.className = 'translation';

        for (var i=0, len=tSplited.length; i < len; i++) {
            span = document.createElement("span");
            span.appendChild( document.createTextNode(tSplited[i]) );
            count = translationSpans.push(span);
            translation.appendChild( span );
            if (i < len - 1) {
                translation.appendChild( document.createTextNode(" ") );
            }
        }

        this.store.translationSpans = translationSpans;     // store translation spans


        wrapperBack.appendChild(translation);
    },

    _createNextArr: function() {
        if (this.state.level === 'home') { return; }

        var _this = this,
            itemsOnBoard = this.store.itemsOnBoard,
            nextArrWrap = document.createElement('div'),
            nextArr = document.createElement('button');

        // prepare new nodes
        nextArrWrap.className = 'wrapper-next-arr';
        nextArrWrap.id = 'wrapper-next-arr';
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

    _removeWrapperBack: function(onCompleteBack) {
        var _this = this,
            multiplier = this.store.sentence.s[0].length,
            wrapperBack = this.store.wrapperBack,
            _onCompleteBack = this._debounce(function() {
                onCompleteBack()
            }, 50);

        Velocity(wrapperBack, { scaleY: [0, 1], opacity: [0, 1] }, {duration: _this.opts.duration * 1.5, easing: _this.opts.easing,
            complete: function(elements) {
                elements.forEach(function(item, index, array) {
                    _onCompleteBack();
                });
            }
        });
    },

    _removeSentence: function() {
        var translation = document.getElementById('translation'),
            words = document.getElementById('wrapper-words'),
            clones = document.getElementById('wrapper-clones'),
            nextArr = document.getElementById('wrapper-next-arr');

        this._destroy(words);           // destroy words
        this._destroy(clones);          // destroy clones
        this._destroy(translation);     // destroy translation
        this._destroy(nextArr);         // destroy next-arrow
    },

    _destroySortable: function() {
        var sortable = this.store.sortable;
        sortable.destroy();
        this.store.sortable = null;
    },


    /**
     *  ANIMATION
     */

    menuIn: function() {
        var _this = this,
            menuItems = this.store.menuItems,
            menuItem;

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [1, 0], translateX: [0, '200px'] }, { duration: _this.opts.duration * 2, easing: _this.opts.easing, delay: i*100 } );
        }
    },

    menuOut: function(level) {
        if (this.state.level !== 'home') { return; }

        var _this = this,
            menuItems = document.querySelectorAll('.btn-menu'),
            menuItem;

        this.state.level = level;       // store level state

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [0, 1], translateX: ['-200px', 0] }, { duration: _this.opts.duration * 2, easing: _this.opts.easing, delay: i*100,
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

    animate: function() {
        var _this = this,
            words = this.store.words,
            clones = this.store.clones,
            contentPosition = this.store.contentPosition,
            wordPositionsOld = this.store.wordPositions,
            //wrapper = this.store.wrapper,
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
                }, { duration: _this.opts.duration, easing: _this.opts.easing, queue: false,
                });
            }
        }, 10);
        animateClones();

        animateWrapperBack = this._debounce(function() {
            _this._animateWrapperBack();
        }, 200);
        animateWrapperBack();

        // add padding to the last element
        //lastChild = wrapper.lastChild;
        //lastChildPosition = lastChild.getBoundingClientRect();
        //newPadding = Math.floor( wrapperPosition.right - lastChildPosition.right );
        //Velocity.hook(lastChild, 'paddingRight', newPadding + "px" );

    },

    _animateWrapperBack: function() {
        var _this = this;
            wrapperBack = this.store.wrapperBack,
            changedWrapperBack = this._checkBackSize();

        if (changedWrapperBack) {
            var wrapperBackHeight = this.store.wrapperBackHeight;
            var wrapperBackTop = this.store.wrapperBackTop;

            Velocity(wrapperBack, { height: wrapperBackHeight, top: wrapperBackTop }, {duration: _this.opts.duration * 1.5, easing: _this.opts.easing, queue: false});
        }
    },

    showTrans: function() {
        if (this.state.transIn) { return; }
        if (this.state.level === 'home') { return; }

        var _this = this,
            spans = this.store.translationSpans,
            span;

        for (var i=0, len=spans.length; i < len; i++) {
            span = spans[i];
            Velocity( span, { opacity: [1, 0],  translateX: [0, '200px'] }, { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 } );
        }

        this._toggleBtn('showTrans', false);

        this.state.transIn = true;
    },

    _toggleFooter: function() {
        var level = this.state.level,
            footer = this.store.footer;

        if (this.state.footerIn) {
            footer.parentNode.className = 'app-footer';
            this.state.footerIn = false;
        } else {
            footer.parentNode.className += ' app-footer-sentence';
            this.state.footerIn = true;
        }

        this._toggleBtn('showTrans', this.state.footerIn);
        this._toggleBtn('backHome', this.state.footerIn);
    },

    _toggleBtn: function(btn, on) {
        if (on !== this.state.btns[btn]) {
            var clicked = document.getElementById(btn),
                className = 'btn-footer-hidden';

            this.state.btns[btn] = on;
            this._toggleClass(clicked, className);
        }
    },

    _toggleNextArr: function() {
        if (this.state.level === 'home') { return; }

        var _this = this,
            nextArr = this.store.nextArr;

        if (this.state.btns.nextArr) {
            this.state.btns.nextArr = false;

            Velocity(nextArr, {scale: [0, 1]}, { duration: _this.opts.duration*2, easing: _this.opts.easing, delay: _this.opts.duration, display: 'none'});

        } else {
            this.state.btns.nextArr = true;

            Velocity(nextArr, {scale: [1, 0]}, { duration: _this.opts.duration*2, easing: _this.opts.easing, delay: _this.opts.duration, display: 'block'});
        }
    },

    _comeIn: function() {
        var _this = this,
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
                    { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 + _this.opts.duration, queue: false }
                );
            }
        })();
    },

    _comeOut: function(onComplete) {
        if (this.state.level === 'home') { return; }

        var _this = this,
            wordPositions = this.store.wordPositions,
            clones = this.store.clones,
            nextArr = this.store.nextArr,
            transIn = this.state.transIn,
            x = this.opts.valueX,
            actualWords = this.store.wrapper.childNodes,
            span, left, position,
            _onComplete = this._debounce(function() {
                onComplete()
            }, 50);

        if (transIn) {
            var translationSpans = this.store.translationSpans;

            (function() {
                for (var i=0, len=translationSpans.length; i < len; i++) {
                    span = translationSpans[i];
                    Velocity( span, { opacity: [0, 1],  translateX: ['-200px', 0] }, { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 } );
                }
            })();
        }

        if (this.state.btns.nextArr) {
            this._toggleNextArr();
        }

        (function() {
            for (var i=0, len=actualWords.length; i < len; i++) {
                position = actualWords[i].dataset.pos - 1;
                left = wordPositions[position].left;
                Velocity(
                    clones[position],
                    { opacity: [0, 1], translateX: [left - x, left]},
                    { duration: _this.opts.duration, easing: _this.opts.easing, delay: i*100 + _this.opts.duration, queue: false,
                        complete: function(elements) {
                            elements.forEach( function(item, index, array) {
                                if ( item === clones[len - 1] ) {
                                    _onComplete();
                                }
                            } );
                        }
                    }
                );
            }
        })();
    },

    _changeColor: function() {
        var section = this.store.section,
            sectionClass = ' section-100',
            level = this.state.level;

        switch (level) {
            case 'a':    section.className = 'section-green' + sectionClass; break;
            case 'b':    section.className = 'section-orange' + sectionClass; break;
            case 'c':    section.className = 'section-red' + sectionClass; break;
            case 'home': section.className = 'section-dark' + sectionClass; break;
        }
    },

    _toggleOpacity: function(el, op) {
        try {
            var pos = el.dataset.pos - 1,
                clone = this.store.clones[pos];
            Velocity.hook(clone, "opacity", op);
        } catch (ex) {}
    },

    _toggleItems: function() {
        var itemsOnBoard = this.store.itemsOnBoard;

        if (itemsOnBoard.className === 'items items-on-board') {
            itemsOnBoard.className += " items-off";
        } else {
            itemsOnBoard.className = 'items items-on-board';
        }
    },


    /**
     *  HELPERS
     */

    _getSentence: function() {
        try {
            var level = this.state.level,
                no = this.state[level],
                sentence;

            switch (level) {
                case 'a': sentence = arrayA(no, false); break;
                case 'b': sentence = arrayB(no, false); break;
                case 'c': sentence = arrayC(no, false); break;
            }
            return this.store.sentence = sentence;  // store sentence
        } catch (ex) { console.log(ex); }
    },

    _getLevelsPct: function() {
        try {
            var state = this.state,
                a = arrayA(false, true),
                b = arrayB(false, true),
                c = arrayC(false, true),
                pctA = Math.round( state.a * 100 / a ),
                pctB = Math.round( state.b * 100 / b ),
                pctC = Math.round( state.c * 100 / c );

            state.pct = [pctA, pctB, pctC];                     // store percentage

        } catch (ex) {}
    },

    _checkSentence: function() {        // check if sentence is correct
        var _this = this,
            sentence = this.store.sentence,
            s = sentence.s,
            wrapper = this.store.wrapper,
            wordsOrder = [],
            checkSentence, words, count;

        checkSentence = this._debounce(function(){
            words = wrapper.querySelectorAll('.btn-word');

            (function() {
                for (var i=0, len=words.length; i < len; i++) {
                    count = wordsOrder.push(words[i].innerHTML);
                }
            })();

            if ( _this._checkSpill(wordsOrder, s) ) {
                _this._finishedSentence();                              // if the sentence is correct call the end
            }

            console.log('check sentence');

        }, 200);

        checkSentence();
    },

    _checkBackSize: function() {
        try {
            var wordPositions = this.store.wordPositions,
                wrapperBackHeight = this.store.wrapperBackHeight,
                wordTops = [],
                wordBottoms = [],
                top, bottom, newHeight, newTop;

            for (var i=0, len=wordPositions.length; i < len; i++) {
                top = wordPositions[i].top;
                bottom = wordPositions[i].bottom;
                wordTops.push(top);
                wordBottoms.push(bottom);
            }

            console.log('check back size');

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
        var _this = this,
            resize;

        if (state) {
            resize = _this._debounce(function() {
                _this.animate();
            }, 250);

            window.addEventListener('resize', resize, false);
            _this.store.resize = resize;

            console.log('watch resize on');
        } else {
            resize = _this.store.resize;
            window.removeEventListener('resize', resize, false);

            _this.store.resize = null;

            console.log('watch resize off');
        }
    },

    _attachListeners: function() {
        var _this = this;

        document.addEventListener('click', function listener(event) {
            var target = event.target;

            switch (target.id) {
                case "showTrans":  _this.showTrans(); break;
                case "backHome":   _this.backHome(); break;
                case "resetState": _this.resetState(); break;
                case "menuOutA" : _this.menuOut('a'); break;
                case "menuOutB":  _this.menuOut('b'); break;
                case "menuOutC":  _this.menuOut('c'); break;
            }

        });
    },

    _cleanStore: function() {
        this.store.sentence =
        this.store.wrapper =
        this.store.nextArr =
        this.store.translationSpans = null;

        this.store.wrapperBackHeight =
        this.store.wrapperBackTop = 0;

        this.store.words =
        this.store.clones =
        this.store.wordPositions =
        this.store.translationSpans = [];

        this.state.transIn =
        this.state.btns.nextArr = false;

        console.log('cleaned store');
    },

    _saveState: function() {
        var state = this.state,
            level = state.level,
            storage = localStorage;

        storage.setItem('level', level);
        console.log('saved level');

        if (level !== 'home') {
            storage.setItem(level, state[level]);
            console.log('saved number');
        }
    },

    _loadState: function() {
        if (localStorage.length > 0) {
            var a = parseInt( localStorage.getItem('a') ),
                b = parseInt( localStorage.getItem('b') ),
                c = parseInt( localStorage.getItem('c') );

            this.state.level = localStorage.getItem('level');

            if (a >= 0) { this.state.a = a; }
            if (b >= 0) { this.state.b = b; }
            if (c >= 0) { this.state.c = c; }

            console.log('state loaded');
        }
    },

    resetState: function() {
        var storage = localStorage;

        if (storage.length > 0) {
            storage.clear();
            document.location.reload();
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

    _toggleClass: function(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0) {
                classes.splice(existingIndex, 1);
            } else {
                classes.push(className);
            }

            el.className = classes.join(' ');
        }
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

        for (var i=0, len=array1.length; i < len; i++) {
            if (array1[i] !== array2[i]) { return false; }
        }
        return true;
    },

    _checkSpill: function(spill, s) {
        var _this = this;

        var result = s.every(function(item, index, array){
            return _this._compareArrays(spill, item);
        });

        return result;
    },


};


var sentence = new Sentence();