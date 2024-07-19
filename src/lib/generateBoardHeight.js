export const makeHeights = ({ elementHeight, layout }) => {
    let heights = []
    let index = 0
    if (!elementHeight) return
    const generateHeight = (count) => {
        const baseHeight = Math.floor(elementHeight / count)
        const random = Math.random()
        const negative = random < 0.5 ? -1 : 1
        const addition = random * Math.round(90 / count) * negative
        return Math.round(baseHeight + addition)
    }

    for (let i = 0; i < layout.length; i++) {
        let rowHeights = []
        let rows = layout[i]
        let top = 0
        for (let j = 0; j < rows - 1; j++) {
            index++
            const height = generateHeight(rows)
            rowHeights.push({ id: index, height: height, top: top })
            top += height
        }
        index++
        const lastHeight = { id: index, height: (Math.floor(elementHeight - rowHeights.reduce((acc, curr) => acc + curr.height, 0)) - 7), top: top }
        rowHeights.push(lastHeight)
        heights.push(rowHeights)
    }
    return heights
}