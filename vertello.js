(function($) {

    var methods = {
        init : function(options) {
            //merge options
            var opts = $.extend({
                // These are the defaults.
                startPos:      1,
                elemClass:     'vert-step-elem',
                prevClass:     'step-nav-prev',
                nextClass:     'step-nav-next',
                form:          false,
                validRules:    {},
                afterInit:     function() {},
                beforeAnimate: function() {},
                afterAnimate:  function() {},
                finish:        function() {}
            }, options);

            return this.each(function() {
                var wrapper    = $(this),
                    validation = (opts.form) ? opts.form.validate(opts.validRules) : false;

                /**
                 * save data
                 */
                opts.currClass  = 'vert-step-current';
                opts.firstClass = 'vert-step-first';
                opts.lastClass  = 'vert-step-last';
                opts.noActClass = 'vert-non-active';
                opts.finClass   = 'vert-fin';
                opts.step       = $('.' + opts.elemClass, wrapper);
                opts.nav        = $('.step-nav', wrapper);

                $(this).data('vertello', opts);

                /**
                 * get current step jquery object
                 *
                 * @returns {*|HTMLElement}
                 */
                function getCurrObj() {
                    return $('.' + opts.currClass);
                }

                /**
                 * set current number
                 */
                function setCurrNum() {
                    $('.step-num-curr', wrapper).html(parseInt(getCurrObj().attr('data-num')));
                }

                /**
                 * set manage classes to navigation items
                 */
                function setNavClasses() {
                    var currAfterSlide = getCurrObj();

                    opts.nav.removeClass([opts.noActClass, opts.finClass].join(' '));

                    if (currAfterSlide.hasClass(opts.firstClass)) {
                        opts.nav.filter('.' + opts.prevClass).addClass(opts.noActClass);
                    } else if (currAfterSlide.hasClass(opts.lastClass)) {
                        opts.nav.filter('.' + opts.nextClass).addClass(opts.finClass);
                    }
                }

                /**
                 * vertical animation
                 *
                 * @param way
                 */
                function vertAnimate(way) {
                    var currOnStart = getCurrObj();

                    //before animate callback
                    if (opts.beforeAnimate && typeof opts.beforeAnimate == "function") {
                        opts.beforeAnimate(currOnStart);
                    }

                    currOnStart.slideToggle();

                    if ('prev' === way) {
                        currOnStart.prev().slideToggle().toggleClass(opts.currClass);
                        setNavClasses();
                    } else if ('next' === way) {
                        var formElem   = $('.vsv', currOnStart),
                            formElemId = '#' + formElem.attr('id');

                        //if no validation or validation enabled and current element is valid
                        if (!validation || ((formElem.length > 0) && (validation.element(formElemId)))) {
                            currOnStart.next().slideToggle().toggleClass(opts.currClass);
                            setNavClasses();
                        }
                    }

                    currOnStart.toggleClass(opts.currClass);
                    setCurrNum();

                    //after animate callback
                    if (opts.afterAnimate && typeof opts.afterAnimate == "function") {
                        var currOnFin = getCurrObj();

                        opts.afterAnimate(currOnFin);
                    }
                }

                /**
                 * init steps
                 */
                opts.step.hide();
                opts.step.removeClass([opts.currClass, opts.firstClass, opts.lastClass].join(' '));
                opts.step.first().addClass(opts.firstClass);
                opts.step.last().addClass(opts.lastClass);

                //add numbers and show starting step
                opts.step.each(function(index) {
                    var curr = $(this),
                        numb = index + 1;

                    curr.attr('data-num', numb);

                    if (numb === opts.startPos) curr.addClass(opts.currClass).show();
                });

                //display numbers
                $('.step-num-qty', wrapper).html(opts.step.length);
                setCurrNum();

                //bind navigation click
                opts.nav.bind('click.vertello', function(event) {
                    if (!$(this).hasClass(opts.noActClass) && !$(this).hasClass(opts.finClass)) {
                        event.stopPropagation();
                        event.preventDefault();

                        if ($(this).hasClass(opts.prevClass)) {
                            vertAnimate('prev');
                        } else if ($(this).hasClass(opts.nextClass)) {
                            vertAnimate('next');
                        }
                    } else if ($(this).hasClass(opts.finClass)) {
                        //finish callback
                        if (opts.finish && typeof opts.finish == "function") {
                            opts.finish();
                        }
                    }
                });

                //init navigation classes
                setNavClasses();

                /**
                 * after steps init callback
                 */
                if (opts.afterInit && typeof opts.afterInit == "function") {
                    opts.afterInit();
                }
            });
        },
        destroy : function(options) {
            //merge options
            var settings = $.extend({
                afterDestroy: function() {},
            }, options);

            return this.each(function() {
                var $this   = $(this),
                    opts    = $this.data('vertello'),
                    classes = [
                        opts.currClass,
                        opts.firstClass,
                        opts.lastClass,
                        opts.noActClass,
                        opts.finClass
                    ];

                //remove classes
                opts.step.removeClass(classes.join(' '));

                //unbind nav click event
                opts.nav.unbind('.vertello');

                //remove data
                $this.removeData('vertello');

                /**
                 * after destroy callback
                 */
                if (settings.afterDestroy && typeof settings.afterDestroy == "function") {
                    settings.afterDestroy();
                }
            })
        }
    };

    $.fn.vertello = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('jQuery Vertello doesn\'t know method ' +  method);
        }
    };

}(jQuery));
