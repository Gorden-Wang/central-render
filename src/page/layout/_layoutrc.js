module.export = {
    name:'',// package.json.name
    version: '',// package.json.version
    data: {}, // 页面配置信息，从layout/mock.json而来
    assets: {
        css: [], // 页面依赖的css  从component提取出来
        js: [], // 页面依赖的js 从component提取出来
    },
    componentMetas: [
        { // 组件的meta信息，从components/{xxx}/config.json提取而来
            componentId: '',
            data: {},
            html: '',
            name: '',
            version: '',
        }
    ]

}