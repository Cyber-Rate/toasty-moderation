module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (message) {
       if(message.author.bot) return
       this.client.snipe.set(message.channel.id, message)
    }
  };
  