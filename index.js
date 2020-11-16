global.enableLanguagePreference = process.env.ENABLE_LANGUAGE_PREFERENCE || false
global.language = process.env.LANGUAGE || 'en'

module.exports = {
  setup: async () => {
    const fs = require('fs')
    let languageList
    if (fs.existsSync(`${global.applicationPath}/languages.json`)) {
      languageList = require(`${global.applicationPath}/languages.json`)
    } else {
      languageList = require('./languages.json')
    }
    languageList.sort((a, b) => {
      return a.languageid.toLowerCase() > b.languageid.toLowerCase() ? 1 : -1
    })
    module.exports.languageList = languageList
    if (process.env.LOCALIZATION_STORAGE) {
      console.log(1)
      const Storage = require('@userdashboard/dashboard/src/storage.js')
      const storage = await Storage.setup('LOCALIZATION')
      const StorageList = require('@userdashboard/dashboard/src/storage-list.js')
      const storageList = await StorageList.setup(storage, 'LOCALIZATION')
      const StorageObject = require('@userdashboard/dashboard/src/storage-object.js')
      const storageObject = await StorageObject.setup(storage, 'LOCALIZATION')
      module.exports.Storage = storage
      module.exports.StorageList = storageList
      module.exports.StorageObject = storageObject
    } else {
      console.log(2)
      const dashboard = require('@userdashboard/dashboard')
      console.log(dashboard)
      module.exports.Storage = dashboard.Storage
      module.exports.StorageList = dashboard.StorageList
      module.exports.StorageObject = dashboard.StorageObject
    }
    console.log(module.exports.Storage)
  }
}
