const path = require('path');
function resolve(dirPath) {
  return path.resolve(__dirname, dirPath);
}
module.exports = {
  devServer: {
    open: true, // 默认打开浏览器
    proxy: {
      '/viking': {
        target: 'http://api.vikingship.xyz',
        pathRewrite: { '^/viking': '' },
        changeOrigin: true
      }
    }
  },
  publicPath: './',
  chainWebpack: config => {
    // 获取svg文件名称正则
    let svgNameReg = /([\w-]+)(\.\w*)*\.svg$/;
    config.module
      .rule('svg')
      // .exclude.add(resolve('bootstrap-icons/icons'))
      .exclude.add(resolve('./src/icons/svg')) // 从作为普通图片使用的svg规则中移除，因为这些svg是作为图标使用的
      .end();
    console.log('进入了chainWebpack');

    config.module
      .rule('icons')
      .test(/\.svg$/)
      // .include.add(resolve('bootstrap-icons/icons'))
      .include.add(resolve('./src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        /* symbolId: filePath => {
          console.log(filePath.match(svgNameReg));
          let svgName = filePath.match(svgNameReg)[1];
          return `bsicon-${svgName}`;
        } */
        symbolId: 'bsicon-[name]'
      })
      .end();
  },
  configureWebpack: config => {

  }
};
