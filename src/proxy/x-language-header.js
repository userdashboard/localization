module.exports = async (req, proxyRequestOptions) => {
  const accountLanguage = req.account ? req.account.languageid : null
  proxyRequestOptions.headers['x-language'] = accountLanguage || global.language || 'en'
}
