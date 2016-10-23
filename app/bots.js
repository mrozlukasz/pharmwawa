/**
 * Created by lukaszmroz on 23.10.2016.
 */
module.exports = function(router, TOKEN) {

    function sendTextMessage(sender, text) {
        var messageData = {
            text:text
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:TOKEN},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: messageData
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    function sendGenericMessage(sender) {
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "First card",
                        "subtitle": "Element #1 of an hscroll",
                        "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                        "buttons": [{
                            "type": "web_url",
                            "url": "https://www.messenger.com",
                            "title": "web url"
                        }, {
                            "type": "postback",
                            "title": "Postback",
                            "payload": "Payload for first element in a generic bubble",
                        }]
                    }, {
                        "title": "Second card",
                        "subtitle": "Element #2 of an hscroll",
                        "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "Postback",
                            "payload": "Payload for second element in a generic bubble",
                        }]
                    }]
                }
            }
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: messageData
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })
    }

// for Facebook verification
    router
        .get('/', function (req, res) {
            if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('Error, wrong token');
            }
        })
// for sending messages
        .post('/', function (req, res) {
            req.body.entry[0].messaging.forEach(function (event) {
                var sender = event.sender.id;
                if (event.message && event.message.text) {
                    var text = event.message.text;
                    console.log(event.message.text);
                    if (text === 'Generic') {
                        sendGenericMessage(sender);
                    } else {
                        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
                    }

                }
            });
            res.sendStatus(200)
        });
    return router;
};