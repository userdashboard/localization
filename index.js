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
    const languageIndex = {}
    languageList.sort((a, b) => {
      languageIndex[a.languageid] = true
      languageIndex[b.languageid] = true
      return a.languageid.toLowerCase() > b.languageid.toLowerCase() ? 1 : -1
    })
    module.exports.languageList = languageList
    module.exports.languageIndex = languageIndex
    if (process.env.LOCALIZATION_STORAGE) {
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
      const dashboard = require('@userdashboard/dashboard')
      module.exports.Storage = dashboard.Storage
      module.exports.StorageList = dashboard.StorageList
      module.exports.StorageObject = dashboard.StorageObject
    }
  }
}
