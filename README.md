/*could be used for getting stuff from API*/
/*"node-fetch": "^1.6.3"*/
/*https://github.com/philnash/quote-bot/blob/master/bot.js*/

# Stash
  For busy breastfeeding moms who need to ensure reliable milk production and don't have mind space to keep track of production, consumption, inventory and expiration dates constanly. My product is a breastmilk inventory management chat bot. Unlike existing breastfeeding tracking apps, which only track feeding itself and put all the tracking pressure on one user (the mom), my product tracks inventory with expiration dates and lets many users participate (e.g., daycare can update consumption away, caregivers can ask for the most efficient combination of frozen bottles etc).


## Features
### MVP
1. User can add supply via Slack
1. User can ask for inventory status

### More Features
* User can edit inventory
* User can add supply per category
* User can edit inventeory per category
* User can edit supply dates (backdate)
* User can ask for inventory longevity
* Bot will send alerts when inventory runs low and remind mom to pump
* Bot will send alerts when inventory is about to expire and remind mom go on a date night
* User can onboard to add baby info, habits and initial inventory
* Bot will understand multiple units (bottle, oz, ml)
* Bot will understand day of the week (e.g., "Last Friday" vs. "Friday")
* Bot will follow up on thawing out milk ("Did Amily finish the entire bottle?") to adjust inventory and learn baby consumption habits
* Bot will remind mom to pump
* User can ask for a history report (who did what when)
* User can ask for the most efficient combination of x ounces.

## Tech Stack
1. Production business logic: JavaScript hosted on [AWS Lambda](https://aws.amazon.com/lambda/)
1. Production storage: [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
1. Dev business logic: JavaScript hosted on [NodeJS](https://nodejs.org/en/)
1. Dev storage: [Local installation of DynamoDB](https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/)
1. Language processing: [LUIS.ai](https://www.luis.ai/)
1. UI, authentication: [Slack](https://slack.com/)
1. Scaffolding: [Claudia](https://github.com/claudiajs/claudia-bot-builder)
1. Metrics & Monitoring: [MixPanel](https://mixpanel.com/)
1. CI: [TravisCI](https://travis-ci.org/)
1. Testing: [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/)
