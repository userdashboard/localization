const dashboard = require('@userdashboard/dashboard')
const navbar = require('./navbar-language.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.languageid) {
    throw new Error('invalid-languageid')
  }
  const language = await global.api.administrator.localization.Language.get(req)
  req.data = { language }
}

async function renderPage (req, res, messageTemplate) {
  console.log(3)
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  console.log(messageTemplate)
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.language, 'language', req.language)
  navbar.setup(doc, req.data.language)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
    }
    return dashboard.Response.end(req, res, doc)
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (req.query && req.query.message === 'success') {
    return renderPage(req, res)
  }
  try {
    await global.api.administrator.localization.SetLanguageActive.patch(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?languageid=${req.query.languageid}&message=success`
    })
    return res.end()
  }
}
