"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BBPlayerView: true,
  ExpoBBPlayerView: true
};
Object.defineProperty(exports, "BBPlayerView", {
  enumerable: true,
  get: function () {
    return _BBPlayerView.default;
  }
});
Object.defineProperty(exports, "ExpoBBPlayerView", {
  enumerable: true,
  get: function () {
    return _BBPlayerView.default;
  }
});
var _BBPlayerView = _interopRequireDefault(require("./BBPlayerView"));
var _BBPlayer = require("./BBPlayer.types");
Object.keys(_BBPlayer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _BBPlayer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BBPlayer[key];
    }
  });
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _utils = require("./utils");
Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//# sourceMappingURL=index.js.map