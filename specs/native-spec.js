/**
 * Unit tests for the behavior of Backbone.Native without relying on Backbone.
 */
describe('Backbone.Native', function(){
    "use strict";

    var evt, one, two, three, oneSpy, twoSpy, threeSpy;
    var orig$, origBackboneNative;
    var $;

    beforeEach(function(){
        this.element.innerHTML =
            '<div class="one">' +
            '    <div class="two">' +
            '        <span class="three">' +
            '        </span>' +
            '    </div>' +
            '</div>';

        one = this.element.querySelector('.one');
        two = one.querySelector('.two');
        three = two.querySelector('.three');

        oneSpy = jasmine.createSpy('one');
        twoSpy = jasmine.createSpy('two');
        threeSpy = jasmine.createSpy('three');

        orig$ = window.$;
        $ = origBackboneNative = window.Backbone.Native;
    });

    afterEach(function(){
        // Restore the originals in case the tests moved them.
        window.$ = orig$;
        window.Backbone.Native = origBackboneNative;
    });

    describe('event management', function(){
        it('should (un)bind events directly', function(){
            $(one).on('click', oneSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.reset();

            $(one).off('click', oneSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should bind events with delegation', function(){
            $(one).on('click', '.two', twoSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            twoSpy.reset();

            $(one).off('click', '.two', twoSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).not.toHaveBeenCalled();
        });

        it('should stop propagation', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            twoSpy.andCallFake(function(evt){
                evt.stopPropagation();
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(evt.stopPropagation).toHaveBeenCalled();
            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            expect(oneSpy).not.toHaveBeenCalled();
            $(two).off('click', twoSpy);
            twoSpy.reset();

            evt = this.createAndFireEvent(two, 'click');

            expect(evt.stopPropagation).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(oneSpy).toHaveBeenCalledWith(evt, one);
        });

        it('should prevent default', function(){
            $(one).on('click', oneSpy);
            oneSpy.andCallFake(function(evt){
                evt.preventDefault();
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            expect(evt.preventDefault).toHaveBeenCalled();
        });

        it('should stop propagation and default with false', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            twoSpy.andCallFake(function(){
                return false;
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            expect(oneSpy).not.toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('should stop propagation and default with false when delegated', function(){
            $(one).on('click', '.two', twoSpy);
            $(two).on('click', '.three', threeSpy);
            threeSpy.andCallFake(function(){
                return false;
            });

            evt = this.createAndFireEvent(three, 'click');

            expect(threeSpy).toHaveBeenCalledWith(evt, three);
            expect(twoSpy).not.toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('should unbind events by namespace', function(){
            $(one).on('click.name', oneSpy);
            $(one).on('click.name', twoSpy);
            $(one).on('click.name2', threeSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            expect(twoSpy).toHaveBeenCalledWith(evt, one);
            expect(threeSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.reset();
            twoSpy.reset();
            threeSpy.reset();

            $(one).off('.name');

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalledWith(evt, one);
        });

        it('should unbind events by callback', function(){
            $(one).on('mousedown', oneSpy);
            $(one).on('mouseup', oneSpy);
            $(one).on('mousedown', twoSpy);
            $(one).on('mouseup', twoSpy);

            evt = this.createAndFireEvent(one, 'mousedown');
            evt = this.createAndFireEvent(one, 'mouseup');

            expect(oneSpy.callCount).toBe(2);
            expect(twoSpy.callCount).toBe(2);
            oneSpy.reset();
            twoSpy.reset();

            $(one).off(null, oneSpy);

            evt = this.createAndFireEvent(one, 'mousedown');
            evt = this.createAndFireEvent(one, 'mouseup');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy.callCount).toBe(2);
        });

        it('should unbind events by type', function(){
            $(one).on('click.name', oneSpy);
            $(one).on('click.name2', twoSpy);
            $(one).on('mousedown.name', threeSpy);

            evt = this.createAndFireEvent(one, 'click');
            evt = this.createAndFireEvent(one, 'mousedown');

            expect(oneSpy).toHaveBeenCalled();
            expect(twoSpy).toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalled();
            oneSpy.reset();
            twoSpy.reset();
            threeSpy.reset();

            $(one).off('click');

            evt = this.createAndFireEvent(one, 'click');
            evt = this.createAndFireEvent(one, 'mousedown');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalled();
        });
    }); // describe('event management')

    describe('jQuery interface', function(){
        var inst;

        it('should create an instance when called as a function', function(){
            inst = $(one);

            expect(inst).toEqual(jasmine.any($));
        });

        it('should create an empty set when called with nothing', function(){
            inst = $();

            expect(inst.length).toBe(0);
            expect(inst[0]).toBeUndefined();
        });

        it('should create an empty set when called with missing id', function(){
            inst = $('#some-random-id');

            expect(inst.length).toBe(0);
            expect(inst[0]).toBeUndefined();
        });

        it('should create a new element when passed HTML', function(){
            inst = $('<div class="hi">Content</div>');

            expect(inst.length).toBe(1);
            expect(inst[0].nodeName).toBe('DIV');
            expect(inst[0]).toHaveClass('hi');
            expect(inst[0]).toHaveText('Content');
        });

        it('should query a selector when not passed HTML', function(){
            inst = $('.two', this.element.ownerDocument);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(two);
        });

        it('should create an instance with the argument otherwise', function(){
            inst = $(two);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(two);
        });

        it('should create an instance with a window object', function(){
            inst = $(window);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(window);
        });

        describe('attr', function(){
            it('should support HTML', function(){
                $(two).attr({html: '<div id="random">New Content</div>'});

                expect(two.childNodes.length).toBe(1);
                var el = two.childNodes[0];
                expect(el.id).toBe('random');
                expect(el).toHaveText('New Content');
            });

            it('should support text', function(){
                $(two).attr({text: '<div>New Content</div>'});

                expect(two).toHaveText('<div>New Content</div>');
            });

            it('should support class', function(){
                two.classList.add('someclass');

                $(two).attr({'class': 'random other'});

                expect(two).toHaveClass('random', 'other');
                expect(two).not.toHaveClass('someclass');
            });

            it('should set attributes', function(){
                $(two).attr({value: 'A Value'});

                expect(two.getAttribute('value')).toBe('A Value');
            });

            it('should support multiple attributes', function(){
                $(two).attr({
                    text: 'Content',
                    id: 'OMG',
                    random: 'val'
                });

                expect(two).toHaveText('Content');
                expect(two.id).toBe('OMG');
                expect(two.getAttribute('random')).toBe('val');
            });
        }); // describe('attr')

        it('should set HTML content', function(){
            $(two).html('<div id="random">New Content</div>');

            expect(two.childNodes.length).toBe(1);
            var el = two.childNodes[0];
            expect(el.id).toBe('random');
            expect(el).toHaveText('New Content');
        });

        it('should remove recursively', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            $(three).on('click', threeSpy);

            $(one).remove();

            expect(one.parentElement).toBeNull();
            this.element.appendChild(one);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).not.toHaveBeenCalled();
        });

        it('should add/remove events', function(){
            $(one).on('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.reset();

            $(one).off('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should support (un)bind', function(){
            $(one).bind('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.reset();

            $(one).unbind('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should support (un)delegate', function(){
            $(one).delegate('.two', 'click', oneSpy);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, two);
            oneSpy.reset();

            $(one).undelegate('.two', 'click', oneSpy);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        describe('ajax', function(){
            var xhr, data, success, error;

            beforeEach(function(){
                xhr = jasmine.createSpyObj('XMLHttpRequest', [
                    'open',
                    'setRequestHeader',
                    'send'
                ]);
                xhr.responseText = '{"key":"value"}';
                xhr.status = 200;
                xhr.statusText = 'OK';

                spyOn(window, 'XMLHttpRequest').andReturn(xhr);

                data = {
                    page: 3,
                    arg: 'section'
                };

                success = jasmine.createSpy('success');
                error = jasmine.createSpy('error');
            });

            it('should send a basic request', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should process data when given an object', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    type: 'POST',
                    data: data,
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith('POST',
                    'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith('page=3&arg=section');
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should not process data when explicitly disabled', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    type: 'POST',
                    data: data,
                    processData: false,
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith('POST',
                    'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(data);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should place data in query parameters for GET', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    type: 'GET',
                    data: data,
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith('GET',
                    'http://example.com/page.html?test=val&page=3&arg=section', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should place data in query parameters for HEAD', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    type: 'HEAD',
                    data: data,
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith('HEAD',
                    'http://example.com/page.html?test=val&page=3&arg=section', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should send data directly for POST', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    type: 'POST',
                    data: JSON.stringify(data),
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith('POST',
                    'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith('{"page":3,"arg":"section"}');
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should set the content type when given', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    contentType: 'application/x-www-form-urlencoded',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type',
                    'application/x-www-form-urlencoded');
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should execute a beforeSend callback', function(){
                var beforeSend = jasmine.createSpy('beforeSend');
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    beforeSend: beforeSend,
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(beforeSend).toHaveBeenCalledWith(xhr);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should parse JSON if dataType is json', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    dataType: 'json',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.onload();

                expect(success).toHaveBeenCalledWith({key:"value"}, 'OK', xhr);
                expect(error).not.toHaveBeenCalled();
            });

            it('should call success for 200 - 299', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                for (var i = 200; i < 300; i++){
                    success.reset();
                    error.reset();
                    xhr.status = i;

                    xhr.onload();

                    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
                    expect(error).not.toHaveBeenCalled();
                }
            });

            it('should call error on JSON parse error', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    dataType: 'json',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                xhr.responseText = '{"key';

                xhr.onload();

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(xhr);
            });

            it('should call error on server error', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();

                [400, 404, 500].forEach(function(status){
                    success.reset();
                    error.reset();

                    xhr.status = status;

                    xhr.onload();

                    expect(success).not.toHaveBeenCalled();
                    expect(error).toHaveBeenCalledWith(xhr);
                });
            });

            it('should call error on network error', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    dataType: 'json',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
                xhr.responseText = '';

                xhr.onerror();

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(xhr);
            });

            it('should call error on request abort', function(){
                var req = $.ajax({
                    url: 'http://example.com/page.html?test=val',
                    dataType: 'json',
                    success: success,
                    error: error
                });

                expect(window.XMLHttpRequest).toHaveBeenCalled();
                expect(xhr.open).toHaveBeenCalledWith(
                    'GET', 'http://example.com/page.html?test=val', true);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.onload).toEqual(jasmine.any(Function));
                expect(req).toBe(xhr);
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
                xhr.responseText = '';

                xhr.onabort();

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(xhr);
            });
        }); // describe('ajax')
    }); // describe('jQuery interface')

    it('should load itself on the global', function(){
        expect(window.$).toBe(window.Backbone.Native);
        expect(window.$).toEqual(jasmine.any(Function));
        expect(window.$.on).toEqual(jasmine.any(Function));
        expect(window.$.off).toEqual(jasmine.any(Function));
        expect(window.$.ajax).toEqual(jasmine.any(Function));
        expect(window.$.noConflict).toEqual(jasmine.any(Function));
    });

    it('should remove itself from the global with noConflict', function(){
        expect(window.$).toBe(window.Backbone.Native);

        var BN = $.noConflict();

        expect(window.$).not.toBe(BN);
        expect(window.Backbone.Native).toBe(BN);
        expect(BN).toBe($);
    });

    it('should remove itself from the global with noConflict deep', function(){
        expect(window.$).toBe(window.Backbone.Native);

        var BN = $.noConflict(true);

        expect(window.$).not.toBe(BN);
        expect(window.Backbone.Native).not.toBe(BN);
        expect(BN).toBe($);
    });
});
