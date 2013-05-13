
beforeEach(function(){
    this.element = document.createElement('div');
    this.element.classList.add('test-element');
    document.body.appendChild(this.element);

    this.addMatchers({
        toHaveClass: function(){
            return _.every(arguments, function(c){
                return this.actual.classList.contains(c);
            }, this);
        },
        toHaveText: function(text){
            return this.actual.textContent.trim() === text;
        },
        toBeInstanceOf: function(constructor){
            return this.actual instanceof constructor;
        }
    });

    /**
     * Helper for triggering mouse events.
     */
    this.createAndFireEvent = function(element, type){
        var evt;
        if (type === 'popstate' || type === 'hashchange'){
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(
                type,
                false,  // bubbles
                false   // cancelable
            );
        } else {
            evt = document.createEvent('MouseEvent');
            evt.initMouseEvent(
                type,
                true,   // bubbles
                true,   // cancelable
                window,
                0,      // detail
                0,      // screenX
                0,      // screenY
                0,      // pageX
                0,      // pageY
                false,  // ctrlKey
                false,  // altKey
                false,  // shiftKey
                false,  // metaKey
                0,      // button
                (type === 'mouseover' || type === 'mouseout') ? document : null
            );
        }

        spyOn(evt, 'preventDefault').andCallThrough();
        spyOn(evt, 'stopPropagation').andCallThrough();

        element.dispatchEvent(evt);

        return evt;
    };
});

afterEach(function(){
    document.body.removeChild(this.element);
});
