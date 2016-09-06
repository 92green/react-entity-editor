'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditorRoutes = exports.EntityEditorRouter = exports.EntityEditorDefault = exports.EntityEditor = undefined;

var _EntityEditor = require('./EntityEditor');

var _EntityEditor2 = _interopRequireDefault(_EntityEditor);

var _EntityEditorDefault = require('./EntityEditorDefault');

var _EntityEditorDefault2 = _interopRequireDefault(_EntityEditorDefault);

var _EntityEditorRouter = require('./EntityEditorRouter');

var _EntityEditorRouter2 = _interopRequireDefault(_EntityEditorRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EntityEditor = _EntityEditor2.default;
exports.EntityEditorDefault = _EntityEditorDefault2.default;
exports.EntityEditorRouter = _EntityEditorRouter2.default;
exports.createEditorRoutes = _EntityEditorRouter.createEditorRoutes;