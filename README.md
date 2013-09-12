xy-model
========

This is a JavaScript simulation of the [classical XY model](http://en.wikipedia.org/wiki/Classical_XY_model) -- the angle of the moment at a site is marked by a hue on the color wheel. Sliders modify "temperature" (the addition of random noise), an external field (positive pulls in the red direction, negative in the cyan), and interaction strength (below 0 the model becomes antiferromagnetic; above 0.25 the simulation becomes unstable).

A more pedagogical explanation may well be forthcoming.

## Strange Technical Sidenote

The JavaScript code only does two different things to draw the graphic: setting `fillStyle` on the context, and calling `fillRect` on the context. While trying to debug disappointingly low framerates, I discovered that most of the drawing time was being spent setting `fillStyle`, rather than *actually drawing the rectangles*. This made no sense to me, but I rewrote the drawing code to minimize resets of `fillStyle` by looping through colors, drawing all rectangles of a given color in a row. Somehow, this sped things up a lot. Go figure.

(I haven't tried this again in more recent browsers.)
