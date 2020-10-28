const childProcess = require('child_process')
const fs = require('fs')
const projectPath = process.argv[3]
const HTML = require('server-html')
const path = require('path')
const util = require('util')
const translatingTags = []
const translatingTagsIndex = {}

const scanFiles = util.promisify((folder, callback) => {
  const folderPath = path.join(projectPath, folder, 'src')
  if (!fs.existsSync(folderPath)) {
    return callback(null, [])
  }
  const stdout = childProcess.execSync(`find ${folderPath} -type f -name "*.html"`)
  const files = stdout.toString().split('\n')
  return callback(null, files)
})

function scanElement (module, element, file, addedHTMLTags) {
  if (element && element.attr && element.attr.translate === 'yes') {
    let text
    if (element.child && element.child.length) {
      for (const child of element.child) {
        if (child.text) {
          text = child.text.trim()
          break
        }
      }
    }
    if (!text) {
      console.log('no text', element.toString(), file)
    }
    if (text.indexOf('${') > -1) {
      text = text.substring(0, text.indexOf('${'))
    }
    if (text.endsWith('\\n')) {
      text = text.substring(0, text.length - 2)
    }
    text = text.trim()
    const fileShort = file.substring(file.indexOf('/src'))
    if (translatingTagsIndex[text]) {
      translatingTagsIndex[text].file.push(fileShort)
      translatingTagsIndex[text].html.push(element.toString())
      translatingTagsIndex[text].module = translatingTagsIndex[text].module || []
      translatingTagsIndex[text].module.push(module.toString())
    } else {
      translatingTagsIndex[text] = {
        file: [fileShort],
        html: [element.toString()],
        text,
        module: [module],
        addedHTMLTags
      }
      translatingTags.push(translatingTagsIndex[text])
    }
  }
  if (!element || !element.child || !element.child.length) {
    return
  }
  for (const child of element.child) {
    scanElement(module, child, file, addedHTMLTags)
  }
}

module.exports = async () => {
  const projects = ['dashboard']
  const i = 1
  while (true) {
    if (process.env[`MODULE${i}`]) {
      projects.push(process.env[`MODULE${i}`])
    } else {
      break
    }
  }
  for (const project of projects) {
    const files = await scanFiles(project)
    for (const filePath of files) {
      if (!filePath.endsWith('.html')) {
        continue
      }
      let rawHTML = fs.readFileSync(filePath).toString()
      let addedHTMLTags = false
      if (rawHTML.indexOf('<html') === -1) {
        rawHTML = `<html>${rawHTML}</html>`
        addedHTMLTags = true
      }
      const doc = HTML.parse(rawHTML)
      scanElement(project, doc, filePath)
      const templates = doc.getElementsByTagName('template')
      if (templates && templates.length) {
        for (const template of templates) {
          scanElement(project, template.child, filePath, addedHTMLTags)
        }
      }
    }
  }
  fs.writeFileSync('./text-manifest.json', JSON.stringify(translatingTags, null, '  '))
  return translatingTags
}
