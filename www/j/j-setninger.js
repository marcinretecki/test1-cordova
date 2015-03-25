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



*/



function Sentence() {

    // here are stored all strange things
    this.store = {
        content: document.getElementById('content'),    // main div
        words:   [],                                    // stored words for reference
        clones:  [],                                    // stored clones for reference
        wordPositions:  [],                             // stored positions for reference
    };

}

/*
- pamiętaj, żeby wszystkie event listeners przenieść na document itd.... (to ważne)
*/

Sentence.prototype = {

    constructor: Sentence,

    homeIn: function() {
        var that = this,
            menu = document.createElement('div'),
            menuItemClass = "btn-menu btn-menu-hidden",
            menuItemOne = document.createElement('button'),
            menuItemTwo = menuItemOne.cloneNode(true),
            menuItemThree = menuItemOne.cloneNode(true),
            menuItems,
            menuItem;

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

        this.store.content.appendChild(menu);

        menuItems = [menuItemOne, menuItemTwo, menuItemThree];

        for (var i=0, len=menuItems.length; i < len; i++) {
            menuItem = menuItems[i];
            Velocity( menuItem, { opacity: [1, 0], translateX: [0, '200px'] }, { duration: 400, easing: [0.645,0.045,0.355,1], delay: i*100 } );
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
            Velocity( menuItem, { opacity: [0, 1], translateX: ['-200px', 0] }, { duration: 400, easing: [0.645,0.045,0.355,1], delay: i*100,
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

    comeIn: function() {
        var that = this,
            wrapper = document.getElementById('wrapper-items'),
            wrapperPosition = wrapper.getBoundingClientRect(),
            words = this.store.words,
            clones = document.createElement('div'),
            x = 400,
            word,
            wordPosition,
            clone,
            pos,
            countStoredClones,
            wordPositionObj = [];

        this.store.wrapperPosition = wrapperPosition;

        for (var i=0, len=words.length; i < len; i++) {
            word = words[i];
            wordPosition = word.getBoundingClientRect();
            wordPositionObj[i] = {
                left: wordPosition.left - wrapperPosition.left,
                top: wordPosition.top - wrapperPosition.top,
            };

            var count = this.store.wordPositions.push(wordPositionObj);

            clone = word.cloneNode(true);
            clone.className = clone.className + " clone";

            word.setAttribute('data-pos', i + 1);

            Velocity.hook(clone, "left", wordPositionObj[i].left + x + "px");
            Velocity.hook(clone, "top", wordPositionObj[i].top + "px");

            clones.appendChild(clone);

            // store clones
            countStoredClones = this.store.clones.push(clone);
        }

        this.store.wordPositions = wordPositionObj;

        clones.className = 'clones';
        wrapper.parentNode.appendChild(clones);

        cloned_node = clones.firstChild;

        function hook(i) {
            setTimeout(function(){
                word = words[i];

                pos = word.getAttribute('data-pos') - 1;
                clone = clones.querySelectorAll('.clone')[pos];
                Velocity.hook(clone, "left", wordPositionObj[i].left + "px");
                Velocity.hook(clone, "opacity", 1);
            }, 100*i);
         }

        for (var i=0, len=words.length; i < len; i++) {
            hook(i);
        }


        this._newSortable();
    },

    showTrans: function() {
        var translation = document.querySelector(".translation"),
            spans = translation.querySelectorAll("span"),
            span;

        for (var i=0, len=spans.length; i < len; i++) {
            span = spans[i];
            Velocity( span, { opacity: [1, 0],  translateX: [0, '200px'] }, { duration: 200, easing: [0.645,0.045,0.355,1], delay: i*100 } );
        }

        this._removeFooter();
    },

    animate: function() {

        /*  - bierzemy wszystkie słowa i obliczamy ich nowe miejsce
            - robimy animację między starym a nowym miejscem
            - zapisujemy nowe miejsce
        */

        var words = this.store.words,
            clones = this.store.clones,
            clonesPositions = this.store.clonesPositions,
            wordPositionsOld = this.store.wordPositions,
            wrapperPosition = this.store.wrapperPosition,
            wordPositionsNew = [],
            wordPosition,
            count;

        for (var i=0, len=words.length; i < len; i++) {
            wordPosition = words[i].getBoundingClientRect();

            wordPositionsNew[i] = {
                left: wordPosition.left - wrapperPosition.left,
                top: wordPosition.top - wrapperPosition.top,
            };
        }

        for (var i=0, len=words.length; i < len; i++) {
            Velocity.hook(clones[i], "left", wordPositionsNew[i].left + "px");
            Velocity.hook(clones[i], "top", wordPositionsNew[i].top + "px");
        }
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

        // New nodes
        var wrapper = document.createElement('div'),
            word = document.createElement('div'),
            wordInner = document.createElement('div'),
            spill, clone, items;

        // Prepare nodes
        wrapper.id = 'wrapper-items';
        word.className = 'btn-outer';
        wordInner.className = "btn-word";
        word.appendChild(wordInner);

        // sort words randomly
        spill = s['0'].sort(function() { return 0.5 - Math.random(); });

        // Check if spill is not the same as correct answers
        function checkSpill(spill) {
            var result = s.forEach(function(item, index, array) {
                if (spill === item) {
                    return false;
                }
            });
        }

        // sort once again while true
        while (checkSpill(spill)) {
            spill = s['0'].sort(function() { return 0.5 - Math.random(); });
        }

        // Append words into the wrapper
        for (var i=0, len=spill.length; i < len; i++) {
            clone = word.cloneNode(true);
            clone.firstChild.innerHTML = spill[i];
            wrapper.appendChild(clone);

            // store words
            var count = this.store.words.push(clone);
        }

        this._removeHome();                             // remove the menu
        items = this._createItemsWrapper();             // create and return items wrapper
        items.insertBefore(wrapper, items.firstChild);  // append the wrapper
        this._createFooter();                           // create footer
        this._createTranslation(level, no);             // create translation
        this.comeIn();                                  // let the sentence in
    },

    _finishedSentence: function() {
        // when the user finishes the
    },

    _createTranslation: function() {
        var that = this,
            content = this.store.content,
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

        content.appendChild(translation);
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
        var content = this.store.content,
            footer = document.querySelector('.app-footer'),
            translate = document.getElementById('translate');

        Velocity( translate, {opacity: 0, translateY: '1rem'}, {duration: 200, easing: [0.645,0.045,0.355,1], visibility: 'hidden',
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
                classSection100 = ' section-100';

            switch (level) {
                case 'a':
                    section.className = 'section-green' + classSection100;
                    break;
                case 'b':
                    section.className = 'section-orange' + classSection100;
                    break;
                case 'c' :
                    section.className = 'section-red' + classSection100;
                    break;
                case 'menu':
                    section.className = 'section-dark' + classSection100;
                    break;
            }

        } catch (ex){};
    },

    _createItemsWrapper: function() {
        var content = this.store.content,
            items = document.createElement('div');

        items.className = 'items items-on-board';
        items.id = 'items';
        content.appendChild(items);

        return items;
    },

    _getWrapper: function() {
        try {
            var wrapper = document.getElementById('wrapper-items');
            return wrapper;
        } catch (ex) {}
    },

    _newSortable: function() {
        var wrapper = this._getWrapper(),
            that = this,
            sortable = new Sortable(wrapper, {
                animation: 0,

                // Called by any change to the list (add / update / remove)
                onEnd: function (evt) {
                    var itemEl = evt.item,        // dragged HTMLElement
                        oldIndex = evt.oldIndex,  // element's old index within parent
                        newIndex = evt.newIndex;  // element's new index within parent
                },
            });

        this.store.sortable = sortable;
    },

    _destroySortable: function() {
        var sortable = this.store.sortable;
        sortable.destroy();
    },

    _velocity: function () {
        var wrapper = document.querySelector('#items'),
            wrapper_position = wrapper.getBoundingClientRect(),
            words = wrapper.querySelectorAll('.btn-word'),
            clones = wrapper.parentNode.querySelector('.clones').querySelectorAll('.clone'),
            word,
            word_position,
            clone,
            pos;

        for (var i=0, len=words.length; i < len; i++) {
            word = words[i];
            word_position = word.getBoundingClientRect();

            pos = word.getAttribute('data-pos') - 1;
            clone = clones[pos];

            //Velocity.hook(clone, "translateX", word_position.left - wrapper_position.left - 10 + "px");
            //Velocity.hook(clone, "translateY", word_position.top - wrapper_position.top - 10 + "px");

            // wyciągnij to z loopa!

            Velocity(
                clone,
                {
                    translateX: word_position.left - wrapper_position.left - 10 + "px",
                    translateY: word_position.top - wrapper_position.top - 10 + "px",
                },
                { duration: 200, easing: [0.645,0.045,0.355,1] }
            );

        }

    },

};

var sentence = new Sentence();


window.addEventListener('load', function() {

    sentence.homeIn(); // load the menu

}, false );



