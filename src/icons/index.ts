// 读取 bootstrap-icons 中的icon列表
// const svgFiles = require.context('bootstrap-icons/icons', true, /\.svg$/);
const svgFiles = require.context('@/icons/svg', true, /\.svg$/);
const iconList = svgFiles.keys().map(item => svgFiles(item));
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);

/* console.log(svgFiles);
console.log(svgFiles.id);
console.log(iconList); */
requireAll(svgFiles);
