import katex from 'katex'

const defaultOptions = {
  delimiters: [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ]
}

function escapedBracketRule(options) {
  return (state, silent) => {
    const max = state.posMax
    const start = state.pos

    for (const { left, right, display } of options.delimiters) {

      // 检查是否以左标记开始
      if (!state.src.slice(start).startsWith(left)) continue

      // 跳过左标记的长度
      let pos = start + left.length

      // 寻找匹配的右标记
      while (pos < max) {
        if (state.src.slice(pos).startsWith(right)) {
          break
        }
        pos++
      }

      // 没找到匹配的右标记，跳过，进入下个匹配
      if (pos >= max) continue

      // 如果不是静默模式，将 LaTeX 公式转换为 MathML
      if (!silent) {
        const content = state.src.slice(start + left.length, pos)
        try {
          const renderedContent = katex.renderToString(content, {
            throwOnError: false,
            output: 'mathml',
            displayMode: display
          })
          const token = state.push('html_inline', '', 0)
          token.content = renderedContent
        } catch (e) {
          console.error(e)
        }
      }

      // 更新位置，跳过右标记的长度
      state.pos = pos + right.length
      return true
    }
  }
}

export default function (md, options = defaultOptions) {
  md.inline.ruler.after('text', 'escaped_bracket', escapedBracketRule(options))
}