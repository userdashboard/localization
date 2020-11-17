module.exports = {
  setup: (doc, language) => {
    const template = doc.getElementById('navbar')
    console.log('setting up language navbar', language)
    if (language.active) {
      const activeLink = template.getElementById('navbar-active')
      activeLink.parentNode.removeChild(activeLink)
    } else {
      const inactiveLink = template.getElementById('navbar-inactive')
      inactiveLink.parentNode.removeChild(inactiveLink)
    }
  }
}
