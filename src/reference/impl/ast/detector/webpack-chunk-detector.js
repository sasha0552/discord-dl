const patterns = [
  '(window.webpackJsonp=window.webpackJsonp||[]).push(',
  '"use strict";(window.webpackJsonp=window.webpackJsonp||[]).push(',
  '(this.webpackJsonp=this.webpackJsonp||[]).push(',
  '"use strict";(this.webpackJsonp=this.webpackJsonp||[]).push(',
  '(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[]).push(',
  '"use strict";(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[]).push(',
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
    if (patterns.some(pattern => lines[1].startsWith(pattern))) {
      return true;
    }
  }

  return false;
}
