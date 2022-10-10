const { Input, AutoComplete } = require('enquirer');

const askWebhookUrl = new Input({
    name: 'webhook',
    message: 'Please Enter Your Webhook?'
});

const askWebhook = new AutoComplete({
    name: 'webhook',
    message: 'Do you want to enter your webhook URL?',
    limit: 10,
    initial: 1,
    choices: [
        'YES',
        'NO'
    ]
});

const askAction = new AutoComplete({
    name: 'webhook',
    message: 'Please Select Your Choice?',
    limit: 10,
    initial: 1,
    choices: [
        // 'Create New Connection',
        'Issue Credential',
        'Credential Verification',
    ]
});

const askCredDef = new Input({
    name: 'credDef',
    message: 'Please Enter Your Cred Def?'
});

const askIdentifier = new Input({
    name: 'identifier',
    message: 'Please Enter comma separated Your Schema identifiers (Example: name,age,country)?'
});

const getIdentifierValue = async (identifier)=>{
    const askIdentifierValue = new Input({
        name: 'identifierValue',
        message: `Please Enter ${identifier}?`
    });

    const ansIdentifierValue = await askIdentifierValue.run();

    return ansIdentifierValue;
}

module.exports = {
    askWebhookUrl,
    askWebhook,
    askAction,
    askCredDef,
    askIdentifier,
    getIdentifierValue
};