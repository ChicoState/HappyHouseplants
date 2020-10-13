db = db.getSiblingDB('happyplants');

db.Users.insert({
    tipSubject: 'tipSubject',
    tipMessage: 'tipMessage',
    tipID: 'tipID',
    plantType: 'plantType',
    sourceURL: 'sourceURL'
});

db.Tips.insert({
    tipSubject: 'tipSubject',
    tipMessage: 'tipMessage',
    tipID: 'tipID',
    plantType: 'plantType',
    sourceURL: 'sourceURL'
});