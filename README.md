# Backbone.Native

Backbone.Native is a substitute for jQuery meant to allow Backbone to function with the minimum
possible amount of extra code. It allows sites that do not wish to use the functionality of
jQuery to use Backbone and rely on the functionality of JavaScript and the standard DOM APIs.

## What this isn't

This is *not* a drop-in replacement for *all* of jQuery. The goal of this project is to keep the
code as simple as possible and implement the minimum amount of functionality required to use
Backbone without sizable external dependencies. This library is only about 4% of the size of
jQuery.

## How to use Backbone.Native

Simply drop backbone.native.min.js into a page after Backbone has been loaded and it will
automatically set itself up with Backbone, and create `$` and `Backbone.Native`.

### How to use as a [component](https://github.com/component/component)

Declare the dependency in your component.json

    {
        …
        "dependencies": {
            "inkling/backbone.native": "*",
            "components/backbone": "*"
        }
        …
    }

Then, attach this dependency to backbone in your code:

```javascript
var bb = require('backbone');
bb.$ = require('backbone.native');
```

## Major differences between jQuery and Native APIs

The goal of this library is to keep the code as simple as possible while preserving Backbone's
core functionality. The only jQuery-like functionality provided are the parts that are
strictly needed for Backbone to function.

### jQuery Collection behavior

Internally Backbone only treats `this.el` and `this.$el` as single elements, so none of jQuery's
collection logic has been implemented. Support for `this.$(...)` child selection has explicitly
not been implemented because of this. It is expected that instead users will make use of
`querySelectorAll`.

    // Instead of this
    this.$('.child').each(function(i, el){

    // Use this
    _.forEach(this.el.querySelectorAll('.child'), function(el, i){

This is meant to avoid confusion around the return value of `this.$` not being an object, but
you can always add this to your View base class to shorten it, accepting that you will only
have standard `Array` functionality.

    $: function(sel){
        return _.toArray(this.el.querySelectorAll(sel));
    }

### Selector limitations

Selectors must be compatible with `querySelector`, which leads to two primary changes in
selector behavior. For more details, see
[John Resig's blog post on the subject](http://ejohn.org/blog/thoughts-on-queryselectorall/).

1. Selectors beginning with `>` are not supported, so developers must take possible child views
   into account when writing selectors.
2. Selectors do not have to match entirely within their context element. For example

        <html>
            <body>
                <div>
                    <span></span>
                </div>
            </body>
        </html>

   If `div` is `view.el`, a selector such as `body span` would match `span` even though `body` is
   a parent of the view element.

### Event 'currentTarget'

Users of jQuery will expect `event.currentTarget` to contain the target element, whether using
standard event binding, or event delegation. This library does not provide its own fake Event
API, and thus 'currentTarget' will always be the `view.el`. To work around this while still
providing an easy to use API, the element matched by event delegation is returned as the second
argument to all event handlers.

    events: {
        'click .child': 'clickChildEvent'
    },
    clickChildEvent: function(event, childElement){
        // Use childElement instead of event.currentTarget
    }

### XHR

The `$.ajax` implementation only covers the basic cases (pull requests accepted!). A Deferred
object is also not returned from the AJAX request, so developers must rely on the standard
`success` and `error` callbacks.

### $.ready

`$.ready` has not been implemented, instead deferring to the `DOMContentLoaded` event.

    document.addEventListener('DOMContentLoaded', function(){
        // Code to run when the DOM has loaded.
    }, false);

## Compatibility

This library supports any browser that provides ECMAScript 5, querySelector(All),
matchesSelector (w/ prefixes) and XHR2.

That translates roughly to:

 * Chrome `(>= 8.0)`
 * FireFox `(>= 4.0)`
 * Safari `(>= 5.1)`
 * IE `(>= 10)`

It has been tested with Backbone v0.9.2 and v1.0.0.

## Examples

Some simple examples are available in the [examples](examples/) directory. They are simple
comparisons demonstrating how code could be written with jQuery vs with Backbone.Native.

## Contributors

 * Logan F Smyth ([@loganfsmyth](http://www.twitter.com/loganfsmyth))

## Copyright and License

Copyright 2013 Inkling Systems, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
