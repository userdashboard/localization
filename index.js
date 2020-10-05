global.enableLanguagePreference = process.env.ENABLE_LANGUAGE_PREFERENCE || false
global.language = process.env.LANGUAGE || 'en'
global.languages = []
global.translations = {}

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
      return a.code.toLowerCase() > b.code.toLowerCase() ? 1 : -1
    })
    module.exports.languageList = languageList
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
    const languages = await module.exports.StorageList.listAll('activeLanguages')
    if (languages && languages.length) {
      for (const object of languageList) {
        if (languages.indexOf(object.code) > -1) {
          global.languages.push(object)
          global.translations[object.code] = require(`./translation-cache-${object.code}.json`)
        }
      }
    }
  }
}
