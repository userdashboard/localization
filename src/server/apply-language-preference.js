module.exports = {
    after: (req) => {
        if (global.enableLanguagePreference) {
            req.language = req.account ? req.accountlanguage : global.language || 'en'
        } else {
            req.language = global.language || 'en'
        }
        if (req.language === 'en') {
            return
        }
        if (req.route) {
            // perform substitution on route 
        }
        // perform substition on template
    }
}
