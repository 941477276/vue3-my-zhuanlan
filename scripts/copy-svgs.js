const path = require('path');
const fs = require('fs');

function writeFileSync (targetPath, content) {
  let targetDirname = path.dirname(targetPath);
  // 如果目标文件所在文件夹不存在，则先创建文件夹
  if (!fs.existsSync(targetDirname)) {
    mkdir(targetDirname);
  }
  fs.writeFileSync(targetPath, content);
}

function copy (sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`[copy failed]: "${sourcePath}" not exist!`);
    return;
  }
  let targetDirname = path.dirname(targetPath);
  // 如果目标文件所在文件夹不存在，则先创建文件夹
  if (!fs.existsSync(targetDirname)) {
    mkdir(targetDirname);
  }
  fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf-8'));
}

function mkdir (targetPath) {
  if (fs.existsSync(targetPath)) {
    return;
  }
  fs.mkdirSync(targetPath, { recursive: true });
}

// 目标存放svg根目录
const targetSvgRootDir = path.resolve(__dirname, '../svg');
function copySvgs () {
  const bootstrapIconsVersion = require('bootstrap-icons/package.json').version;
  let oldBootstrapIconsVersionPath = path.resolve(targetSvgRootDir, 'bootstrap-icons-version.json');
  let oldBootstrapIconsVersion = fs.existsSync(oldBootstrapIconsVersionPath) ? require(oldBootstrapIconsVersionPath).version : '';
  if (oldBootstrapIconsVersion === bootstrapIconsVersion) {
    console.warn('[Tip]: The old and new bootstrap icons are consistent and will not be updated');
    return;
  }
  // console.log('bootstrapIconsVersion', bootstrapIconsVersion);
  let bootstrapIconsDir = 'node_modules/bootstrap-icons/icons';
  let bootstrapIconNames = fs.readdirSync(bootstrapIconsDir);
  // console.log('bootstrapIconNames', bootstrapIconNames);
  bootstrapIconNames.forEach(function (svgFullName) {
    let svgName = path.parse(svgFullName).name;
    let isFilled = svgName.endsWith('-fill');
    let svgContent = fs.readFileSync(bootstrapIconsDir + '/' + svgFullName, 'utf-8');
    let svgJson = {
      name: svgName,
      isFilled,
      fullContent: svgContent,
      childrenContent: ''
    };
    // 移除svg内容中的 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="xxx" viewBox="0 0 16 16"> 部分
    let childrenContent = svgContent.replace(/<svg .+>?/, '');
    // 移除svg内容中的 </svg> 部分
    childrenContent = childrenContent.replace('</svg>', '');
    // 移除换行符
    childrenContent = childrenContent.replace('\r\n', '');
    // 移除两端空格
    childrenContent = childrenContent.trim();
    svgJson.childrenContent = childrenContent;

    let writeToTargetDir = path.resolve(targetSvgRootDir, isFilled ? 'filled' : 'outlined');
    let jsFileContent = `module.exports = ${JSON.stringify(svgJson, null, 2)};`;
    writeFileSync(path.resolve(writeToTargetDir, svgFullName), svgContent);
    writeFileSync(path.resolve(writeToTargetDir, svgName + '.js'), jsFileContent);
  });
  // 写入bootstrap图标版本
  fs.writeFileSync(oldBootstrapIconsVersionPath, JSON.stringify({
    version: bootstrapIconsVersion
  }, null, 2), 'utf-8');
}

copySvgs();

// console.log(path.parse('0-circle.svg').name);
