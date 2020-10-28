module.exports = {
  template: (_, templateDoc) => {
    if (global.enableLanguagePreference) {
      return
    }
    const accountMenu = templateDoc.getElementById('account-menu')
    for (const child of accountMenu.child) {
      if (child.attr && child.attr['data-module'] === '@userdashboard/localization') {
        child.parentNode.removeChild(child)
      }
    }
  }
}
