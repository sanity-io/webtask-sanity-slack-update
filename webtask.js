/**
* @param context {WebtaskContext}
*/
require('babel-polyfill');
const axios = require('axios');
const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: 'l3oee2le',
    dataset: 'production',
    useCdn: true,
});

module.exports = async function(context, cb) {
  const { created, updated, deleted } = context.body.ids;
  const query = async ids => client.fetch(`*[_id in [${ids.map(JSON.stringify).join(',')}]]{title,name,_type}`);
  const data = {
    created: created.length && await query(created),
    updated: updated.length && await query(updated),
    deleted: deleted.length && await query(deleted)
  };
  console.log(JSON.stringify(data, undefined, 2))
  const { SLACK_WEBHOOK_URL } = context.secrets
  const messages = payload => Object.keys(payload).filter(key => payload[key]).map(key => ({
    title: `Something was ${key} in ${payload[key]._type}:`,
    value: payload[key].map(({ title, name }) => name ? name : title.nb).join(', '),
    short: true
  }))
  console.log(JSON.stringify(messages(data), undefined, 2))
  const options = {
    text: "Something happened in Sanity!",
    attachments: [{ fields: messages(data) }]
  };
  console.log(JSON.stringify(options, undefined, 2))
  return axios.post(SLACK_WEBHOOK_URL, JSON.stringify(options)).then((response) => {
    console.log('SUCCEEDED: Sent slack webhook: \n', response.data);
    cb(null, 200);
  }).catch((error) => {
    console.log('FAILED: Send slack webhook', error);
    cb(null, 500);
  });
};