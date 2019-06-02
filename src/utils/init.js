// 设置根元素的字体尺寸
const setFontSize = () => {
	//基准字体尺寸, 基准宽度
	const fontSize = 10,
		baseSize = 375
	const width = window.innerWidth || document.documentElement.clientWidth
	const html = document.getElementsByTagName('html')[0]
	html.style.fontSize = `${width / baseSize * fontSize}px`
}

setFontSize()
// 解决IOS:active伪类无效
document.body.addEventListener('touchstart', () => {})
window.addEventListener('resize', setFontSize)
