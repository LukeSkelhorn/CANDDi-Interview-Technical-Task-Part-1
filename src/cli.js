import requestPromise from 'request-promise';
import cheerio from 'cheerio';
import boxen from 'boxen';
import ora from 'ora';
import Knwl from 'knwl.js';
import chalk from 'chalk';
import { program } from 'commander';

let emailValue = '';
const finalDetails = {
    emails: [],
    phones: [],
    places: [],
  },
  knwlInstance = new Knwl('english');
knwlInstance.register('internationalPhones', require('./internationalPhones'));
knwlInstance.register('addresses', require('./ukAddresses'));

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
  for (let index = 0; index < emails.length; index++) {
    const element = emails[index];
    if (!finalDetails.emails.includes(emails[index].address)) {
      finalDetails.emails.push(emails[index].address);
    }
  }
};

const getPhones = () => {
  const phones = knwlInstance.get('internationalPhones');
  for (let index = 0; index < phones.length; index++) {
    const element = phones[index];
    if (!finalDetails.phones.includes(phones[index].number)) {
      finalDetails.phones.push(phones[index].number);
    }
  }
};
const getPlaces = () => {
  const addresses = knwlInstance.get('addresses');
  console.log('addresses', addresses);
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
      // getEmails(); // Works
      // getPhones(); // Works
      getPlaces(); // Doesn't Work
      console.log(finalDetails);
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
