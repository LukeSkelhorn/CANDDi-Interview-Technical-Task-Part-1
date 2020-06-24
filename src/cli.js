import requestPromise from 'request-promise';
import cheerio from 'cheerio';
import boxen from 'boxen';
import ora from 'ora';
import Knwl from 'knwl.js';
import chalk from 'chalk';
import { program } from 'commander';

let emailValue = '';
const knwlInstance = new Knwl('english');
// knwlInstance.register('dates', require('./default_plugins/dates'));

program
  .version('0.0.1')
  .arguments('<email>')
  .description(
    'Enter an email and scrape the web for information about the company'
  )
  .action((email) => {
    emailValue = email;
  })
  .parse(process.args);

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const getEmails = () => {
  const emails = knwlInstance.get('emails');
  console.log('emails', emails);
};

const getPhones = () => {
  const phones = knwlInstance.get('phones');
  console.log('phones', phones);
};
const getPlaces = () => {
  const places = knwlInstance.get('places');
  console.log('places', places);
};

const getWebsite = (domain) => {
  const options = {
    uri: `http://www.${domain}`,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  const spinner = ora(`Loading ${chalk.magenta('Loading website')}`);
  spinner.start();
  return requestPromise(options)
    .then(($) => {
      spinner.succeed();
      knwlInstance.init($.html());
      getEmails(); // Works
      getPhones(); // Doesn't Work
      getPlaces(); // Doesn't Work
      return $;
    })
    .catch((err) => {
      console.error(err);
      process.exit(0);
    });
};

if (validateEmail(emailValue)) {
  const domain = emailValue.split('@')[1];
  getWebsite(domain);
} else {
  console.log(
    boxen(chalk.bold.red(`"${emailValue}" Is not valid email!`), {
      padding: 1,
      borderColor: 'red',
      borderStyle: 'classic',
    })
  );
  process.exit(0);
}
