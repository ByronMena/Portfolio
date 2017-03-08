/*
 * SimpleModal 1.4.1 - jQuery Plugin
 * http://www.ericmmartin.com/projects/simplemodal/
 * Copyright (c) 2010 Eric Martin (http://twitter.com/ericmmartin)
 * Dual licensed under the MIT and GPL licenses
 * Revision: $Id: jquery.simplemodal.js 261 2010-11-05 21:16:20Z emartin24 $
 */
(function (d) {
    var k = d.browser.msie && parseInt(d.browser.version) === 6 && typeof window.XMLHttpRequest !== "object",
        m = d.browser.msie && parseInt(d.browser.version) === 7,
        l = null,
        f = [];
    d.modal = function (a, b) {
        return d.modal.impl.init(a, b)
    };
    d.modal.close = function () {
        d.modal.impl.close()
    };
    d.modal.focus = function (a) {
        d.modal.impl.focus(a)
    };
    d.modal.setContainerDimensions = function () {
        d.modal.impl.setContainerDimensions()
    };
    d.modal.setPosition = function () {
        d.modal.impl.setPosition()
    };
    d.modal.update = function (a, b) {
        d.modal.impl.update(a, b)
    };
    d.fn.modal = function (a) {
        return d.modal.impl.init(this, a)
    };
    d.modal.defaults = {
        appendTo: "body",
        focus: true,
        opacity: 50,
        overlayId: "simplemodal-overlay",
        overlayCss: {},
        containerId: "simplemodal-container",
        containerCss: {},
        dataId: "simplemodal-data",
        dataCss: {},
        minHeight: null,
        minWidth: null,
        maxHeight: null,
        maxWidth: null,
        autoResize: true,
        //Originally set to False, this options will resize if user decide to change resolution
        autoPosition: true,
        zIndex: 1E3,
        close: true,
        closeHTML: '<a class="modalCloseImg" title="Close" alt="Close"></a>',
        closeClass: "simplemodal-close",
        escClose: true,
        overlayClose: false,
        position: null,
        persist: false,
        //Originally set to False, This will make the browser forget the setting set by popup modal everytime it is called. to avoid this set to true.
        modal: true,
        onOpen: null,
        onShow: null,
        onClose: null
    };
    d.modal.impl = {
        d: {},
        init: function (a, b) {
            var c = this;
            if (c.d.data) return false;
            l = d.browser.msie && !d.boxModel;
            c.o = d.extend({}, d.modal.defaults, b);
            c.zIndex = c.o.zIndex;
            c.occb = false;
            if (typeof a === "object") {
                a = a instanceof jQuery ? a : d(a);
                c.d.placeholder = false;
                if (a.parent().parent().size() > 0) {
                    a.before(d("<span></span>").attr("id", "simplemodal-placeholder").css({
                        display: "none"
                    }));
                    c.d.placeholder = true;
                    c.display = a.css("display");
                    if (!c.o.persist) c.d.orig = a.clone(true)
                }
            } else if (typeof a === "string" || typeof a === "number") a = d("<div></div>").html(a);
            else {
                alert("SimpleModal Error: Unsupported data type: " + typeof a);
                return c
            }
            c.create(a);
            c.open();
            d.isFunction(c.o.onShow) && c.o.onShow.apply(c, [c.d]);
            return c
        },
        create: function (a) {
            var b = this;
            f = b.getDimensions();
            if (b.o.modal && k) b.d.iframe = d('<iframe src="javascript:false;"></iframe>').css(d.extend(b.o.iframeCss, {
                display: "none",
                opacity: 0,
                position: "fixed",
                height: f[0],
                width: f[1],
                zIndex: b.o.zIndex,
                top: 0,
                left: 0
            })).appendTo(b.o.appendTo);
            b.d.overlay = d("<div></div>").attr("id", b.o.overlayId).addClass("simplemodal-overlay").css(d.extend(b.o.overlayCss, {
                display: "none",
                opacity: b.o.opacity / 100,
                height: b.o.modal ? f[0] : 0,
                width: b.o.modal ? f[1] : 0,
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: b.o.zIndex + 1
            })).appendTo(b.o.appendTo);
            b.d.container = d("<div></div>").attr("id", b.o.containerId).addClass("simplemodal-container").css(d.extend(b.o.containerCss, {
                display: "none",
                position: "fixed",
                zIndex: b.o.zIndex + 2
            })).append(b.o.close && b.o.closeHTML ? d(b.o.closeHTML).addClass(b.o.closeClass) : "").appendTo(b.o.appendTo);
            b.d.wrap = d("<div></div>").attr("tabIndex", -1).addClass("simplemodal-wrap").css({
                height: "100%",
                outline: 0,
                width: "100%"
            }).appendTo(b.d.container);
            b.d.data = a.attr("id", a.attr("id") || b.o.dataId).addClass("simplemodal-data").css(d.extend(b.o.dataCss, {
                display: "none"
            })).appendTo("body");
            b.setContainerDimensions();
            b.d.data.appendTo(b.d.wrap);
            if (k || l) b.fixIE()
        },
        bindEvents: function () {
            var a = this;
            d("." + a.o.closeClass).bind("click.simplemodal", function (b) {
                b.preventDefault();
                a.close()
            });
            a.o.modal && a.o.close && a.o.overlayClose && a.d.overlay.bind("click.simplemodal", function (b) {
                b.preventDefault();
                a.close()
            });
            d(document).bind("keydown.simplemodal", function (b) {
                if (a.o.modal && b.keyCode === 9) a.watchTab(b);
                else if (a.o.close && a.o.escClose && b.keyCode === 27) {
                    b.preventDefault();
                    a.close()
                }
            });
            d(window).bind("resize.simplemodal", function () {
                f = a.getDimensions();
                a.o.autoResize ? a.setContainerDimensions() : a.o.autoPosition && a.setPosition();
                if (k || l) a.fixIE();
                else if (a.o.modal) {
                    a.d.iframe && a.d.iframe.css({
                        height: f[0],
                        width: f[1]
                    });
                    a.d.overlay.css({
                        height: f[0],
                        width: f[1]
                    })
                }
            })
        },
        unbindEvents: function () {
            d("." + this.o.closeClass).unbind("click.simplemodal");
            d(document).unbind("keydown.simplemodal");
            d(window).unbind("resize.simplemodal");
            this.d.overlay.unbind("click.simplemodal")
        },
        fixIE: function () {
            var a = this,
                b = a.o.position;
            d.each([a.d.iframe || null, !a.o.modal ? null : a.d.overlay, a.d.container], function (c, h) {
                if (h) {
                    var g = h[0].style;
                    g.position = "absolute";
                    if (c < 2) {
                        g.removeExpression("height");
                        g.removeExpression("width");
                        g.setExpression("height", 'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"');
                        g.setExpression("width", 'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"')
                    } else {
                        var e;
                        if (b && b.constructor === Array) {
                            c = b[0] ? typeof b[0] === "number" ? b[0].toString() : b[0].replace(/px/, "") : h.css("top").replace(/px/, "");
                            c = c.indexOf("%") === -1 ? c + ' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"' : parseInt(c.replace(/%/, "")) + ' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';
                            if (b[1]) {
                                e = typeof b[1] === "number" ? b[1].toString() : b[1].replace(/px/, "");
                                e = e.indexOf("%") === -1 ? e + ' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"' : parseInt(e.replace(/%/, "")) + ' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'
                            }
                        } else {
                            c = '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';
                            e = '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'
                        }
                        g.removeExpression("top");
                        g.removeExpression("left");
                        g.setExpression("top", c);
                        g.setExpression("left", e)
                    }
                }
            })
        },
        focus: function (a) {
            var b = this;
            a = a && d.inArray(a, ["first", "last"]) !== -1 ? a : "first";
            var c = d(":input:enabled:visible:" + a, b.d.wrap);
            setTimeout(function () {
                c.length > 0 ? c.focus() : b.d.wrap.focus()
            }, 10)
        },
        getDimensions: function () {
            var a = d(window);
            return [d.browser.opera && d.browser.version > "9.5" && d.fn.jquery < "1.3" || d.browser.opera && d.browser.version < "9.5" && d.fn.jquery > "1.2.6" ? a[0].innerHeight : a.height(), a.width()]
        },
        getVal: function (a, b) {
            return a ? typeof a === "number" ? a : a === "auto" ? 0 : a.indexOf("%") > 0 ? parseInt(a.replace(/%/, "")) / 100 * (b === "h" ? f[0] : f[1]) : parseInt(a.replace(/px/, "")) : null
        },
        update: function (a, b) {
            var c = this;
            if (!c.d.data) return false;
            c.d.origHeight = c.getVal(a, "h");
            c.d.origWidth = c.getVal(b, "w");
            c.d.data.hide();
            a && c.d.container.css("height", a);
            b && c.d.container.css("width", b);
            c.setContainerDimensions();
            c.d.data.show();
            c.o.focus && c.focus();
            c.unbindEvents();
            c.bindEvents()
        },
        setContainerDimensions: function () {
            var a = this,
                b = k || m,
                c = a.d.origHeight ? a.d.origHeight : d.browser.opera ? a.d.container.height() : a.getVal(b ? a.d.container[0].currentStyle.height : a.d.container.css("height"), "h");
            b = a.d.origWidth ? a.d.origWidth : d.browser.opera ? a.d.container.width() : a.getVal(b ? a.d.container[0].currentStyle.width : a.d.container.css("width"), "w");
            var h = a.d.data.outerHeight(true),
                g = a.d.data.outerWidth(true);
            a.d.origHeight = a.d.origHeight || c;
            a.d.origWidth = a.d.origWidth || b;
            var e = a.o.maxHeight ? a.getVal(a.o.maxHeight, "h") : null,
                i = a.o.maxWidth ? a.getVal(a.o.maxWidth, "w") : null;
            e = e && e < f[0] ? e : f[0];
            i = i && i < f[1] ? i : f[1];
            var j = a.o.minHeight ? a.getVal(a.o.minHeight, "h") : "auto";
            c = c ? a.o.autoResize && c > e ? e : c < j ? j : c : h ? h > e ? e : a.o.minHeight && j !== "auto" && h < j ? j : h : j;
            e = a.o.minWidth ? a.getVal(a.o.minWidth, "w") : "auto";
            b = b ? a.o.autoResize && b > i ? i : b < e ? e : b : g ? g > i ? i : a.o.minWidth && e !== "auto" && g < e ? e : g : e;
            a.d.container.css({
                height: c,
                width: b
            });
            a.d.wrap.css({
                overflow: h > c || g > b ? "auto" : "visible"
            });
            a.o.autoPosition && a.setPosition()
        },
        setPosition: function () {
            var a = this,
                b, c;
            b = f[0] / 2 - a.d.container.outerHeight(true) / 2;
            c = f[1] / 2 - a.d.container.outerWidth(true) / 2;
            if (a.o.position && Object.prototype.toString.call(a.o.position) === "[object Array]") {
                b = a.o.position[0] || b;
                c = a.o.position[1] || c
            } else {
                b = b;
                c = c
            }
            a.d.container.css({
                left: c,
                top: b
            })
        },
        watchTab: function (a) {
            var b = this;
            if (d(a.target).parents(".simplemodal-container").length > 0) {
                b.inputs = d(":input:enabled:visible:first, :input:enabled:visible:last", b.d.data[0]);
                if (!a.shiftKey && a.target === b.inputs[b.inputs.length - 1] || a.shiftKey && a.target === b.inputs[0] || b.inputs.length === 0) {
                    a.preventDefault();
                    b.focus(a.shiftKey ? "last" : "first")
                }
            } else {
                a.preventDefault();
                b.focus()
            }
        },
        open: function () {
            var a = this;
            a.d.iframe && a.d.iframe.show();
            if (d.isFunction(a.o.onOpen)) a.o.onOpen.apply(a, [a.d]);
            else {
                a.d.overlay.show();
                a.d.container.show();
                a.d.data.show()
            }
            a.o.focus && a.focus();
            a.bindEvents()
        },
        close: function () {
            var a = this;
            if (!a.d.data) return false;
            a.unbindEvents();
            if (d.isFunction(a.o.onClose) && !a.occb) {
                a.occb = true;
                a.o.onClose.apply(a, [a.d])
            } else {
                if (a.d.placeholder) {
                    var b = d("#simplemodal-placeholder");
                    if (a.o.persist) b.replaceWith(a.d.data.removeClass("simplemodal-data").css("display", a.display));
                    else {
                        a.d.data.hide().remove();
                        b.replaceWith(a.d.orig)
                    }
                } else a.d.data.hide().remove();
                a.d.container.hide().remove();
                a.d.overlay.hide();
                a.d.iframe && a.d.iframe.hide().remove();
                setTimeout(function () {
                    a.d.overlay.remove();
                    a.d = {}
                }, 10)
            }
        }
    }
})(jQuery);