// Capture the Backbone global so when the tests run they use the correct version of Backbone.
(function(Backbone){
    "use strict";

    describe('Backbone ' + Backbone.VERSION, function(){
        var stable;

        beforeEach(function(){
            stable = ('$' in Backbone);

            if (stable){
                Backbone.$ = Backbone.Native;
            } else {
                Backbone.setDomLibrary(Backbone.Native);
            }
        });

        describe('Views', function(){
            var view;

            beforeEach(function(){
                this.element.innerHTML = "<div class='root'></div>";
            });

            it('should set up the element if .el is a selector', function(){
                view = new (Backbone.View.extend({
                    el: '.root'
                }));
                debugger;

                expect(view.el).toBe(this.element.querySelector('.root'));
                expect(view.$el).toBeInstanceOf(Backbone.Native);
                expect(view.$el.length).toBe(1);
                expect(view.$el[0]).toBe(this.element.querySelector('.root'));
            });

            it('should set up the element if .el is an element', function(){
                view = new (Backbone.View.extend({
                    el: this.element.querySelector('.root')
                }));

                expect(view.el).toBe(this.element.querySelector('.root'));
                expect(view.$el).toBeInstanceOf(Backbone.Native);
                expect(view.$el.length).toBe(1);
                expect(view.$el[0]).toBe(this.element.querySelector('.root'));
            });

            it('should set up the element if .el is an object', function(){
                view = new (Backbone.View.extend({
                    el: Backbone.Native('.root')
                }));

                expect(view.el).toBe(this.element.querySelector('.root'));
                expect(view.$el).toBeInstanceOf(Backbone.Native);
                expect(view.$el.length).toBe(1);
                expect(view.$el[0]).toBe(this.element.querySelector('.root'));
            });

            it('should set up the element if .el is an HTML snippet', function(){
                view = new (Backbone.View.extend({
                    el: '<li id="el-id" class="className" disabled="disabled"' +
                        'data-value="value">word1 <span>word2</span> word3</li>'
                }));

                expect(view.el.tagName).toBe('LI');
                expect(view.el.id).toBe('el-id');
                expect(view.el.className).toBe('className');
                expect(view.el.getAttribute('disabled')).toBe('disabled');
                expect(view.el.getAttribute('data-value')).toBe('value');
                expect(view.el.innerHTML).toBe('word1 <span>word2</span> word3');
                expect(view.$el).toBeInstanceOf(Backbone.Native);
                expect(view.$el.length).toBe(1);
                expect(view.$el[0]).toBe(view.el);
            });

            it('should set up the elment from view attributes', function(){
                view = new (Backbone.View.extend({
                    id: 'el-id',
                    className: 'className',
                    tagName: 'li',
                    attributes: {
                        'html': 'word1 <span>word2</span> word3',
                        'disabled': 'disabled',
                        'data-value': 'value'
                    }
                }));

                expect(view.el.tagName).toBe('LI');
                expect(view.el.id).toBe('el-id');
                expect(view.el.className).toBe('className');
                expect(view.el.getAttribute('disabled')).toBe('disabled');
                expect(view.el.getAttribute('data-value')).toBe('value');
                expect(view.el.innerHTML).toBe('word1 <span>word2</span> word3');
                expect(view.$el).toBeInstanceOf(Backbone.Native);
                expect(view.$el.length).toBe(1);
                expect(view.$el[0]).toBe(view.el);
            });

            it('should bind and clean up delegate events', function(){
                this.element.innerHTML = '<span class="name"></span>';
                var name = this.element.querySelector('.name');

                var viewClass = Backbone.View.extend({
                    el: this.element,
                    events: {
                        'click .name': 'clickEvt_'
                    },
                    clickEvt_: function(){}
                });

                var view1 = new viewClass();
                spyOn(view1, 'clickEvt_');
                view1.delegateEvents();

                var view2 = new viewClass();
                spyOn(view2, 'clickEvt_');
                view2.delegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).toHaveBeenCalled();
                expect(view2.clickEvt_).toHaveBeenCalled();
                view1.clickEvt_.reset();
                view2.clickEvt_.reset();
                view1.undelegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).not.toHaveBeenCalled();
                expect(view2.clickEvt_).toHaveBeenCalled();
                view2.clickEvt_.reset();
                view2.undelegateEvents();
                view1.delegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).toHaveBeenCalled();
                expect(view2.clickEvt_).not.toHaveBeenCalled();
                view1.clickEvt_.reset();
                view1.undelegateEvents();
                view2.undelegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).not.toHaveBeenCalled();
                expect(view2.clickEvt_).not.toHaveBeenCalled();
            });

            it('should bind and clean up bound events', function(){
                this.element.innerHTML = '<span class="name"></span>';
                var name = this.element.querySelector('.name');

                var viewClass = Backbone.View.extend({
                    el: this.element,
                    events: {
                        'click': 'clickEvt_'
                    },
                    clickEvt_: function(){}
                });

                var view1 = new viewClass();
                spyOn(view1, 'clickEvt_');
                view1.delegateEvents();

                var view2 = new viewClass();
                spyOn(view2, 'clickEvt_');
                view2.delegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).toHaveBeenCalled();
                expect(view2.clickEvt_).toHaveBeenCalled();
                view1.clickEvt_.reset();
                view2.clickEvt_.reset();
                view1.undelegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).not.toHaveBeenCalled();
                expect(view2.clickEvt_).toHaveBeenCalled();
                view2.clickEvt_.reset();
                view2.undelegateEvents();
                view1.delegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).toHaveBeenCalled();
                expect(view2.clickEvt_).not.toHaveBeenCalled();
                view1.clickEvt_.reset();
                view1.undelegateEvents();
                view2.undelegateEvents();

                this.createAndFireEvent(name, 'click');

                expect(view1.clickEvt_).not.toHaveBeenCalled();
                expect(view2.clickEvt_).not.toHaveBeenCalled();
            });
        }); // describe('Views')

        describe('Models', function(){
            var model, xhr, success, error;

            function loadData(code, data){
                xhr.status = code || 200;
                xhr.responseText = data || '{"id":10,"attr":"responseVal"}'
                xhr.onload();
            }

            function expectSuccess(){
                if (stable){
                    expect(success).toHaveBeenCalledWith(
                        model, {id: 10, attr: 'responseVal'}, jasmine.any(Object));
                } else {
                    expect(success).toHaveBeenCalledWith(
                        model, {id: 10, attr: 'responseVal'});
                }
                expect(error).not.toHaveBeenCalled();
            }

            beforeEach(function(){
                xhr = jasmine.createSpyObj('XHR', [
                    'open',
                    'send',
                    'setRequestHeader'
                ]);
                spyOn(window, 'XMLHttpRequest').andReturn(xhr);
                success = jasmine.createSpy('success');
                error = jasmine.createSpy('error');

                model = new (Backbone.Model.extend({
                    url: 'model/',
                    defaults: {
                        id: 15,
                        attr: 'val'
                    }
                }));
            });

            it('should fetch', function(){
                var result = model.fetch({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('GET', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should fail to fetch on error', function(){
                var result = model.fetch({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('GET', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();

                loadData(404);

                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(success).not.toHaveBeenCalled();
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should save existing', function(){
                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('PUT', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":15,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should save new', function(){
                model.set('id', null);

                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('POST', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":null,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should fail to save', function(){
                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('PUT', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":15,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData(500);

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should delete', function(){
                var result = model.destroy({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('DELETE', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should fail to delete', function(){
                var result = model.destroy({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('DELETE', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).not.toHaveBeenCalled();

                loadData(500);

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });
        }); // describe('Models')

        describe('History objects', function(){
            var history, route;

            beforeEach(function(){
                history = new Backbone.History()
                history.options = {
                    pushState: true,
                    hashChange: true,
                    silent: true
                };
                spyOn(history, 'getFragment').andReturn('');
                history.history = jasmine.createSpyObj('History', [
                    'pushState'
                ]);
                history.location = jasmine.createSpyObj('Location', [
                    'replace'
                ]);
                history.location.href = '';
                history.location.search = '';
                history.location.pathname = '/';

                route = jasmine.createSpy('route');
                history.route(/.*/, route);
            });

            afterEach(function(){
                history.stop();
            });

            it('should add and remove state listeners', function(){
                history.start();
                history.getFragment.andReturn('path/route/');

                this.createAndFireEvent(window, 'popstate');

                expect(route).toHaveBeenCalledWith('path/route/');
                route.reset();
                history.getFragment.andReturn('path/route/nextpage');

                history.stop();
                this.createAndFireEvent(window, 'popstate');

                expect(route).not.toHaveBeenCalled();
            });

            it('should add and remove hashchange listeners', function(){
                history.options.pushState = false;
                history.start();
                history.getFragment.andReturn('path/route/');

                this.createAndFireEvent(window, 'hashchange');

                expect(route).toHaveBeenCalledWith('path/route/');
                route.reset();
                history.getFragment.andReturn('path/route/nextpage');

                history.stop();
                this.createAndFireEvent(window, 'hashchange');

                expect(route).not.toHaveBeenCalled();
            });
        }); // describe('History objects')
    });
})(Backbone);
