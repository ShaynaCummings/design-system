// @preval

// TODO: is there a bug here where I have to build twice to get *.dist.js in src to move to dist?

const babel = require('babel-core')
const camelize = require('camelize')
const fs = require('fs')
const path = require('path')
const React = require('react')

const dirPath = path.join(__dirname, '..', 'svg')
const fileNames = fs.readdirSync(dirPath)

module.exports = fileNames.reduce((acc, fileName) => {
  if (path.extname(fileName) !== '.svg') return acc

  const filePath = path.join(dirPath, fileName)
  const outputFileName = fileName + '.dist.js'
  const outputFilePath = path.join(__dirname, outputFileName)

  fs.writeFileSync(
    outputFilePath,
    'module.exports = function (React) { return (' +
      babel
        .transformFileSync(filePath, { presets: ['react'] })
        .code.replace('"use strict";', '')
        .replace(';', '') +
      ') }'
  )

  const id = camelize(fileName.split('.')[0])
  acc[id] = require('./' + outputFileName)
  return acc
}, {})
