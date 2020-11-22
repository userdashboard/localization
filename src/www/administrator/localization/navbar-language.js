module.exports = {
  setup: (doc, language) => {
    const template = doc.getElementById('navbar')
    if (language.active) {
      const activeLink = template.getElementById('navbar-active')
      activeLink.parentNode.removeChild(activeLink)
    } else {
      const inactiveLink = template.getElementById('navbar-inactive')
      inactiveLink.parentNode.removeChild(inactiveLink)
    }
  }
}
