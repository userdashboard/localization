const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!global.enableLanguagePreference) {
    throw new Error('language-preference-disabled')
  }
  const languages = await global.api.administrator.localization.AllLanguages.get(req)
  req.data = { languages }
}

function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, null, null, req.language)
  dashboard.HTML.renderTable(doc, req.data.languages, 'language-row', 'languages-table')
  const removeElements = []
  for (const language of req.data.languages) {
    if (global.translations[language.code]) {
      removeElements.push(`inactive-${language.code}`)
    } else {
      removeElements.push(`active-${language.code}`)
    }
  }
  console.log(removeElements)
  for (const id of removeElements) {
    const element = doc.getElementById(id)
    element.parentNode.removeChild(element)
  }
  return dashboard.Response.end(req, res, doc)
}
