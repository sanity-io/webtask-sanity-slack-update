/**
* @param context {WebtaskContext}
*/
const axios = require('axios');
const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: '<YOUR PROJECT ID>',
    dataset: '<YOUR DATASET NAME>',
    useCdn: true,
});

module.exports = async function(context, cb) {
  const { created, updated, deleted } = context.body.ids;
  const query = async ids => client.fetch(`*[_id in [${ids.map(JSON.stringify).join(',')}]]{title,_type}`);
  const data = {
    created: created.length && await query(created),
    updated: updated.length && await query(updated),
    deleted: deleted.length && await query(deleted)
  };
  const { SLACK_WEBHOOK_URL } = context.secrets
  const messages = payload => Object.keys(payload).filter(key => payload[key]).map(key => ({
    title: `Something was ${key} in ${payload[key].map(({_type}) => _type).join(', ')}:`,
    value: payload[key].map(({ title, name }) => name ? name : title).join(', '),
    short: true
  }))
  const options = {
    text: "Something happened in Sanity! :eyes:",
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