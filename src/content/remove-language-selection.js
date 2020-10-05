module.exports = {
  template: (req, templateDoc) => {
    if (global.enableLanguagePreference) {
      return
    }
    const accountMenu = templateDoc.getElementById('account-menu')
    for (const child of accountMenu.child) {
      if (child.attr && child.attr.module === '@userdashboard/localization') {
        child.parentNode.removeChild(child)
      }
    }
  }
}
