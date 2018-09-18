# jquery-flipbox #

A simple jQuery slider plugin with a 3D box flip transition effect.
The direction of the flip is independent of the box side order, and you can use any number of sides.

Check out the [examples](https://krebszattila.github.io/jquery-flipbox/)!

## Setup ##

Include jquery.flipbox.js after jQuery.

```html
<script src="jquery.js"></script>
<script src="jquery.flipbox.js"></script>
```

And include the CSS file as well.

```html
<link href="jquery.flipbox.css" rel="stylesheet">
```

## API ##

### Initialize ###

Initialize the flipbox by calling `.flipbox()` on the selected element(s).

You can customize the effect by passing an [options](#options) object as an argument.

```javascript
$('.box').flipbox();     // default options

$('.box').flipbox({      // custom options
    vertical: false,
    width: $('.box').width(),
    height: $('.box').height(),
    index: 0,
    animationDuration: 400,
    animationEasing: 'ease',
    autoplay: false,
    autoplayReverse: false,
    autoplayWaitDuration: 3000,
    autoplayPauseOnHover: false
});
```

The element's direct descendants will be the sides of the box.

```html
<div class="box">
    <div>Text-only side</div>
    <img src="image-side.jpg">
    <div>
        <h1>Title</h1>
        <p>Side <strong>content</strong></p>
    </div>
</div>
```

#### Options ####

* `vertical`: Flip the box vertically. Default is `false` (horizontal flip). Can't be changed after initialization.
* `width`: The width of the box in pixels. Default is the width of the element. Can't be changed after initialization.
* `height`: The height of the box in pixels. Default is the height of the element. Can't be changed after initialization.
* `index`: The (zero-based) index of the initial side. Default is `0`.
* `animationDuration`: The duration of the flip animation in milliseconds. Default is `400`.
* `animationEasing`: The easing of the flip animation. Default is `ease`.
* `autoplay`: Flip the box automatically. Default is `false`.
* `autoplayReverse`: Reverse flip the box when autoplay is enabled. Default is `false`.
* `autoplayWaitDuration`: The wait duration of the sides in milliseconds when autoplay is enabled. Default is `3000`.
* `autoplayPauseOnHover`: Pause the autoplay on mouse hover. Default is `false`.

### Update ###

Call `.flipbox(options)` again on an element to modify the settings.

```javascript
$('.box').flipbox({
    animationDuration: 400,
    animationEasing: 'ease',
    autoplay: false,
    autoplayReverse: false,
    autoplayWaitDuration: 3000,
    autoplayPauseOnHover: false
});
```

### Destroy ###

To remove the effect from an element simply call `destroy`.

```javascript
$('.box').flipbox('destroy');
```

### Get ###

To get the number of sides call `size`.

```javascript
$('.box').flipbox('size');
```

To get the index of the current side call `current`.

```javascript
$('.box').flipbox('current');
```

### Control ###

To flip to the next side call `next`.

```javascript
$('.box').flipbox('next');
```

To flip to the previous side call `prev`.

```javascript
$('.box').flipbox('prev');
```

To jump to a specific side call `jump` with the index of the side.

```javascript
$('.box').flipbox('jump', 4);
```

All three control methods accepts an additional argument: the direction of the flip.
Pass `true` to flip the box backwards.

```javascript
$('.box').flipbox('next', true);
$('.box').flipbox('prev', true);
$('.box').flipbox('jump', 4, true);
```

### Edit ###

You can add a new side by calling `add` with the side HTML content and (optionally) the side index.

```javascript
$('.box').flipbox('add', '<p>New side</p>');     // add new side to the end
$('.box').flipbox('add', '<p>New side</p>', 4);  // insert new side to the specified index
```

You can remove a side by calling `remove` with the side index.

```javascript
$('.box').flipbox('remove', 4);
```

You can replace a side by calling `replace` with the side HTML content and (optionally) the side index.

```javascript
$('.box').flipbox('replace', '<p>New content</p>');     // replace current side content
$('.box').flipbox('replace', '<p>New content</p>', 4);  // replace the specified side content
```

## Events ##

You can listen for these events:

* `created`: Fires after the flipbox initialized.
* `updated`: Fires after the flipbox updated.
* `destroyed`: Fires after the flipbox destroyed.
* `flipping`: Fires before the flip animation starts. Event data:
    - `reverse`: `true` if the animation direction will be reversed.
    - `currentIndex`: the index of the current side.
    - `nextIndex`: the index of the next side.
* `flipped`: Fires after the flip animation completes. Event data:
    - `reverse`: `true` if the animation direction was reversed.
    - `prevIndex`: the index of the previous side.
    - `currentIndex`: the index of the current side.
* `added`: Fires after a side is added. Event data:
    - `index`: the index of the added side.
* `removed`: Fires after a side is removed. Event data:
    - `index`: the index of the removed side.
* `replaced`: Fires after a side is replaced. Event data:
    - `index`: the index of the replaced side.

```javascript
$('.box').on(eventName, function(event, data) {
    // handle event
});
```
