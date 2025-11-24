import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig =  {
 // 测试文件的匹配规则
  testMatch: 'test_cases/*.spec.js',
  // 测试超时时间（毫秒）
  timeout: 60000,
  // 测试用例的重试次数
  retries: 0,
//   // 测试用例的执行顺序
//   testOrder: 'random',
  // 是否使用并行测试（Electron 应用通常不支持多实例，设为 1 保证串行执行）
  workers: 1,
  // 测试用例的分组
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 浏览器上下文的选项
        contextOptions: {
          // 浏览器上下文的视口大小
          viewport: { width: 1920, height: 1080 },
        },
        // 浏览器的启动选项
        launchOptions: {
          // 是否以无头模式运行
          headless:false,
           // 浏览器的慢速模式
          slowMo: 50,
        },
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     contextOptions: {
    //       viewport: { width: 1920, height: 1080 },
    //     },
    //     launchOptions: {
    //       headless: false,
    //       slowMo: 50,
    //     },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     contextOptions: {
    //       viewport: { width: 1920, height: 1080 },
    //     },
    //     launchOptions: {
    //       headless: false,
    //       slowMo: 50,
    //     },
    //   },
    // },
  ],
  // // 测试用例的钩子函数
  // setupFiles: ['path/to/setup-file.ts'],
  // // 测试用例的报告生成器
  // reporter: [
  //   ['html', { open: 'never' }],
  //   ['list'],
  //   ['json', { outputFile: 'test-results.json' }],
  // ],
  // 测试用例的输出目录
  outputDir: 'test-results',
  // 测试用例的全局变量
  // globals: {
  //   myGlobalVariable: 'Hello, World!',
  // },
};

export default config;