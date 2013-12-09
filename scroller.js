/**
 * Exports class for scrolling elements
 *
 * @module scroller
 * @author Andrew Malozemoff
 */
(function(name, context, definition) { 
    if(typeof module !== 'undefined' && module.exports) module.exports = definition(); 
    else if(typeof define === 'function' && define.amd) define(definition); 
    else context[name] = definition(); 
})('Scroller', this, function() {
    // custom event listener to support IE
    var listeners = [],
        addListener,
        removeListener;

    if(Element.prototype.addEventListener) {
        addListener = function(el, handler) {
            el.addEventListener("scroll", handler);
            listeners.push({
                handler: handler
            });
        };
        removeListener = function(el, handler) {
            if(handler) {
                el.removeEventListener("scroll", handler);
            } else {
                for(var i = 0, l = listeners.length; i < l; i++) {
                    var listener = l[i];
                    el.removeEventListener("scroll", listener.handler);
                }
            }
        };
    } else {
        addListener = function(el, handler) {
            function wrapper(e) {
                e.target = e.srcElement;
                e.currentTarget = el;
                handler.call(el, e);
            }
            el.attachEvent("onscroll", wrapper);
            listeners.push({
                handler: handler,
                wrapper: wrapper
            });
        };
        removeListener = function(el, handler) {
            if(!handler) {
                while(listeners.length) {
                    var listener = listeners.pop();
                    this.detachEvent("onscroll", listener.wrapper);
                }
            } else {
                for(var i = 0, l = listeners.length; i < l; i++) {
                    var listener = listeners[i];
                    if(listener.handler == handler) {
                        this.detachEvent("onscroll", listener.wrapper);
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        };
    }

    /**
     * Class for handling and reporting scroll events for elements
     *
     * @class Scroller
     * @constructor
     * @param {element} e Element to handle
     */
    function Scroller(e) {
        this.el = e;
        this._x = Scroller.scroll.x(e);
        this._y = Scroller.scroll.y(e);
        this._xdir = 0;
        this._ydir = 0;
        this.capturing = false;
    }

    /**
     * Static scroll functions
     * @property scroll
     * @type Object
     * @static
     */
    Scroller.scroll = {
        /**
         * Get or set X scroll of element
         * @property scroll.x
         * @type Function
         * @static
         * @param {Element} [e] Element to query, window if null
         * @param {Number} [px] Pixels to scroll
         * @return {Number} X scroll value of element or window
         */
        x: function(e, px) {
            if(!arguments.length) {
                // get window scroll
                return window.scrollX !== undefined ? window.scrollX :
                    (window.pageXOffset !== undefined) ? window.pageXOffset :
                        (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            }

            if(typeof e == 'number') {
                var tmp = e;
                e = px;
                px = tmp;
            }

            if(e === undefined) e = window;
            if(px === undefined) {
                if(e === window) {
                    return Scroller.scroll.x();
                } else {
                    return e.scrollLeft;
                }
            } else {
                if(e === window) {
                    window.scrollTo(px, Scroller.scroll.y());
                } else {
                    e.scrollLeft = px;
                }
            }
        },

        /**
         * Get or set Y scroll of element
         * @property scroll.y
         * @type Function
         * @static
         * @param {Element} [e] Element to query, window if null
         * @param {Number} [px] Pixels to scroll
         * @return {Number} Y scroll value of element or window
         */
        y: function(e, px) {
            if(!arguments.length) {
                return window.scrollY !== undefined ? window.scrollY :
                    (window.pageYOffset !== undefined) ? window.pageYOffset :
                        (document.documentElement || document.body.parentNode || document.body).scrollTop;
            }

            if(typeof e == 'number') {
                var tmp = e;
                e = px;
                px = tmp;
            }

            if(e === undefined) e = window;
            if(px === undefined) {
                if(e === window) {
                    return Scroller.scroll.y();
                } else {
                    return e.scrollTop;
                }
            } else {
                if(e === window) {
                    window.scrollTo(Scroller.scroll.x(), px);
                } else {
                    e.scrollTop = px;
                }
            }
        }
    };

    Scroller.prototype = {
        /**
         * Capture scroll events on element
         * @method capture
         * @chainable
         * @param {Function} callback Function to call on scroll event. Passes
         * element, x scroll, y scroll, x direction and y direction as arguments
         */
        capture: function(callback) {
            var that = this;
            var el = this.el;
            var x = Scroller.scroll.x;
            var y = Scroller.scroll.y;
            this._x = x(el);
            this._y = y(el);

            addListener(this.el, function() {
                var oldx = that.x;
                var oldy = that.y;
                that._x = x(el);
                that._y = y(el);
                that._xdir = that._x > oldx ? 1 : that._x < oldx ? -1 : 0;
                that._ydir = that._y > oldy ? 1 : that._y < oldy ? -1 : 0;
                callback(el, that._x, that._y, that._xdir, that._ydir);
            });

            this.capturing = true;
            return this;
        },

        /**
         * Release scroll events on element
         * @method release
         * @chainable
         */
        release: function() {
            if(this.capturing) removeListener(this.el);
            this.capturing = false;
            return this;
        },

        /**
         * Set or report x scroll of element
         * @method x
         * @chainable
         * @param {Number} [px] X scroll
         * @return {Number} X scroll
         */
        x: function(px) {
            if(typeof px == "number") {
                Scroller.scroll.x(this.el, px);
                return this;
            } else {
                return Scroller.scroll.x(this.el);
            }
        },

        /**
         * Set or report y scroll of element
         * @method y
         * @chainable
         * @param {Number} [px] Y scroll
         * @return {Number} Y scroll
         */
        y: function(px) {
            if(typeof px == "number") {
                Scroller.scroll.y(this.el, px);
                return this;
            } else {
                return Scroller.scroll.y(this.el);
            }
        },

        /**
         * Get X direction
         * @method xdir
         * @chainable
         * @return {Number} X direction
         */
        xdir: function() {
            return this._xdir;
        },

        /**
         * Get Y direction
         * @method ydir
         * @chainable
         * @return {Number} Y direction
         */
        ydir: function() {
            return this._ydir;
        }
    };

    return Scroller;
});
