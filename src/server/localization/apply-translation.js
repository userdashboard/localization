const fs = require('fs')
const path = require('path')

module.exports = {
  after: async (req) => {
    let language
    if (global.enableLanguagePreference) {
      language = req.account ? req.account.languageid : null
    }
    language = language || global.language || 'en'
    if (language === 'en') {
      return
    }
    // perform substition on template
    const queryWas = req.query
    req.query = {
      languageid: language
    }
    const translation = await global.api.user.localization.Translation.get(req)
    // perform substition on template
    const packageJSON = req.packageJSON || global.packageJSON
    const templateHTML = req.templateHTML || packageJSON.templateHTML
    req.templateHTML = applyTranslation(translation, '/src/template.html', templateHTML)
    if (req.route && req.route.html) {
      const filePath = req.route.htmlFilePath.substring(req.route.htmlFilePath.indexOf('/src'))
      req.html = applyTranslation(translation, filePath, req.route.html)
      if (req.html.indexOf('data-navbar') > -1) {
        let navbar = req.html.split(' data-navbar="')[1]
        navbar = navbar.substring(0, navbar.indexOf('"'))
        let navbarPath = path.join(global.rootPath, navbar)
        if (!fs.existsSync(navbarPath)) {
          navbarPath = path.join(global.applicationPath, `node_modules/@userdashboard/dashboard/src/www${navbar}`)
          if (!fs.existsSync(navbarPath)) {
            for (const moduleName of global.packageJSON.dashboard.moduleNames) {
              navbarPath = `${global.applicationPath}/node_modules/${moduleName}/src/www${navbar}`
              if (fs.existsSync(navbarPath)) {
                break
              }
              navbarPath = null
            }
          }
        }
        if (navbarPath) {
          const navbarHTML = fs.readFileSync(navbarPath).toString()
          if (navbarHTML) {
            const html = applyTranslation(translation, navbarPath.substring(navbarPath.indexOf('/src')), navbarHTML)
            req.html = req.html.replace('data-navbar', 'localized-navbar')
            req.html = req.html.replace('</head>', `<template id="navbar">${html}</template>`)
          }
        }
      }
    }
    req.query = queryWas
  }
}

function applyTranslation (translation, url, html) {
  for (const phrase in translation) {
    const data = translation[phrase]
    if (!data.file || !data.file.length) {
      continue
    }
    for (const i in data.file) {
      const file = data.file[i]
      if (file !== url) {
        continue
      }
      const tag = data.html[i]
      const correction = data.corrections ? data.corrections[i] : null
      const newTag = tag.replace(phrase, correction || data.translation)
      html = html.replace(tag, newTag)
    }
  }
  return html
}
