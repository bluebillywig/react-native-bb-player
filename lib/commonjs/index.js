"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BBPlayerView: true,
  ExpoBBPlayerView: true,
  BBShortsView: true,
  BBOutstreamView: true
};
Object.defineProperty(exports, "BBOutstreamView", {
  enumerable: true,
  get: function () {
    return _BBOutstreamView.default;
  }
});
Object.defineProperty(exports, "BBPlayerView", {
  enumerable: true,
  get: function () {
    return _BBPlayerView.default;
  }
});
Object.defineProperty(exports, "BBShortsView", {
  enumerable: true,
  get: function () {
    return _BBShortsView.default;
  }
});
Object.defineProperty(exports, "ExpoBBPlayerView", {
  enumerable: true,
  get: function () {
    return _BBPlayerView.default;
  }
});
var _BBPlayerView = _interopRequireDefault(require("./BBPlayerView"));
var _BBShortsView = _interopRequireWildcard(require("./BBShortsView"));
Object.keys(_BBShortsView).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _BBShortsView[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BBShortsView[key];
    }
  });
});
var _BBOutstreamView = _interopRequireWildcard(require("./BBOutstreamView"));
Object.keys(_BBOutstreamView).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _BBOutstreamView[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BBOutstreamView[key];
    }
  });
});
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//# sourceMappingURL=index.js.map