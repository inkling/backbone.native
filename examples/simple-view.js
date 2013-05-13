App.Views.Parent = Backbone.View.extend({
    events: {
        'click .child': 'clickChildEvent'
    },

    render: function(){
        _.forEach(this.el.querySelectorAll('.child'), function(childElement){
            var subview = new App.Views.Child();
            childElement.appendChild(subview.render().el);
            return subview;
        }, this);
    },

    clickChildEvent: function(event, childElement){
        childElement.classList.toggle(‘clicked’);
    }
});

