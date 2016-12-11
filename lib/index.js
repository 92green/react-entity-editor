'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeConfig = exports.wrapItemComponent = exports.wrapListComponent = exports.createEditorRoutes = exports.EntityEditorRouter = exports.EntityEditorList = exports.EntityEditorItem = undefined;

var _EntityEditorItem = require('./EntityEditorItem');

var _EntityEditorItem2 = _interopRequireDefault(_EntityEditorItem);

var _EntityEditorList = require('./EntityEditorList');

var _EntityEditorList2 = _interopRequireDefault(_EntityEditorList);

var _EntityEditorRouter = require('./EntityEditorRouter');

var _Config = require('./Config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EntityEditorItem = _EntityEditorItem2.default;
exports.EntityEditorList = _EntityEditorList2.default;
exports.EntityEditorRouter = EntityEditorRouter;
exports.createEditorRoutes = _EntityEditorRouter.createEditorRoutes;
exports.wrapListComponent = _EntityEditorRouter.wrapListComponent;
exports.wrapItemComponent = _EntityEditorRouter.wrapItemComponent;
exports.mergeConfig = _Config.mergeConfig;