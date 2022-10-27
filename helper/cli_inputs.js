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

const askVerification = new AutoComplete({
    name: 'verificaiotn',
    message: 'Do you want to verify your issued credential?',
    limit: 10,
    initial: 0,
    choices: [
        'YES',
        'NO',
    ]
});

module.exports = {
    askAction,
    askConnectionName,
    askVerification
};