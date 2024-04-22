import MarkdownIt from 'markdown-it'
import markdownItKatexGpt from './index.js'
import fs from 'fs/promises'

const md = new MarkdownIt()
md.use(markdownItKatexGpt, {
  delimiters: [
    { left: '\\[', right: '\\]' },
    { left: '\\(', right: '\\)' },
    { left: '$$', right: '$$' }
  ]
})

let testString = `呀，让我来帮你解释一下万有引力公式喵！\n\n
万有引力公式是由艾萨克·牛顿提出的，它描述了两个物体之间因为质量而相互吸引的力。这个公式可以表示为：\n\n
\\[ F = G \\frac{{m_1 \\times m_2}}{{r^2}} \\]\n\n
其中：\n
- \\( F \\) 表示两物体之间的引力（单位是牛顿，N）\n
- \\( G \\) 是万有引力常数，大约为 $$ 6.674 \\times 10^{-11} \\, \\text{Nm}^2/\\text{kg}^2 $$\n
- \\( m_1 \\) 和 \\( m_2 \\) 是两个物体的质量（单位是千克，kg）\n
- \\( r \\) 是两物体之间的距离（单位是米，m）\n\n
这个公式告诉我们，两个物体的引力与它们的质量成正比，与它们之间距离的平方成反比。
这就是为什么，即使地球和月球之间的距离很远，它们之间仍然有引力相互作用，使得月球围绕地球旋转喵！`

let result = md.render(testString)
fs.writeFile('test-result.html', `
<!DOCTYPE html>
<html lang="en">
  <body>
    ${result}
  </body>
</html>
`)