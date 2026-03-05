const patterns = [
  '(window.webpackJsonp=window.webpackJsonp||[])',
  '"use strict";(window.webpackJsonp=window.webpackJsonp||[])',
  '(this.webpackJsonp=this.webpackJsonp||[])',
  '"use strict";(this.webpackJsonp=this.webpackJsonp||[])',
  '(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])',
  '"use strict";(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])',
];

export default function detect(body) {
  const lines = body.split("\n");

  if (lines.length === 0) {
    return false;
  }

  if (patterns.some(pattern => lines[0].startsWith(pattern))) {
    return true;
  }

  if (lines[0].startsWith("/*") && lines.length > 1) {
    return patterns.some(pattern => lines[1].startsWith(pattern));
  }

  return false;
}
