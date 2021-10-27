const app = require('./app');
const config = require('./utils/config');

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on Port ${config.PORT}`);
});
