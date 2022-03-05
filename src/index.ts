import puppeteer from 'puppeteer'

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 1000, // slow down by 250ms
  })

  const page = await browser.newPage()
  page.setViewport({
    width: 1366,
    height: 768,
    deviceScaleFactor: 2,
  })

  // const mobilePage = await browser.newPage()
  // mobilePage.setViewport({
  //   width: 375,
  //   height: 667,
  // })

  await page.goto('https://www.vestaboard.com')
  // await mobilePage.goto('https://www.vestaboard.com')

  // find all a tags and get href attribute from each one
  const links = await page.$$('a')
  const hrefs = await Promise.all(links.map((link) => link.getProperty('href')))
  const hrefsArray = await Promise.all(hrefs.map((href) => href.jsonValue()))

  console.log(hrefsArray)

  // await page.waitForTimeout(500)

  // // slow scroll to bottom
  // await page.evaluate(() => {
  //   window.scrollTo(0, 1000)
  // })

  // await page.waitForTimeout(1000)

  // // scroll to top
  // await page.evaluate(() => {
  //   window.scrollTo(0, 0)
  // })

  // await page.waitForTimeout(1000)

  // await page.screenshot({ type: 'jpeg', path: 'example.jpeg', fullPage: false })

  // await fullPageScreenshot(page, { path: './page.jpeg', type: 'jpeg' })
  // await fullPageScreenshot(mobilePage, { path: './mobile.jpeg', type: 'jpeg' })

  await browser.close()
}

main()
