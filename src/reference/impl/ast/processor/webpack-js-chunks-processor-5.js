import genericJsChunkProcess from "./webpack-js-chunks-processor.js"
import { findMarkersByName } from "../utils.js";
import { createAstComparer } from "../../js-reference-finder.js";

/////

const conditionalExpressionComparerCommon = createAstComparer({
  "type": "ConditionalExpression",

  "test": {
    "type": "BinaryExpression",

    "left": {
      "type": "Literal",

      ";special:name": "chunkId",
      ";special:marker": "value"
    },

    "operator": "===",

    "right": {
      "type": "Identifier"
    }
  },

  "consequent": {
    "type": "Literal",

    ";special:name": "chunkIdAndfileName",
    ";special:marker": "value"
  }
});

const conditionalExpressionComparerSeparate = createAstComparer({
  "type": "ConditionalExpression",

  "test": {
    "type": "BinaryExpression",

    "left": {
      "type": "Literal",

      ";special:name": "chunkId",
      ";special:marker": "value"
    },

    "operator": "===",

    "right": {
      "type": "Identifier"
    }
  },

  "consequent": {
    "type": "BinaryExpression",

    "left": {
      "type": "BinaryExpression",

      "left": {
        "type": "Literal",
        "value": ""
      },

      "operator": "+",

      "right": {
        "type": "Identifier"
      }
    },

    "operator": "+",

    "right": {
      "type": "Literal",

      ";special:name": "fileName",
      ";special:marker": "value"
    }
  }
});

export default function process(comparerResult) {
  const references = [];

  /////

  let rootNode = comparerResult.node;

  /////

  while (true) {
    if (rootNode.type === "Program") {
      throw new Error("Could not find root node");
    }

    if (rootNode.type === "ReturnStatement") {
      break;
    }

    rootNode = rootNode._parent;
  }

  /////

  let currentCond = rootNode.argument;

  /////

  while (true) {
    const result1 = conditionalExpressionComparerCommon(currentCond);
    const result2 = conditionalExpressionComparerSeparate(currentCond);

    if (result1 === false && result2 === false) {
      break;
    }

    currentCond = currentCond.alternate;

    if (result1) {
      const chunkId = findMarkersByName(result1, "chunkId")[0];
      const chunkIdAndfileName = findMarkersByName(result1, "chunkIdAndfileName")[0];

      if (chunkIdAndfileName.startsWith(chunkId) && chunkIdAndfileName.endsWith(".js")) {
        references.push("/assets/" + chunkIdAndfileName);
      } else {
        console.warn(`Unexpected file name format: ${chunkIdAndfileName}`);
      }
    }

    if (result2) {
      const chunkId = findMarkersByName(result2, "chunkId")[0];
      const fileName = findMarkersByName(result2, "fileName")[0];

      if (fileName.startsWith(".") && fileName.endsWith(".js")) {
        references.push("/assets/" + chunkId + fileName);
      } else {
        console.warn(`Unexpected file name format: ${fileName}`);
      }
    }
  }

  return [ ... new Set([ ... genericJsChunkProcess(comparerResult), ... references ]) ];
}
