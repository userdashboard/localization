const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!global.enableLanguagePreference) {
    throw new Error('language-preference-disabled')
  }
  const languages = await global.api.user.localization.Languages.get(req)
  req.data = { languages }
}

function renderPage (req, res, messageTemplate) {
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  const doc = dashboard.HTML.parse(req.html || req.route.html)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
  }
  if (req.data.languages && req.data.languages.length) {
    dashboard.HTML.renderList(doc, req.data.languages, 'language-option', 'languageid')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body || !req.body.languageid) {
    return renderPage(req, res)
  }
  let found = false
  for (const language of req.data.languages) {
    found = language.languageid === req.body.languageid
    if (found) {
      break
    }
  }
  if (!found) {
    return renderPage(req, res, 'invalid-languageid')
  }
  try {
    req.query = req.query || {}
    req.query.accountid = req.account.accountid
    await global.api.user.localization.SetAccountLanguage.patch(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?message=success`
    })
    return res.end()
  }
}
