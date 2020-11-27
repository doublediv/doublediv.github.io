function tpl2html(template, templateObject){
    return template().replace(/\{\{(.*?)\}\}/g, (node, key) => {
        return templateObject[key.trim()];
    })

}