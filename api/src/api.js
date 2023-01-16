const express = require('express');
const app = express();
const cors = require('cors');
const client = require('./config/psqlClient');
const humans = require('./routes/humans');
const proplabels = require('./routes/proplabels');
const entlabels = require('./routes/entlabels');

app.use(express.json());
app.use(cors());
app.use("/api/humans", humans);
app.use("/api/proplabels", proplabels);
app.use("/api/entlabels", entlabels);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  const port = process.env.PORT | 4000
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
})
.catch(err => console.error('Connection error', err.stack));