export function mix(a: string, b: string, t: number) {
  const p = (h: string) => {
    const s = h.replace("#", "")
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) || 0)
  }
  const x = p(a)
  const y = p(b)
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")
}
