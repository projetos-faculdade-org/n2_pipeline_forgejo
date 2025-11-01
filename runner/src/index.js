const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 4000;
const SECRET = process.env.DEPLOY_SECRET || 'change-me';
const REPO_PATH = process.env.REPO_PATH || process.cwd();

app.use(morgan('tiny'));
app.use(bodyParser.json());

function verifySecret(req) {
  const header = req.headers['x-deploy-secret'];
  return header && header === SECRET;
}

app.post('/webhook', (req, res) => {
  if (!verifySecret(req)) {
    res.status(401).send('invalid secret');
    return;
  }

  const event = req.headers['x-gitea-event'] || req.headers['x-github-event'] || 'push';
  if (event !== 'push') {
    res.status(202).send('ignored event');
    return;
  }

  res.status(200).send('deploying');

  const pullCmd = `git -C ${REPO_PATH} pull`;
  const composeCmd = `docker-compose -f ${REPO_PATH}/docker-compose.yml up -d --build`;

  exec(pullCmd, (err, out, info) => {
    if (err) {
      console.error('git pull failed', err, out, info);
      return;
    }
    console.log('git pull output:', out);
    exec(composeCmd, (err2, out2, info2) => {
      if (err2) {
        console.error('docker-compose failed', err2, out2, info2);
        return;
      }
      console.log('docker-compose output:', out2);
    });
  });
});

app.get('/', (req, res) => res.send('deployer-runner ok'));

app.listen(port, () => console.log(`deployer-runner listening on ${port}, repoPath=${REPO_PATH}`));
