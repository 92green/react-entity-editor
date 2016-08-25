'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditorRoutes = exports.EntityEditorRouter = exports.EntityEditorHandler = exports.EntityEditor = undefined;

var _EntityEditor = require('./EntityEditor');

var _EntityEditor2 = _interopRequireDefault(_EntityEditor);

var _EntityEditorHandler = require('./EntityEditorHandler');

var _EntityEditorHandler2 = _interopRequireDefault(_EntityEditorHandler);

var _EntityEditorRouter = require('./EntityEditorRouter');

var _EntityEditorRouter2 = _interopRequireDefault(_EntityEditorRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EntityEditor = _EntityEditor2.default;
exports.EntityEditorHandler = _EntityEditorHandler2.default;
exports.EntityEditorRouter = _EntityEditorRouter2.default;
exports.createEditorRoutes = _EntityEditorRouter.createEditorRoutes;