module.exports = async (req, proxyRequestOptions) => {
  proxyRequestOptions.headers['x-language'] = req.language || global.language || 'en'
}
