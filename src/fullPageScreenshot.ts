import Jimp from 'jimp'
import merge from 'merge-img'

const pageDown = async (page: any) => {
  const isEnd = await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight)
    return (
      window.scrollY >=
      document.documentElement.scrollHeight - window.innerHeight
    )
  })

  return isEnd
}

const defaultOptions = {
  fullPage: false,
  captureBeyondViewport: false,
  type: 'png',
  delay: 0,
}

export const fullPageScreenshot = async (page: any, options = {}) => {
  const { pagesCount, extraPixels, viewport } = await page.evaluate(() => {
    window.scrollTo(0, 0)
    const pageHeight = document.documentElement.scrollHeight
    return {
      pagesCount: Math.ceil(pageHeight / window.innerHeight),
      extraPixels: (pageHeight % window.innerHeight) * window.devicePixelRatio,
      viewport: {
        height: window.innerHeight * window.devicePixelRatio,
        width: window.innerWidth * window.devicePixelRatio,
      },
    }
  })

  const { path, delay, ...pptrScreenshotOptions } = {
    ...defaultOptions,
    ...options,
  } as any

  const images = []
  for (let index = 0; index < pagesCount; index += 1) {
    if (delay) {
      await page.waitForTimeout(delay)
    }
    const image = await page.screenshot({
      type: 'jpeg',
      path: `pc-${index}.jpeg`,
      fullPage: false,
    })
    await pageDown(page)
    images.push(image)
  }

  if (pagesCount === 1) {
    const image = await Jimp.read(images[0])
    if (path) image.write(path)
    return image
  }

  console.log(1)

  // crop last image extra pixels
  // const cropped = await Jimp.read(images.pop())
  //   .then((image) =>
  //     image.crop(0, viewport.height - extraPixels, viewport.width, extraPixels)
  //   )
  //   .then((image) => image.getBufferAsync(Jimp.AUTO.toString()))

  console.log(2)

  // images.push(cropped)
  const mergedImage = await merge(images, { direction: true })

  console.log(3)

  if (path) {
    return new Promise((resolve) => {
      mergedImage.write(path, () => {
        resolve(true)
      })
    })
  }

  console.log(4)

  return mergedImage
}
