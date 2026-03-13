process.env.NODE_ENV = 'test';
process.env.PERSISTENCE = process.env.PERSISTENCE || 'memory'; // mongo | memory | file

let connectDB;
let disconnectDB;

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(20000);
    if (process.env.PERSISTENCE === 'mongo') {
      const dbModule = await import('../src/config/database.js');
      ({ connectDB, disconnectDB } = dbModule);
      await connectDB();
    }
  },
  afterAll: async () => {
    if (process.env.PERSISTENCE === 'mongo' && disconnectDB) {
      await disconnectDB();
    }
  }
};
