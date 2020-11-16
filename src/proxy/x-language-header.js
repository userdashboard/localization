module.exports = async (req, proxyRequestOptions) => {
  const accountLanguage = req.account ? req.account.languageid : null
  proxyRequestOptions.headers = proxyRequestOptions.headers || {}
  proxyRequestOptions.headers['x-language'] = req.language || accountLanguage || global.language || 'en'
}
