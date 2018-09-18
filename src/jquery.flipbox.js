(function($) {
    'use strict';

    var namespace = 'jquery-flipbox';

    function FlipBox($element, options) {
        options = options || {};
        this.$element = $element;

        this.rotation = 0;
        this.contents = this.$element.children().detach().map(function() {
            return this
        });
        this.contentIndex = Math.min(Math.max(options.index, 0), this.contents.length - 1) || 0;

        this.config(options);
        this.create();
    }

    FlipBox.prototype.config = function(options) {
        options = options || {};

        if (this.options) {
            delete options.vertical;
            delete options.width;
            delete options.height;
        }

        this.options = $.extend({
            vertical: false,
            width: this.$element.width(),
            height: this.$element.height(),
            animationDuration: 400,
            animationEasing: 'ease',
            autoplay: false,
            autoplayReverse: false,
            autoplayWaitDuration: 3000,
            autoplayPauseOnHover: false
        }, this.options, options);
    };

    FlipBox.prototype.create = function() {
        var _this = this;
        this.$element.addClass('flipbox-wrapper');

        this.$box = $('<div></div>')
            .addClass('flipbox-box')
            .css('transition-duration', (this.options.animationDuration || 0) + 'ms')
            .css('transition-timing-function', this.options.animationEasing)
            .appendTo(this.$element);

        this.$front = $('<div></div>').addClass('flipbox-side flipbox-front').appendTo(this.$box);
        this.$back = $('<div></div>').addClass('flipbox-side flipbox-back').appendTo(this.$box);

        if (this.options.vertical) {
            this.$box.addClass('flipbox-vertical');
            this.$top = $('<div></div>').addClass('flipbox-side flipbox-top').appendTo(this.$box);
            this.$bottom = $('<div></div>').addClass('flipbox-side flipbox-bottom').appendTo(this.$box);
        } else {
            this.$box.addClass('flipbox-horizontal');
            this.$left = $('<div></div>').addClass('flipbox-side flipbox-left').appendTo(this.$box);
            this.$right = $('<div></div>').addClass('flipbox-side flipbox-right').appendTo(this.$box);
        }

        this.$front.append(this.contents[this.contentIndex]);

        if (this.options.autoplay && this.options.autoplayPauseOnHover) {
            this.$element.on('mouseenter.' + namespace, function() {
                _this.toggleAutoplay(false);
            }).on('mouseleave.' + namespace, function() {
                _this.toggleAutoplay(true);
            });
        }

        this.resize();
        this.toggleAutoplay(this.options.autoplay);

        $(window).on('focus.' + namespace, function() {
            _this.toggleAutoplay(_this.options.autoplay);
        });
        $(window).on('blur.' + namespace, function() {
            _this.toggleAutoplay(false);
        });

        this.trigger('created');
    };

    FlipBox.prototype.update = function() {
        this.$box
            .css('transition-duration', (this.options.animationDuration || 0) + 'ms')
            .css('transition-timing-function', this.options.animationEasing);

        this.$element.off('mouseenter.' + namespace + ' mouseleave.' + namespace);
        if (this.options.autoplay && this.options.autoplayPauseOnHover) {
            var _this = this;
            this.$element.on('mouseenter.' + namespace, function() {
                _this.toggleAutoplay(false);
            }).on('mouseleave.' + namespace, function() {
                _this.toggleAutoplay(true);
            });
        }

        this.resize();
        this.toggleAutoplay(this.options.autoplay);

        this.trigger('updated');
    };

    FlipBox.prototype.destroy = function() {
        $(window).off('focus.' + namespace + ' blur.' + namespace);
        this.$element.off('mouseenter.' + namespace + ' mouseleave.' + namespace);
        this.$element.removeClass('flipbox-wrapper');
        this.$element.empty();
        this.$element.append(this.contents);

        this.trigger('destroyed');
    };

    FlipBox.prototype.resize = function() {
        if (this.options.vertical) {
            this.$box.css('transform-origin', '0 ' + (this.options.height / 2) + 'px -' + (this.options.height / 2) + 'px');
            this.$back.css('transform', 'translateZ(-' + this.options.height + 'px) rotateX(180deg)');
            this.$top.css('transform', 'rotateX(-270deg) translateY(-' + this.options.height + 'px)');
            this.$bottom.css('transform', 'rotateX(-90deg) translateY(' + this.options.height + 'px)');
        } else {
            this.$box.css('transform-origin', (this.options.width / 2) + 'px 0 -' + (this.options.width / 2) + 'px');
            this.$back.css('transform', 'translateZ(-' + this.options.width + 'px) rotateY(180deg)');
            this.$left.css('transform', 'rotateY(270deg) translateX(-' + this.options.width + 'px)');
            this.$right.css('transform', 'rotateY(-270deg) translateX(' + this.options.width + 'px)');
        }
    };

    FlipBox.prototype.displayContent = function(contentIndex, reverse) {
        if (this.contentIndex !== contentIndex) {
            var $side = this.getNextSide(reverse);
            $side.find('>').detach();
            $side.append(this.contents[contentIndex]);
            var prevIndex = this.contentIndex;
            this.contentIndex = contentIndex;
            this.flip(reverse, prevIndex, contentIndex);
        }
    };

    FlipBox.prototype.refreshCurrentContent = function() {
        var $side = this.getCurrentSide();
        $side.find('>').detach();
        $side.append(this.contents[this.contentIndex]);
    };

    FlipBox.prototype.addContent = function(newContent, contentIndex) {
        contentIndex = contentIndex || contentIndex === 0 ? contentIndex : this.contents.length;
        contentIndex = Math.min(Math.max(0, contentIndex), this.contents.length);

        this.contents.splice(contentIndex, 0, $(newContent)[0]);

        this.contentIndex = Math.max(this.contentIndex, 0);
        if (this.contentIndex === contentIndex) {
            this.refreshCurrentContent();
        }

        this.trigger('added', {
            index: contentIndex
        });
    };

    FlipBox.prototype.removeContent = function(contentIndex) {
        contentIndex = Math.min(Math.max(0, contentIndex), this.contents.length);

        this.contents.splice(contentIndex, 1);

        if (this.contentIndex === contentIndex) {
            this.contentIndex = Math.min(this.contentIndex, this.contents.length - 1);
            this.refreshCurrentContent();
        }

        this.trigger('removed', {
            index: contentIndex
        });
    };

    FlipBox.prototype.replaceContent = function(newContent, contentIndex) {
        contentIndex = contentIndex || contentIndex === 0 ? contentIndex : this.contentIndex;
        contentIndex = Math.min(Math.max(0, contentIndex), this.contents.length);

        this.contents[contentIndex] = $(newContent)[0];

        if (this.contentIndex === contentIndex) {
            this.refreshCurrentContent();
        }

        this.trigger('replaced', {
            index: contentIndex
        });
    };

    FlipBox.prototype.flip = function(reverse, fromIndex, toIndex) {
        var _this = this;

        this.trigger('flipping', {
            reverse: reverse,
            currentIndex: fromIndex,
            nextIndex: toIndex
        });

        this.$box
            .off('transitionend.' + namespace)
            .one('transitionend.' + namespace, function() {
                _this.trigger('flipped', {
                    reverse: reverse,
                    prevIndex: fromIndex,
                    currentIndex: toIndex
                });
            });

        if (this.options.vertical) {
            this.rotation += 90 * (reverse ? -1 : 1);
            this.$box.css('transform', 'rotateX(' + this.rotation + 'deg)');
        } else {
            this.rotation -= 90 * (reverse ? -1 : 1);
            this.$box.css('transform', 'rotateY(' + this.rotation + 'deg)');
        }
    };

    FlipBox.prototype.getCurrentSide = function() {
        var current = (this.rotation / 90) % 4;
        current = current < 0 ? 4 + current :  current;
        if (this.options.vertical) {
            if (current === 0) {
                return this.$front;
            } else if (current === 1) {
                return this.$bottom;
            } else if (current === 2) {
                return this.$back;
            } else {
                return this.$top;
            }
        } else {
            if (current === 0) {
                return this.$front;
            } else if (current === 1) {
                return this.$left;
            } else if (current === 2) {
                return this.$back;
            } else {
                return this.$right;
            }
        }
    };

    FlipBox.prototype.getNextSide = function(reverse) {
        var current = (this.rotation / 90) % 4;
        current = current < 0 ? 4 + current :  current;
        if (this.options.vertical) {
            if (current === 0) {
                return reverse ? this.$top : this.$bottom;
            } else if (current === 1) {
                return reverse ? this.$front : this.$back;
            } else if (current === 2) {
                return reverse ? this.$bottom : this.$top;
            } else {
                return reverse ? this.$back : this.$front;
            }
        } else {
            if (current === 0) {
                return reverse ? this.$left : this.$right;
            } else if (current === 1) {
                return reverse ? this.$back : this.$front;
            } else if (current === 2) {
                return reverse ? this.$right : this.$left;
            } else {
                return reverse ? this.$front : this.$back;
            }
        }
    };

    FlipBox.prototype.toggleAutoplay = function(autoplay) {
        clearInterval(this.autoplayTimer);
        if (autoplay) {
            var _this = this;
            this.autoplayTimer = setInterval(function() {
                _this.next(_this.options.autoplayReverse);
            }, this.options.autoplayWaitDuration);
        }
    };

    FlipBox.prototype.next = function(reverse) {
        this.displayContent(this.contentIndex + 1 < this.contents.length ? this.contentIndex + 1 : 0, reverse);
    };

    FlipBox.prototype.prev = function(reverse) {
        this.displayContent(this.contentIndex > 0 ? this.contentIndex - 1 : this.contents.length - 1, reverse);
    };

    FlipBox.prototype.jump = function(index, reverse) {
        this.displayContent(Math.min(Math.max(index, 0), this.contents.length - 1), reverse);
    };

    FlipBox.prototype.trigger = function(name, data) {
        this.$element.trigger(name, data);
    };

    $.fn.flipbox = function(options) {
        var args = arguments;
        if (options === 'size') {
            return $(this).data(namespace).contents.length;
        } else if (options === 'current') {
            return $(this).data(namespace).contentIndex;
        } else {
            return this.each(function() {
                var $element = $(this);
                var flipbox = $element.data(namespace);

                if (options === 'destroy') {
                    flipbox.destroy();
                    $element.data(namespace, null);
                } else if (options === 'next') {
                    flipbox.next(args[1]);
                } else if (options === 'prev') {
                    flipbox.prev(args[1]);
                } else if (options === 'jump') {
                    flipbox.jump(args[1], args[2]);
                } else if (options === 'add') {
                    flipbox.addContent(args[1], args[2]);
                } else if (options === 'remove') {
                    flipbox.removeContent(args[1]);
                } else if (options === 'replace') {
                    flipbox.replaceContent(args[1], args[2]);
                } else {
                    if (!flipbox) {
                        flipbox = new FlipBox($element, options);
                        $element.data(namespace, flipbox);
                    } else {
                        flipbox.config(options);
                        flipbox.update();
                    }
                }
            });
        }
    };

})(jQuery);
