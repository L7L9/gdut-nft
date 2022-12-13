// 获取图片底部主色调的反转颜色
export const getmainColor = (src) => {
    const image = new Image();
    image.src=src
    image.onload = () => {
        const { width, height } = image
        const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const scaleRect = width * height * 0.2
            let [sum_r, sum_g, sum_b, color] = new Array(4).fill(null)

            canvas.width = width
            canvas.height = height * 0.2
            ctx.drawImage(image, 0, -height * 0.8)

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < imgData.data.length; i += 4) {
                sum_r += imgData.data[i]
                sum_g += imgData.data[i + 1]
                sum_b += imgData.data[i + 2]
            }

          if (sum_r * 0.299 + sum_g * 0.587 + sum_b * 0.114 >= 192 * scaleRect) {
            color = '#000'
            } else {
                color = '#fff'
            }

            document.documentElement.style.setProperty('--invert-main-color', color)

    }
}