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
  if (!req.query.text) {
    throw new Error('invalid-text')
  }
  const language = await global.api.administrator.localization.Language.get(req)
  const translation = await global.api.administrator.localization.Translation.get(req)
  let phrase
  for (const text in translation) {
    if (text !== req.query.text) {
      continue
    }
    phrase = translation[text]
    phrase.object = 'phrase'
    phrase.id = 1
    phrase.languageid = req.query.languageid
    break
  }
  if (!phrase) {
    throw new Error('invalid-text')
  }
  const instances = []
  phrase.corrections = phrase.corrections || []
  language.text = req.query.text
  language.translation = phrase.translation
  language.textTrimmed = language.text.length > 50 ? language.text.substring(0, 40) + '...' : language.text
  for (const i in phrase.html) {
    instances[i] = {
      id: i.toString(),
      object: 'instance',
      file: phrase.file[i],
      fileTrimmed: phrase.file[i].substring('/src/www'.length, phrase.file[i].length - '.html'.length),
      module: phrase.module[i],
      html: encodeHTML(encodeHTML(phrase.html[i])),
      correction: phrase.corrections[i] || ''
    }
    if (instances[i].html.length > 80) {
      instances[i].htmlTrimmed = instances[i].html.substring(0, 70) + '...'
      if (instances[i].html.lastIndexOf('&') > instances[i].html.lastIndexOf(';')) {
        instances[i].htmlTrimmed = instances[i].html.substring(0, instances[i].lastIndexOf('&')) + '...'
      }
    } else {
      instances[i].htmlTrimmed = instances[i].html
    }
  }
  req.data = { language, phrase, instances }
}

async function renderPage (req, res, messageTemplate) {
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.language, 'language')
  navbar.setup(doc, req.data.language)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
    }
    return dashboard.Response.end(req, res, doc)
  }
  dashboard.HTML.renderTable(doc, req.data.instances, 'instance-row', 'instances-table')
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (req.query && req.query.message === 'success') {
    return renderPage(req, res)
  }
  try {
    await global.api.administrator.localization.CreatePhraseCorrections.post(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?languageid=${req.query.languageid}&text=${req.query.text}&message=success`
    })
    return res.end()
  }
}

function encodeHTML (str) {
  str = str.replace(' translate="yes"', '')
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
