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

    // here are stored all strange things
    this.store = {
        content:            document.getElementById('content'), // main div
        contentPosition:    null,                               // position of main div
        sentence:           null,                               // whole sentence object
        words:              [],                                 // words for reference
        clones:             [],                                 // clones for reference
        wordPositions:      [],                                 // positions for reference
        wrapper:            null,                               // wrapper for reference
        wrapperBack:        null,                               // wrapperBack for referance
        wrapperBackHeight:  0,                                  // wrapperBack height
    };

    // often used contants
    this.opts = {
        easing: [0.645,0.045,0.355,1],
        duration: 200
    };

    // Is the user working on a sentence or not?    // can be used for various checks
    this.rolling = false;

}

Sentence.prototype = {

    constructor: Sentence,

    homeIn: function() {
        var that = this,
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
            that.homeOut('a');
        });

        menuItemTwo.className = menuItemClass + " btn-menu-2";
        menuItemTwo.innerHTML = '<span>Średnio-zaawansowane</span><div class="percent">100%</div>';
        menuItemTwo.addEventListener('click', function() {
            that.homeOut('b');
        });

        menuItemThree.className = menuItemClass + " btn-menu-3";
        menuItemThree.innerHTML = '<span>Zaawansowane</span><div class="percent">5%</div>';
        menuItemThree.addEventListener('click', function() {
            that.homeOut('c');
        });

        menu.appendChild(menuItemOne);
        menu.appendChild(menuItemTwo);
        menu.appendChild(menuItemThree);

        content.appendChild(menu);                                          // append menu
        this.store.contentPosition = content.getBoundingClientRect();       // store content position

        menuItems = [menuItemOne, menuItemTwo, menuItemThree];

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [1, 0], translateX: [0, '200px'] }, { duration: 400, easing: that.opts.easing, delay: i*100 } );
        }
    },

    homeOut: function(level) {
        var that = this,
            menuItems = document.querySelectorAll('.btn-menu'),
            menuItem,
            no;

        // change color
        this._changeColor(level);

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [0, 1], translateX: ['-200px', 0] }, { duration: 400, easing: that.opts.easing, delay: i*100,
                complete: function(elements) {
                    elements.forEach( function(item, index, array) {
                        if ( item === menuItems[menuItems.length - 1] ) {
                            that._createSentence(level, no);
                        }
                    } );
                }
            } );

        }
    },

    // we need a way to determine sentence number


    // remove creating new nodes from this function and move to seperate
    // comeIn should only change view, not create anythin

    comeIn: function() {
        var that = this,
            wrapper = this.store.wrapper,
            contentPosition = this.store.contentPosition,
            words = this.store.words,
            x = 400,
            wordPositionObj = [],
            storedClones = [],
            countStoredClones, countWordPositions, word, wordPosition, clone, pos, wrapperBackHeight,

            // new nodes
            clones = document.createElement('div'),
            wrapperBack = document.createElement('div');


        // prepare new nodes
        clones.className = 'clones';
        wrapperBack.className = 'wrapper-back';

        (function() {
            for (var i=0, len=words.length; i < len; i++) {
                word = words[i];
                wordPosition = word.getBoundingClientRect();
                wordPositionObj[i] = {
                    left: wordPosition.left - contentPosition.left,
                    top: wordPosition.top - contentPosition.top,
                    bottom: wordPosition.bottom,
                };

                countWordPositions = that.store.wordPositions.push(wordPositionObj);    // pre-store positions

                clone = word.cloneNode(true);
                clone.className = clone.className + " clone";

                Velocity.hook(clone, "translateX", wordPositionObj[i].left + x + "px");
                Velocity.hook(clone, "translateY", wordPositionObj[i].top + "px");

                clones.appendChild(clone);                          // append clones
                countStoredClones = storedClones.push(clone);       // pre-store clones
            }
        })();

        this.store.clones = storedClones;               // store clones
        this.store.wordPositions = wordPositionObj;     // store positions
        this.store.wrapperBack = wrapperBack;           // store background

        wrapper.parentNode.appendChild(clones);         // append clones
        wrapper.parentNode.appendChild(wrapperBack);    // append background

        // prepare wrapperBack
        this._checkBackSize();
        wrapperBackHeight = this.store.wrapperBackHeight;
        wrapperBack.style.height = wrapperBackHeight + "px";
        Velocity.hook(wrapperBack, 'translateY', -(wrapperBackHeight / 2) + "px");
        Velocity.hook(wrapperBack, 'scaleY', 0);

        Velocity(wrapperBack, { scaleY: [1, 0] }, {duration: 300, easing: that.opts.easing, queue: false});

        (function() {
            for (var i=0, len=words.length; i < len; i++) {
                Velocity(
                    storedClones[i],
                    { opacity: 1, translateX: [wordPositionObj[i].left, wordPositionObj[i].left + x]},
                    { duration: that.opts.duration, easing: that.opts.easing, delay: i*100 + 200, queue: false }
                );
            }
        })();

        this._newSortable();

        this._watchResize(true);
    },

    animate: function() {
        var that = this,
            words = this.store.words,
            clones = this.store.clones,
            contentPosition = this.store.contentPosition,
            wrapperBack = this.store.wrapperBack,
            wordPositionsOld = this.store.wordPositions,
            wrapper = this.store.wrapper,
            wordPositionsNew = [],
            len = words.length,
            wordPosition, lastChild, lastChildPosition, newPadding, count, animateClones, animateWrapperBack;

        (function() {
            for (var i=0; i < len; i++) {
                //words[i].style.paddingRight = '';   // reset padding;
            }
        })();

        (function() {
            for (var i=0; i < len; i++) {
                wordPosition = words[i].getBoundingClientRect();

                wordPositionsNew[i] = {
                    left: wordPosition.left - contentPosition.left,
                    top: wordPosition.top - contentPosition.top,
                    bottom: wordPosition.bottom - contentPosition.top,
                };
            }
        })();
        this.store.wordPositions = wordPositionsNew;    // store each word's position

        animateClones = this._debounce(function() {
            for (var i=0; i < len; i++) {
                Velocity( clones[i], {
                    translateX: [wordPositionsNew[i].left, wordPositionsOld[i].left],
                    translateY: [wordPositionsNew[i].top, wordPositionsOld[i].top],
                }, { duration: that.opts.duration, easing: that.opts.easing,
                     queue: false
                });
            }
        }, 10);

        animateClones();

        animateWrapperBack = this._debounce(function() {
            var changedWrapperBack = that._checkBackSize();
            if (changedWrapperBack) {
                var wrapperBackHeight = that.store.wrapperBackHeight;

                Velocity(wrapperBack, { height: wrapperBackHeight, translateY: -(wrapperBackHeight / 2) + "px" }, {duration: 300, easing: that.opts.easing, queue: false});
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
        var that = this,
            translation = document.querySelector(".translation"),
            spans = translation.querySelectorAll("span"),
            span;

        for (var i=0, len=spans.length; i < len; i++) {
            span = spans[i];
            Velocity( span, { opacity: [1, 0],  translateX: [0, '200px'] }, { duration: that.opts.duration, easing: that.opts.easing, delay: i*100 } );
        }

        this._removeFooter();
    },

    _showNextArr: function() {
        try {
            var that = this,
                nextArrWrap = document.createElement('div'),
                nextArr = document.createElement('button'),
                itemsOnBoard = this.store.itemsOnBoard;

            // prepare new node
            nextArrWrap.className = 'wrapper-next-arr';
            nextArr.className = 'next-arr';
            nextArr.id = 'next-arr';
            nextArr.type = 'button';
            nextArr.innerHTML = '&raquo';
            nextArrWrap.appendChild(nextArr);
            itemsOnBoard.appendChild(nextArrWrap);

            Velocity(nextArr, {scale: [1, 0]}, { duration: 400, easing: that.opts.easing});

        } catch(ex){}
    },

    _createSentence: function(level, no) {
        // maybe this logic should be inside _getSentence, while this method should only show the process?

        var no = 0; // for now, before we determine sentence no

        this._getSentence(level, no);

        var that = this,
            sentence = this.store.sentence, // sentence object
            s = sentence['s'],              // array of good answers
            b = sentence['b'];              // string - word you can't touch

        if (b === undefined) {          // if there are no restricted word
            b = false;
        }

        var content = this.store.content,
            // New nodes
            itemsOnBoard = document.createElement('div'),
            wrapper = document.createElement('div'),
            word = document.createElement('div'),
            wordInner = document.createElement('div'),
            spill, clone, items, wordsCount, spillCount;

        spill = s[0].concat();      // copy the first correct answer

        // Prepare nodes
        itemsOnBoard.id = 'items';
        itemsOnBoard.className = 'items items-on-board';
        wrapper.id = 'wrapper-items';
        word.className = 'btn-outer';
        wordInner.className = "btn-word";

        word.appendChild(wordInner);        // append inside the word

        // sort words randomly
        spill = spill.sort(function() { return 0.5 - Math.random(); });

        // Check if spill is not the same as correct answers

        ///////////////
        // TO NIE DZIAŁA........
        //////////////

        function checkSpill(spill) {
            var result = s.forEach(function(item, index, array) {
                if (spill === item) {
                    return false;
                }
            });
        }

        // sort once again while spill and answer are the same
        while (checkSpill(spill)) {
            spill = spill.sort(function() { return 0.5 - Math.random(); });
        }

        // Append words into the wrapper
        for (var i=0, len=spill.length; i < len; i++) {
            clone = word.cloneNode(true);
            clone.firstChild.innerHTML = spill[i];
            wrapper.appendChild(clone);

            // store words
            wordsCount = this.store.words.push(clone);
        }

        this.store.wrapper = wrapper;                   // store wrapper
        this.store.itemsOnBoard = itemsOnBoard;         // store items-on-board

        this._removeHome();                             // remove the menu
        itemsOnBoard.appendChild(wrapper);              // append wrapper
        content.appendChild(itemsOnBoard);              // append items-on-board
        this._createFooter();                           // create footer
        this._createTranslation(level, no);             // create translation

        this.comeIn();                                  // let the sentence in
    },

    _checkSentence: function() {
        // check if sentence is finished
        var that = this,
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
                that._finishedSentence();       // if the sentence is correct call the end
            }

        }, 200);

        checkSentence();

    },

    _finishedSentence: function() {
        this._destroySortable();
        this.showTrans();
        this._showNextArr();
    },

    _createTranslation: function() {
        var that = this,
            wrapperBack = this.store.wrapperBack,
            sentence = this.store.sentence,
            t = sentence['t'], // string - translation
            translation = document.createElement('p'),
            span;

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
        var that = this,
            content = this.store.content,
            footer = document.createElement('footer'),
            footerWrapper = document.createElement('div'),
            footerTips = document.createElement('button');

        footer.className = 'app-footer';
        footerWrapper.className = 'section-content section-1-1 group centered';
        footerWrapper.id = 'wrapper-buttons';
        footerTips.className = 'btn btn-translate';
        footerTips.appendChild( document.createTextNode('Tips') );
        footerTips.id = 'translate';
        footerTips.type = 'button';

        footerTips.addEventListener('click', function _fu() {
            that.showTrans();
            footerTips.removeEventListener('click', _fu, false);
        }, false);

        footerWrapper.appendChild(footerTips);
        footer.appendChild(footerWrapper);

        content.appendChild(footer);
    },

    _removeFooter: function() {
        var that = this,
            content = this.store.content,
            footer = document.querySelector('.app-footer'),
            translate = document.getElementById('translate');

        Velocity( translate, {opacity: 0, translateY: '1rem'}, {duration: that.opts.duration, easing: that.opts.easing, visibility: 'hidden',
            complete: function() {
                var removedFooter = content.removeChild(footer);
                removedFooter = null;
            }
        } );
    },

    _removeHome: function() {
        try {
            var content = this.store.content,
                menu = document.getElementById('menu-home'),
                menuCopy = menu.cloneNode(true),
                replacedMenu = content.replaceChild(menuCopy, menu),
                removedMenu = content.removeChild(menuCopy);
                replacedMenu =
                removedMenu = null;
        } catch (ex) {
            // if there is noe menu, do nothing
        }
    },

    _getSentence: function(level, no) {
        var sentence;

        if (level === 'a') {
            sentence = arrayA(no);
        } else if (level === 'b') {
            sentence = arrayB(no);
        } else if (level === 'c') {
            sentence = arrayC(no);
        } else {
            console.log('level not provided');
        }

        return this.store.sentence = sentence;
    },

    _getLevels: function() {
        // some way of geting percent of levels done to show on home
    },

    _changeColor: function(level) {
        try {
            var section = document.getElementById('section'),
                sectionClass = ' section-100';

            switch (level) {
                case 'a':
                    section.className = 'section-green' + sectionClass;
                    break;
                case 'b':
                    section.className = 'section-orange' + sectionClass;
                    break;
                case 'c' :
                    section.className = 'section-red' + sectionClass;
                    break;
                case 'menu':
                    section.className = 'section-dark' + sectionClass;
                    break;
            }

        } catch (ex){};
    },

    _toggleOpacity: function(el, op) {
        try {
            var pos = el.dataset.pos - 1,
                clone = this.store.clones[pos];
            Velocity.hook(clone, "opacity", op);
        } catch (ex){};
    },

    _checkBackSize: function() {
        try {
            var wordPositions = this.store.wordPositions,
                wrapperBack = this.store.wrapperBack,
                wrapperBackHeight = this.store.wrapperBackHeight,
                wordTops = [],
                wordBottoms = [],
                top, bottom, newHeight;

            for (var i=0, len=wordPositions.length; i < len; i++) {
                top = wordPositions[i].top;
                bottom = wordPositions[i].bottom;

                wordTops.push(top);
                wordBottoms.push(bottom);
            }

            wordTops.sort();
            wordBottoms.sort();

            newHeight = Math.floor( wordBottoms[wordBottoms.length -1] - wordTops[0] ) + 6;

            if (wrapperBackHeight !== newHeight) {
                this.store.wrapperBackHeight = newHeight;

                return true;                               // if the size changed, return true
            }


        } catch(ex) {};
    },

    _newSortable: function() {
        var wrapper = this.store.wrapper,
            that = this,
            sortable;

        if (wrapper) {
            sortable = new Sortable(wrapper, {
                animation: 0,

                // dragging started
                onStart: function (evt) {
                    that._toggleOpacity(evt.item, "0.5");
                },

                // dragging ended
                onEnd: function (evt) {
                    that._toggleOpacity(evt.item, "1");

                    that._checkSentence();
                },
            });

            this.store.sortable = sortable;
        }
    },

    _destroySortable: function() {
        var sortable = this.store.sortable;
        sortable.destroy();
    },


    _watchResize: function(state) {
        var resize
            that = this;
        if (state) {
            resize = that._debounce(function() {
                that.animate();
            }, 250);
            that.store.resize = resize;
            window.addEventListener('resize', resize, false);
        } else {
            resize = that.store.resize;
            window.removeEventListener('resize', resize, false);
        }
    },


    // Returns a function, that, as long as it continues to be invoked, will not
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


};

var sentence = new Sentence();


window.addEventListener('load', function() {

    sentence.homeIn(); // load the menu

}, false );



