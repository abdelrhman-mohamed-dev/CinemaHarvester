const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function configureBrowser() {
  const options = new chrome.Options();
  // Add any desired browser configurations here
  options.addExtensions("./uBlock-Origin.crx");

  // Set Chrome to run in headless mode
  options.addArguments("--headless");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  // await driver.sleep(10000);

  let i = 0;
  const interval = setInterval(() => {
    if (i >= 10) {
      clearInterval(interval);
      console.log(`\nProgress complete!`);
      return;
    }
    i++;
    console.clear();
    const progress = `[${"==".repeat(i)}${" ".repeat(10 - i)}]`;
    console.log(progress);
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    console.clear();
    console.log("Browser is ready to go <3");
  }, 10000);

  return driver;
}

module.exports = configureBrowser;
