const { Input, AutoComplete } = require('enquirer');

const askAction = new AutoComplete({
    name: 'webhook',
    message: 'Please Select Your Choice?',
    limit: 10,
    initial: 0,
    choices: [
        'Issue Credential',
        'Credential Verification',
    ]
});

const askConnectionName = new Input({
    name: 'connectionName',
    message: 'Please Enter Connection Name?'
});

module.exports = {
    askAction,
    askConnectionName,
};