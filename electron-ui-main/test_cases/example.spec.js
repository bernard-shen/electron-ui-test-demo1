import { test, expect, _electron as electron } from '@playwright/test';
import { time } from 'console';
const path = require('path');
const { setTimeout: delay } = require('timers/promises');
const YamlConfig = require('../utils/yaml_reader.js');
const { loginToApp, selectSpaceAndRobot, createNewPlan, makeScreenShot } = require('./business.js');

// 1. 全局声明变量，确保所有钩子和测试用例可访问
let electronApp;
let page;

const configPath = path.join(__dirname, '../config/xpath.yaml');
const xpaths = new YamlConfig(configPath).getAll();

console.log('配置文件加载成功:');


test.beforeAll(async () => {
  try {
    const appPath = path.resolve('D:/app_install/st/st.exe');
    console.log(`[${new Date().toLocaleTimeString()}] 开始启动应用: ${appPath}`);
    
    // 监听应用输出日志，排查启动时的错误
    electronApp = await electron.launch({
      executablePath: appPath,
      timeout: 120000,
      env: { ...process.env, ELECTRON_ENABLE_LOGGING: '1'}, // 开启Electron日志
      args: [
        '--disable-updates' // 禁用更新检查（通用参数，部分应用支持）
      ]
    });
    
    console.log(`[${new Date().toLocaleTimeString()}] 应用进程已启动，等待窗口...`);
    page = await electronApp.firstWindow({ timeout: 60000 }); // 单独设置窗口等待超时
    // await page.setViewportSize({ width: 1920, height: 1080 });
    console.log(`[${new Date().toLocaleTimeString()}] 已获取主窗口`);
    await loginToApp(page, xpaths);

  } catch (launchError) {
    console.log(`[${new Date().toLocaleTimeString()}] 启动失败:`, launchError.message);
  }
});

test.afterAll(async () => {
  if (electronApp) { // 此时electronApp已在全局声明，可正常访问
    await electronApp.close();
  }
});

test.describe('测试集', () => {
  test('用例一：方案新建保存成功', async () => {
    if (!electronApp || !page) {
      test.skip('Electron 应用不可用，跳过 UI 测试');
      return;
    }

    const spaceName = 'KIRA_3C23011203';
    const robotName = 'BMW3RSZTJ251028No6'
    const planName = '测试方案' + Date.now();
 
    // 1、开始光学调试--空间、设备、光学调试；
    await selectSpaceAndRobot(page, xpaths, spaceName, robotName);
    
    // 2、点位列表新增点位--可选、保存方案--断言保存成功
    await createNewPlan(page, xpaths, planName);

    await delay(2000);
      
});

});