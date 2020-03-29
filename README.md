# diceroll
Roll the dice!

---

<img align="right" src="https://raw.githubusercontent.com/GitSquared/diceroll/master/readme_src/phone-demo.gif" alt="demo">

This is a 3D motion-activated dice built with React, Next.js, Typescript and the [Web Sensors API](https://developer.mozilla.org/docs/Web/API/Sensor_APIs).

Try it live at [diceroll.gaby.dev](https://diceroll.gaby.dev)!

### Compatibility

This should work on any web browser, however:
 - Browsers without sensors support (gyroscope + accelerometer) will graciously fall back to a static version of the cube without the orientation animation.
 - Desktop browsers will display a pop-up with a QR code to encourage users to try it on their phone.

### Technical

The cube itself is made with CSS perspective and transforms on a bunch of `<div>`s.

The gyroscope API is used to detect when angular velocity of the device is past a certain threshold, to trigger a dice roll.

A random number is chosen using `Math.random()` and after a little CSS animation, the cube is rotated to put the correct face on top, using an array of X/Y/Z rotation values (in deg):
```js
this.faceViews = [
  [0, 0, 0],
  [90, 0, 0],
  [0, 90, 0],
  [0, -90, 0],
  [-90, 0, 0],
  [-180, 0, 0]
]
```

Using the [RelativeOrientationSensor API](https://developers.google.com/web/updates/2017/09/sensors-for-the-web#orientation-sensors) or the [DeviceOrientationEvent API](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) depending on browser support, an offset is applied to those values to factor in the device's orientation for a cool 3D effect.

```js
// Calculate perspective rotation with device orientation effect
rx = x + (ax * 40)
if (this.state.face === 5) {
  ry = y
  rz = z + (-ay * 40)
} else if (this.state.face === 2) {
  ry = y
  rz = z + (ay * 40)
} else if (this.state.face === 6) {
  ry = y + (ay * 40)
  rz = z
} else {
  ry = y + (-ay * 40)
  rz = z
}
```

```css
.cube {
  transform-style: preserve-3d;
  transform: rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg);
}
```

Finally, the rounded edges of the cube's faces are filled with a second layer that is offset by the border-radius in px, so you can't see inside the cube through the edges:

<img width="250" src="https://raw.githubusercontent.com/GitSquared/diceroll/master/readme_src/cube-transparent.gif" alt="demo">

---

###### © 2020 Gabriel Saillard <gabriel@saillard.dev>
###### Licensed under the [Do What The Fuck You Want To Public License](https://github.com/GitSquared/diceroll/blob/master/LICENSE)
