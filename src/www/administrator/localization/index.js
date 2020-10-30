const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const languages = await global.api.administrator.localization.AllLanguages.get(req)
  const activeLanguages = await global.api.administrator.localization.ActiveLanguages.get(req)
  for (const language of languages) {
    for (const object of activeLanguages) {
      if (object.languageid === language.languageid) {
        language.active = true
        break
      }
    }
  }
  req.data = { languages }
}

function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.html || req.route.html)
  dashboard.HTML.renderTable(doc, req.data.languages, 'language-row', 'languages-table')
  const removeElements = []
  for (const language of req.data.languages) {
    if (language.active) {
      removeElements.push(`inactive-${language.languageid}`)
    } else {
      removeElements.push(`active-${language.languageid}`)
    }
  }
  console.log(removeElements)
  for (const id of removeElements) {
    const element = doc.getElementById(id)
    element.parentNode.removeChild(element)
  }
  return dashboard.Response.end(req, res, doc)
}
