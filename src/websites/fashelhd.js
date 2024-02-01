const { By } = require("selenium-webdriver");

async function scrapeWebsiteFashelHD(driver, query) {
  try {
    // Open the website
    await driver.get("https://www.faselhd.center/");

    const searchBtn = await driver.findElement(
      By.xpath('//*[@id="searchBtn"]')
    );
    if (!searchBtn) {
      await driver.navigate().refresh();
    }
    searchBtn.click();

    const searchBar = await driver.findElement(
      By.xpath('//*[@id="dtc_live_search"]')
    );

    searchBar.sendKeys(`${query}`);

    const searchSubmit = await driver.findElement(
      By.xpath('//*[@id="searchsubmit"]')
    );
    searchSubmit.click();

    await driver.sleep(3000);

    const movieCard = await driver.findElement(
      By.xpath(`//*[@id="postList"]/div[1]`)
    );
    movieCard.click();

    await driver.sleep(3000);

    const movieTitleElement = await driver.findElement(
      By.className("h1 title")
    );

    // Get the text content of the element
    let movieTitle = await movieTitleElement.getText();

    // Filter out non-English alphanumeric characters
    movieTitle = movieTitle.replace(/[^A-Za-z0-9\s]/g, "");

    // Remove newline characters and digits
    movieTitle = movieTitle.replace(/\n\d+/g, "");

    const downloadBox = await driver.findElement(
      By.xpath(`//*[@id="streamBox"]/div[2]/div[3]/div/a`)
    );

    const hrefAttribute = await downloadBox.getAttribute("href");

    console.log("Movie Title:", movieTitle);
    console.log("Movie Download Link:", hrefAttribute);

    return {
      movieTitle: movieTitle,
      downloadLink: hrefAttribute,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = scrapeWebsiteFashelHD;
