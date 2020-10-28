module.exports = {
  get: renderPage
}

async function renderPage (req, res) {
  if (!req.query || !req.query.languageid) {
    throw new Error('invalid-languageid')
  }
  const translation = await global.api.administrator.localization.Translation.get(req)
  res.setHeader('content-type', 'text/json')
  res.setHeader('content-disposition', `attachment; filename=translation-cache-${req.query.languageid}.json`)
  res.end(JSON.stringify(translation, null, ' '))
}
