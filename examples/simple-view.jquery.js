App.Views.Parent = Backbone.View.extend({
    events: {
        'click .child': 'clickChildEvent'
    },

    render: function(){
        this.$('.child').each(function(i, childElement){
            var subview = new App.Views.Child();
            subview.render().$el.appendTo(childElement);
            return subview;
        }, this);
    },

    clickChildEvent: function(event){
        $(event.currentTarget).toggleClass('clicked');
    }
});

