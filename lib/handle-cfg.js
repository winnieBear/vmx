var path = require('path')
var fs = require('fs')
var utilx = require('utilx')

var logger = require('./logger')

var defCfg = {
  encoding: 'utf8'
}

module.exports = function(cfg) {
  // logger.debug('Raw config', cfg)
  var globCfg = utilx.readJSON(path.join(utilx.home, '.velocity'))
  cfg = utilx.mix(cfg, globCfg, defCfg)
  // logger.debug('Merged config', cfg)

  checkRequired(cfg, ['root', 'template'])

  if (utilx.isString(cfg.root)) cfg.root = [cfg.root]
  cfg.root.forEach(function(p, idx){
    if (!utilx.isExistedDir(p)) {
      logger.error('cfg.root[%d] <%s> is not directory or not exists.', idx, p)
    }
  })
  cfg.root = cfg.root.map(function(p) {
    return path.resolve(p)
  })

  cfg.template = str2Obj(cfg.template)

  if (cfg.macro) {
    if (utilx.isString(cfg.macro)) cfg.macro = [cfg.macro]
    cfg.macro = cfg.macro.map(function(raw) {
      return str2Obj(raw)
    })
  }

  // logger.debug('Processed config', cfg)
  return cfg
}

function checkRequired(cfg, requiredList) {
  requiredList.forEach(function(key) {
    if (!(key in cfg)) {
      logger.error('cfg.%s is required.', key)
    }
  })
}

function str2Obj(raw) {
  if (utilx.isExistedFile(raw)) {
    return {
      isFile: true,
      raw: raw,
      fullPath: path.resolve(raw)
    }
  } else {
    return {
      isFile: false,
      raw: raw
    }
  }
}
