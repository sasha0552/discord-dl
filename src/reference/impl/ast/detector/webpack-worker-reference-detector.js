import webpackChunkDetector from "./webpack-chunk-detector.js";
import webpackMainDetector from "./webpack-main-detector.js";

export default function detect(body) {
  if (webpackChunkDetector(body)) {
    return false;
  }

  if (webpackMainDetector(body)) {
    return false;
  }

  return body.includes("return new Worker(");
}
