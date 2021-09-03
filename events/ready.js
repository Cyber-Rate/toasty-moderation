let cezalar = require("../models/cezalar.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    this.client.lastPunishment = this.client.lastPunishment + await this.client.fetchPunishments()
    await this.client.wait(1000);
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);
    require("../modules/unmutes.js")(this.client)
    require("../modules/vunmutes.js")(this.client)
    require("../modules/zamanlayıcı.js")(this.client)
    this.client.user.setActivity(`🖤 Luna`);
    this.client.logger.log(`${this.client.user.tag}, kullanıma hazır ${this.client.users.cache.size} kullanıcı, ${this.client.guilds.cache.size} sunucu.`, "ready");
    this.client.logger.log(`${this.client.lastPunishment} ceza tanımlandı!`, "ready");
  }
};
