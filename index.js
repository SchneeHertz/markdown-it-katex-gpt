import katex from 'katex'

const defaultOptions = {
  delimiters: [
    { left: '\\[', right: '\\]' },
    { left: '\\(', right: '\\)' }
  ]
}

function escapedBracketRule(options) {
  return (state, silent) => {
    const max = state.posMax
    let start = state.pos

    for (let { left, right } of options.delimiters) {
      // 检查是否以左标记开始
      if (!state.src.slice(start).startsWith(left)) {
        continue
      }
      let pos = start + left.length // 跳过左标记的长度
      while (pos < max) {
        if (state.src.slice(pos).startsWith(right)) {
          break
        }
        pos++
      }
      if (pos >= max) continue // 没找到匹配的右标记

      if (!silent) {
        const content = state.src.slice(start + left.length, pos)
        try {
          const renderedContent = katex.renderToString(content, {
            throwOnError: false,
            output: 'mathml'
          })
          const token = state.push('html_inline', '', 0)
          token.content = renderedContent
        } catch (e) {
          console.error(e)
        }
      }

      state.pos = pos + right.length // 跳过右标记的长度
      return true
    }
  }
}

export default function (md, options = defaultOptions) {
  md.inline.ruler.after('text', 'escaped_bracket', escapedBracketRule(options))
}