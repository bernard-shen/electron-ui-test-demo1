const fs = require('fs');
const yaml = require('js-yaml'); 

class YamlConfig {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.config = null;
    this.loadConfig();
  }

  // 加载并解析 YAML 配置文件
  loadConfig() {
    try {
      const configFile = fs.readFileSync(this.configFilePath, 'utf8');
      this.config = yaml.load(configFile);
    } catch (err) {
      console.error('Error loading config file:', err);
      this.config = {};
    }
  }

  // 获取配置项
  get(key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], this.config);
  }

  // 设置配置项
  set(key, value) {
    const parts = key.split('.');
    let current = this.config;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  // 保存配置到文件
  save() {
    try {
      const configYaml = yaml.dump(this.config);
      fs.writeFileSync(this.configFilePath, configYaml, 'utf8');
    } catch (err) {
      console.error('Error saving config file:', err);
    }
  }

  // 获取整个配置对象
  getAll() {
    return JSON.parse(JSON.stringify(this.config));
  }

  // 更新整个配置对象
  setAll(newConfig) {
    this.config = newConfig;
    this.save();
  }
}


module.exports = YamlConfig; // 导出类
