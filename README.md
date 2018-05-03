# Serverless Webtask Sanity Slack Update Notification

Sanity + Webtask + Slack = :heart:

Get updates in Slack when someone does something in [Sanity](https://sanity.io). This works great if it's mostly humans that does the work in your Sanity backend. If you have machines that either does frequent or many operations it can be a bit noisy. Test it on yourself before letting it loose in your Slack team.

## Installation

### 1. Setting up the webtask script

If you have the `wt` command line interface, run to deploy this script on your own Webtask-account: 

```$ wt create https://raw.githubusercontent.com/kmelve/webtask-sanity-slack-update/master/sanity-slack-update.js --name sanity-slack-update```

You can also [copy-paste the code](https://raw.githubusercontent.com/kmelve/webtask-sanity-slack-update/master/sanity-slack-update.js) into the online editor at [webtask.io/make](https://webtask.io).

### 2. Create a Slack Incoming Webhook

Go to [the Slack custom integration configuration page](https://netlifedesign.slack.com/apps/manage/custom-integrations) and click *Incomming Webhooks* and *Add configuration*. Customize it as you want and remember to push the save button when you're done. Copy the webhook url (looks like this: `https://hooks.slack.com/services/<code>/<code>/<code>`).

In your webtask editor (`$ wt editor` or [webtask.io/make](https://webtask.io/make), add the webhook as a secret key. Find the wrench icon and choose *secrets* in the menu. Give the new key the name `SLACK_WEBHOOK_URL` and the webhook as the value. Now webtask knows where to send the update messages.

### 3. Add your webtask url to Sanity webhooks

Copy the webtask-url printed at the bottom line of the editor page (should look like `https://wt-<SECRET CODE>.sandbox.auth0-extend.com/<SCRIPT NAME>`) and run `sanity hook create name-of-your-choosing`. Choose the dataset you want reporting on, and paste in your webtask-url when prompted. 

## Customize

You can easily customize this script by either setting more parameters in the filter query (if you only want updates on a certain type etc), or by tweaking the messaging formatting.
