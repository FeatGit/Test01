/**
 * Parsa il testo e ritorna un array di token.
 * @param {string} text
 * @returns {{ type: 'text'|'mention', value: string }[]}
 */
export function parseMentions(text) {
  const tokens = []
  const regex = /@(\w+)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    tokens.push({ type: 'mention', value: match[1] })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return tokens
}
