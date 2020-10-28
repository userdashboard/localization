const dashboard = require('@userdashboard/dashboard')
const navbar = require('./navbar-language.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest(req) {
  if (!req.query || !req.query.languageid) {
    throw new Error('invalid-languageid')
  }
  const language = await global.api.administrator.localization.Language.get(req)
  const translation = await global.api.administrator.localization.Translation.get(req)
  const phrases = []
  for (const phrase in translation) {
    translation[phrase].object = 'phrase'
    translation[phrase].id = phrases.length + 1
    translation[phrase].languageid = req.query.languageid
    phrases.push(translation[phrase])
  }
  req.data = { language, phrases }
}

async function renderPage(req, res) {
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.language, 'language', req.language)
  navbar.setup(doc, req.data.language)
  const removeElements = []
  if (req.data.language.active) {
    removeElements.push('inactive')
  } else {
    removeElements.push('active')
  }
  dashboard.HTML.renderTable(doc, req.data.phrases, 'phrase-row', 'phrases-table')
  for (const phrase of req.data.phrases) {
    if (!phrase.corrections || !phrase.corrections.length) {
      removeElements.push(`corrected-${phrase.id}`)
    } else {
      removeElements.push(`not-corrected-${phrase.id}`)
    }
  }
  for (const id of removeElements) {
    const element = doc.getElementById(id)
    element.parentNode.removeChild(element)
  }
  return dashboard.Response.end(req, res, doc)
}
