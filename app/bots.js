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
            var messaging_events = req.body.entry[0].messaging;
            messaging_events.forEach(function (event) {
                var sender = event.sender.id;
                if (event.message && event.message.text) {
                    var text = event.message.text;
                    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
                }
            });
            res.sendStatus(200)
        });
    return router;
};