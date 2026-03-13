process.env.NODE_ENV = 'test';
process.env.PERSISTENCE = process.env.PERSISTENCE || 'mongo'; // mongo | memory | file

let connectDB;
let disconnectDB;

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(20000);
    const dbModule = await import('../src/config/database.js');
    ({ connectDB, disconnectDB } = dbModule);

    if (process.env.PERSISTENCE === 'mongo') {
      await connectDB();
    }
  },
  afterAll: async () => {
    if (process.env.PERSISTENCE === 'mongo' && disconnectDB) {
      await disconnectDB();
    }
  }
};
