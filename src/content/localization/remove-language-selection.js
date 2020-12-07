module.exports = {
  template: (req, _, templateDoc) => {
    if (global.enableLanguagePreference || !req.account) {
      return
    }
    const accountMenu = templateDoc.getElementById('account-menu')
    if (!accountMenu || !accountMenu.child || !accountMenu.child.length) {
      return
    }
    for (const child of accountMenu.child) {
      if (child.attr && child.attr['data-module'] === '@userdashboard/localization') {
        child.parentNode.removeChild(child)
      }
    }
  }
}
