/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */

/**
 * @package timestep.env.browser.Context2D;
 *
 * Generates a rendering context by creating our own Canvas element.
 */

import device;
import .FontRenderer;

exports = function (opts) {
  var parentNode = opts && opts.parent;
  var el = opts && opts.el || document.createElement('canvas');

  el.width = opts.width;
  el.height = opts.height;

  var ctx = el.getContext('2d');
  ctx.font = '11px ' + device.defaultFontFamily;
  ctx.getElement = function () { return el; };

  ctx.reset = function () {};

  ctx.clear = function () {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, el.width, el.height);
    this.restore();
  };

  ctx.clipRect = function (x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
  };

  ctx.swap = function () {};
  ctx.execSwap = function () {};

  ctx.circle = function (x, y, radius, clip) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI, true);
    if(!!clip){
        this.clip();
    }
  };

  var _lastPointSprite = {
    img: null,
    color: null,
    canvas: null
  };

  ctx.drawPointSprites = function (x1, y1, x2, y2) {
    var sprite = this.pointSprite;
    if (!sprite || !sprite.complete) { return; }

    var width = sprite.width;
    var height = sprite.height;
    var canvas = _lastPointSprite.canvas || (_lastPointSprite.canvas = document.createElement('canvas'));

    if (sprite != _lastPointSprite.img || this.strokeStyle != _lastPointSprite.color) {
      _lastPointSprite.img = sprite;
      _lastPointSprite.color = this.strokeStyle;
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = this.strokeStyle;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(sprite, 0, 0);
    }

    // Add points to the buffer so there are drawing points every X pixels
    var dx = x2 - x1;
    var dy = y2 - y1;
    var count = Math.ceil(Math.sqrt(dx * dx + dy * dy) / this.pointSpriteStep);
    if (count < 1) { count = 1; }

    var d = this.lineWidth;
    for (var i = 0; i < count; ++i) {
      var x = x1 + dx * i / count;
      var y = y1 + dy * i / count;
      this.drawImage(canvas, 0, 0, width, height, x - d / 2, y - d / 2, d, d);
    }
  };

  ctx.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x,y+radius);
    this.lineTo(x,y+height-radius);
    this.quadraticCurveTo(x,y+height,x+radius,y+height);
    this.lineTo(x+width-radius,y+height);
    this.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    this.lineTo(x+width,y+radius);
    this.quadraticCurveTo(x+width,y,x+width-radius,y);
    this.lineTo(x+radius,y);
    this.quadraticCurveTo(x,y,x,y+radius);
  };

  ctx.loadIdentity = function () {
    this.setTransform(1, 0, 0, 1, 0, 0);
  };

  ctx.measureText = FontRenderer.wrapMeasureText(ctx.measureText);
  ctx.fillText = FontRenderer.wrapFillText(ctx.fillText);
  ctx.strokeText = FontRenderer.wrapStrokeText(ctx.strokeText);

  ctx.filter = null;
  ctx.setFilter = function (filter) {
    this.filter = filter;
  };
  // deprecated API, we only support one filter per context
  ctx.setFilters = function () {
    logger.warn("ctx.setFilters is deprecated, use ctx.setFilter instead.");
    for (var id in filters) {
      this.setFilter(filters[id]);
      break;
    }
  };

  ctx.clearFilter = function () {
    this.filter = null;
  };
  // deprecated API, we only support one filter per context
  ctx.clearFilters = function () {
    logger.warn("ctx.clearFilters is deprecated, use ctx.clearFilter instead.");
    this.clearFilter();
  };

  return ctx;
};
