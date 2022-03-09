module.exports = {
  configureWebpack: config => {
    config.resolve.extensions.push('.js');
    // config.resolve.extensions.push('.ts')
  }
};
