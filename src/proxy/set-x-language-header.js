module.exports = async (req, proxyRequestOptions) => {
    proxyRequestOptions.headers.language = req.language || global.language || 'en'
}