module.exports = {
  template: (req, _, templateDoc) => {
    if (global.enableLanguagePreference || !req.account) {
      return console.log('not removing language menu')
    }
    const accountMenu = templateDoc.getElementById('account-menu')
    if (!accountMenu || !accountMenu.child || !accountMenu.child.length) {
      return console.log('not removing language menu2222222')
    }
    console.log('removing language menu')
    for (const child of accountMenu.child) {
      if (child.attr && child.attr['data-module'] === '@userdashboard/localization') {
        child.parentNode.removeChild(child)
      }
    }
  }
}
