const path = require('path');
const { setTimeout: delay } = require('timers/promises');

function makeScreenShot(page, picName) {
  page.screenshot({ path: path.join(__dirname, '../test-results/screenshots', `${picName}.png`) });
}

/**
 * Login to the application
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} xpaths - The xpath configuration object
 */
async function loginToApp(page, xpaths) {
  const loginButtonXPath = xpaths['登录']['登录按钮'];
  const loginButton = page.locator(loginButtonXPath);
  const isVisible = await loginButton.isVisible();
    
  if (!isVisible) {
    console.log('登录按钮不可见，等待元素出现...');
    await loginButton.waitFor({ state: 'visible', timeout: 6000 });
  }
    
  console.log('点击登录按钮...');
  await loginButton.click();
  console.log(`[${new Date().toLocaleTimeString()}] 登录操作完成...`);
  await delay(3000);
}

/**
 * Select space and robot
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} xpaths - The xpath configuration object
 * @param {string} spaceName - The name of the space to select
 * @param {string} robotName - The name of the robot to select
 */
async function selectSpaceAndRobot(page, xpaths, spaceName, robotName) {
  await page.locator((xpaths['目录']['收起展开'])).click();
  await delay(200);

  await page.locator((xpaths['空间管理']['空间列表-页码']).replace('{}', '6')).click();
  await page.locator((xpaths['空间管理']['空间名称']).replace('{}', spaceName)).click();
  await page.locator((xpaths['空间管理']['机器名称']).replace('{}', robotName)).click();
  await delay(2000);

  await page.locator(xpaths['空间管理']['光学调试']).click();
  await delay(10000);
}

/**
 * Create a new plan
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} xpaths - The xpath configuration object
 * @param {string} planName - The name of the plan to create
 */
async function createNewPlan(page, xpaths, planName) {
  console.log('开始新增方案: '+ planName);

  await page.locator(xpaths['空间管理']['点位列表']).waitFor({ state: 'visible' });
  await page.locator(xpaths['空间管理']['点位列表']).click();
  await page.locator(xpaths['空间管理']['保存方案历史']).click();
  await delay(2000);

  await page.locator(xpaths['空间管理']['方案名输入框']).fill(planName);
  makeScreenShot(page, 'plan_save_start');

  await page.locator(xpaths['空间管理']['方案名确认']).click();
  await delay(500);

  await page.locator(xpaths['空间管理']['保存成功提示']).isVisible();
  makeScreenShot(page, 'plan_save_success');
  console.log('方案保存成功: '+ planName);
}

module.exports = { loginToApp, selectSpaceAndRobot, createNewPlan, makeScreenShot };