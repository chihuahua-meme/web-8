const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/creative-low-walleye|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/gigantic-breezy-taleggio|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/equal-showy-geese|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/smiling-regular-megaraptor|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/gratis-busy-dichondra|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/spurious-shore-meteorology|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/hickory-animated-sun|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/fuschia-cobalt-hovercraft|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/slash-linen-badger|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/platinum-tattered-protoceratops|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/shade-powerful-castanet|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/occipital-scented-lancer|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/luck-eastern-tungsten|https://f4956f86-e70a-4724-be24-ec398f6f19e9@api.glitch.com/git/just-distinct-zinnia`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();