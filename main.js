(async () => {
  require('./index.js')
  const dashboard = require('@userdashboard/dashboard')
  await dashboard.start(__dirname)
})()
