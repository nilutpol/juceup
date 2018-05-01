var net = require('net');

var HOST = '162.144.96.155';
var PORT = 3386;
var WEB_PORT = 9000;
var device_server;
var g_socket;

var v = require('voca');
var crc16 = require('crc');

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
var cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/* serves main page */
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/login', function(req, res) {
    console.log('GET: ' + JSON.stringify(req.query))

    let reply = {}

    if(req.query.mobile_no == undefined || req.query.fcm_token == undefined) {
        reply.status = 'failure'
        reply.msg = 'invalid parameters'
    } else if (req.query.mobile_no != 12345678) {
        reply.mobile_no = req.query.mobile_no
        reply.status = 'failure'
        reply.msg = 'mobile number not registered.'
    } else {
        reply.mobile_no = req.query.mobile_no
        reply.status = 'success'
        reply.state = 'not_borrowed'
        reply.msg = 'successfully logged in.'
    }
    res.json(reply);
})

app.get('/api/get_locations', function (req, res) {
    console.log('GET: ' + JSON.stringify(req.query))
    let reply = {}

    if(req.query.mobile_no == undefined || req.query.latitude == undefined || req.query.longitude ==  undefined) {
        reply.status = 'failure'
        reply.msg = 'invalid parameters'
    } else if (req.query.mobile_no != 12345678) {
        reply.mobile_no = req.query.mobile_no
        reply.status = 'failure'
        reply.msg = 'mobile number not registered.'
    } else {
        reply.status = 'success'
        reply.msg = 'locations list'
        reply.mobile_no = req.query.mobile_no
        reply.data = []

        let item = {};
        item.name = 'palm grove enclave, guwahati'
        item.address = 'palm grove enclave, guwahati'
        item.locality = 'palm grove enclave, guwahati'
        item.latitude = 26.134605
        item.longitude = 91.818343
        item.status = 'available'
        item.station_count = 3
        item.battery_count = 9
        reply.data.push(item)

        item = {};
        item.name = 'down town hospital, guwahati'
        item.address = 'down town hospital, guwahati'
        item.locality = 'down town hospital, guwahati'
        item.latitude = 26.138794
        item.longitude = 91.799657
        item.status = 'available'
        item.station_count = 4
        item.battery_count = 10
        reply.data.push(item)

        item = {};
        item.name = 'big bazar, guwahati'
        item.address = 'big bazar, guwahati'
        item.locality = 'big bazar, guwahati'
        item.latitude = 26.165825
        item.longitude = 91.768306
        item.status = 'low'
        item.station_count = 1
        item.battery_count = 1
        reply.data.push(item)

        item = {};
        item.name = 'zoo, guwahati'
        item.address = 'zoo, guwahati'
        item.locality = 'zoo, guwahati'
        item.latitude = 26.163519
        item.longitude = 91.780725
        item.status = 'low'
        item.station_count = 2
        item.battery_count = 2
        reply.data.push(item)

        item = {};
        item.name = 'commerce college, guwahati'
        item.address = 'commerce college, guwahati'
        item.locality = 'commerce college, guwahati'
        item.latitude = 26.180078
        item.longitude = 91.775640
        item.status = 'not available'
        item.station_count = 5
        item.battery_count = 0
        reply.data.push(item)
    }

    res.json(reply)
})

app.get('/api/get_inventory', function (req, res) {
    console.log('GET: ' + JSON.stringify(req.query))
    let reply = {}

    reply.status = 'success'

    reply.data = []
    let item = {};
    item.imei = 2201700122
    item.slots = []
    item.slots.push({ status: 'F', devid: '3201701006' })
    item.slots.push({ status: 'F', devid: '3201701007' })
    item.slots.push({ status: 'F', devid: '3201701008' })
    item.name = 'palm grove enclave, guwahati'
    item.address = 'palm grove enclave, guwahati'
    item.locality = 'palm grove enclave, guwahati'
    item.latitude = 26.134605
    item.longitude = 91.818343
    reply.data.push(item)

    item = {};
    item.imei = 22017001123
    item.slots = []
    item.slots.push({ status: 'F', devid: '3201701008' })
    item.slots.push({ status: 'NF', devid: '3201701001' })
    item.slots.push({ status: 'F', devid: '3201701002' })
    item.name = 'down town hospital, guwahati'
    item.address = 'down town hospital, guwahati'
    item.locality = 'down town hospital, guwahati'
    item.latitude = 26.138794
    item.longitude = 91.799657
    reply.data.push(item)

    item = {};
    item.imei = 2201700114
    item.slots = []
    item.slots.push({ status: 'F', devid: '3201701003' })
    item.slots.push({ status: 'NF', devid: '3201701004' })
    item.slots.push({ status: 'NF', devid: '3201701005' })
    item.name = 'big bazar, guwahati'
    item.address = 'big bazar, guwahati'
    item.locality = 'big bazar, guwahati'
    item.latitude = 26.165825
    item.longitude = 91.768306
    reply.data.push(item)

    item = {};
    item.imei = 2201700115
    item.slots = []
    item.slots.push({ status: 'EM', devid: '3201701016' })
    item.slots.push({ status: 'EM', devid: '3201701017' })
    item.slots.push({ status: 'F', devid: '3201701018' })
    item.name = 'zoo, guwahati'
    item.address = 'zoo, guwahati'
    item.locality = 'zoo, guwahati'
    item.latitude = 26.163519
    item.longitude = 91.780725
    reply.data.push(item)

    item = {};
    item.imei = 2201700116
    item.slots = []
    item.slots.push({ status: 'F', devid: '3201701006' })
    item.slots.push({ status: 'NF', devid: '3201701007' })
    item.slots.push({ status: 'ER', devid: '3201701008' })
    item.name = 'commerce college, guwahati'
    item.address = 'commerce college, guwahati'
    item.locality = 'commerce college, guwahati'
    item.latitude = 26.180078
    item.longitude = 91.775640
    reply.data.push(item)

    for (key in g_devices) {
        let device = g_devices[key]

        item = {};
        item.imei = device.imei
        item.slots = device.status.slots;

        item.name = 'commerce college, guwahati'
        item.address = 'commerce college, guwahati'
        item.locality = 'commerce college, guwahati'
        item.latitude = 26.180078
        item.longitude = 91.775640
        reply.data.push(item)
    }

    res.json(reply)
})

app.get('/api/request_bank', function (req, res) {
    let reply = {}

    if(req.query.mobile_no == undefined || req.query.imei == undefined) {
        reply.status = 'failure'
        reply.msg = 'invalid parameters'
    } else if (req.query.mobile_no != 12345678) {
        reply.mobile_no = req.query.mobile_no
        reply.imei = req.query.imei
        reply.status = 'failure'
        reply.msg = 'mobile number not registered.'
    } else if (req.query.imei != 2201700112) {
        reply.mobile_no = req.query.mobile_no
        reply.imei = req.query.imei
        reply.status = 'failure'
        reply.msg = 'device not found.'
    } else {
        release_bank(req.query.imei)
        reply.mobile_no = req.query.mobile_no
        reply.imei = req.query.imei
        reply.status = 'OK'
        reply.msg = 'Battery released successfully'
    }

    res.json(reply)
})

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    //     console.log('static file request : ' + req.params);
    res.sendFile(__dirname + req.params[0]);
});

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    //console.log("Location:"+JSON.stringify(location))
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        console.log('received on ws: %s', message);

        let cmd = JSON.parse(message)

        switch (cmd.cmd) {
            case 'lock':
                break
            case 'unlock':
                send_command(cmd.imei, 'CC', 'BW.' + cmd.slot_no + '.' + cmd.dev_id)
                send_to_clients('message', 'Sending release request for slot no. ' + cmd.slot_no + ' with device id ' + cmd.dev_id + ' to ' + cmd.imei)
                break
        }
    });
});

server.listen(WEB_PORT, function listening() {
    console.log('Listening on %d', server.address().port);
});

var g_devices = {};

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
device_server = net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    // Add a 'data' event handler to this instance of socket
    sock.on('connect', function (data) {
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    })

    sock.on('data', function (data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);

        data = parse_data(data)

        //console.log("PARSED: " + JSON.stringify(data))

        /* 
        Commands
        CH The device sends heartbeat packet command data to the server, and the server does not need to answer.
        
        CQ The server sends a request to query the device status command to the device side.
        AQ The device responds to the device status command to the server. CC The server issues a loan to the device.
        
        MQ The device sends a query if the device number belongs to the system command to the server.
        RQ Whether the server response device number belongs to the system command to the device side.
        
        MC The device initiates a lend or succeeds in a successful command to the server.
        AM The server answers the success or the success of the command to the device.
        
        MR The device initiates a lend failure or also returns a failed command to the server.
        AR The server answers the lender failure or also fails to command the device side.
        */

        switch (data.cmd) {
            case 'CH':
                if (!g_devices.hasOwnProperty(data.imei)) {
                    g_devices[data.imei] = {}
                    g_devices[data.imei].imei = data.imei
                    //g_devices[data.imei+1] = {}
                    //g_devices[data.imei+1].imei = data.imei+1;
                }
                g_devices[data.imei].is_alive = true
                //g_devices[data.imei+1].is_alive = true

                send_command(data.imei, 'CQ')
                break
            case 'AQ':
                if (g_devices.hasOwnProperty(data.imei)) {
                    //console.log('PARAM:' + data.param)
                    g_devices[data.imei].status = data.param
                    //g_devices[data.imei+1].status = data.param
                } else {
                    console.log('Unknown device AQ: ' + data.imei)
                }
                break
            case 'MC':
                //console.log('PARAM:' + JSON.stringify(data.param))
                //if (g_devices.hasOwnProperty(data.imei)) {
                send_command(data.imei, 'AM', data.param.code + '.' + data.param.slot_no + '.' + data.param.dev_id)
                send_to_clients('message', data.param.dev_id + ' battery succesfully ' + (data.param.code == 'BO' ? 'released' : 'returned') + ' on slot no. ' + data.param.slot_no + ' of ' + data.imei)
                setTimeout(function () { send_command(data.imei, 'CQ') }, 3000)
                //}
                break
            case 'MQ':
                //console.log('PARAM:' + JSON.stringify(data.param))
                //if (g_devices.hasOwnProperty(data.imei)) {
                send_to_clients('message', 'Does ' + data.param.dev_id + ' battery belong to slot no. ' + data.param.slot_no + ' of ' + data.imei + ' ?')
                send_command(data.imei, 'RQ', 'T.' + data.param.slot_no + '.' + data.param.dev_id)
                send_to_clients('message', data.param.dev_id + ' battery belongs to slot no. ' + data.param.slot_no + ' of ' + data.imei)
                //}
                break;
            case 'MR':
                //console.log('PARAM:' + JSON.stringify(data.param))
                //if (g_devices.hasOwnProperty(data.imei)) {
                send_to_clients('message', 'Unable to release ' + data.param.dev_id + ' battery succesfully ' + ' on slot no. ' + data.param.slot_no + ' of ' + data.imei)
                send_command(data.imei, 'AR', data.param.code + '.' + data.param.slot_no + '.' + data.param.dev_id)
                //}
                break;
        }

        //<console.log('Connected Devices: ' + JSON.stringify(g_devices))

        send_to_clients('status', g_devices)

        // Write the data back to the socket, the client will receive it as data from the server
        //sock.write('You said "' + data + '"');

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('error', function (data) {
        console.log('Error: ' + data);
    });

    sock.on('end', function (data) {
        console.log('Connection closed: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    g_socket = sock;

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);

function parse_data(data) {
    data = v.replaceAll(v.trim(data), '{', '')
    data = v.replaceAll(data, '}', '')
    data = v.replaceAll(data, '"', '')
    let tokens = v.split(data, ',')

    let imei = tokens[0]
    let cmd = tokens[1]
    let param = tokens[2]

    /*console.log('IMEI     : ' + imei)
    console.log('CMD      : ' + cmd)
    console.log('CMD DATA : ' + param)*/

    let res = {}
    res['imei'] = imei
    res['cmd'] = cmd

    let param_tokens
    let param_out = {}
    switch (cmd) {
        case 'AQ':
            param_tokens = v.split(param, ';')

            param_out['slots'] = []
            for (i = 0; i < param_tokens.length; i++) {
                let param_tokens_2 = v.split(param_tokens[i], '.')
                if (param_tokens_2.length > 1) {
                    let slot_info = {};
                    slot_info['id'] = param_tokens_2[0]
                    slot_info['state'] = param_tokens_2[1]
                    slot_info['dev_id'] = param_tokens_2[2]
                    param_out['slots'].push(slot_info)
                }
            }
            break;
        case 'MC':
            param_tokens = v.split(param, '.')

            if (param_tokens.length == 3) {
                param_out['code'] = param_tokens[0]
                param_out['slot_no'] = param_tokens[1]
                param_out['dev_id'] = param_tokens[2]
            } else {
                console.log("Invalid MC params.")
            }
            break;
        case 'MQ':
            param_tokens = v.split(param, '.')

            if (param_tokens.length == 2) {
                param_out['slot_no'] = param_tokens[0]
                param_out['dev_id'] = param_tokens[1]
            } else {
                console.log("Invalid MQ params.")
            }
            break;
        case 'MR':
            param_tokens = v.split(param, '.')

            if (param_tokens.length == 3) {
                param_out['code'] = param_tokens[0]
                param_out['slot_no'] = param_tokens[1]
                param_out['dev_id'] = param_tokens[2]
            } else {
                console.log("Invalid MR params.")
            }
            break;

    }

    res['param'] = param_out;

    //console.log('OUT: ' + JSON.stringify(res))
    return res;
}
function send_command(imei, cmd, data) {
    let str = '{"' + imei + ',' + cmd + ',' + (data != undefined ? data : '') + ','

    str += v.upperCase(crc16.crc16modbus(str).toString(16)) + '"}\r\n'

    console.log('Sending command: ' + str)
    g_socket.write(str)
    return str;
}

function send_to_clients(msg_type, data) {
    let obj = {}
    obj.msg_type = msg_type
    obj.data = data
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(obj));
        }
    })
}

function release_bank(imei) {
    let msg = 'Received release command for ' + imei
    console.log(msg)
    send_to_clients('message', msg)
    
    let battery_released = false;

    if (g_devices[imei] != undefined) {
        let device = g_devices[imei]

        if (device.status) {
            for (i = 0; i < device.status.slots.length; ++i) {
                let slot = device.status.slots[i];
                console.log(slot)
                if (slot.state == "FU") {
                    send_command(imei, 'CC', 'BW.' + slot.id + '.' + slot.dev_id)
                    battery_released = true
                    break
                }
            }
        } else {
            let msg = 'Status not available for ' + imei
            console.log(msg)
            send_to_clients('message', msg)
        }
    } else {
        let msg = 'Device not available: ' + imei
        console.log(msg)
        send_to_clients('message', msg)
    }

    if(!battery_released) {
        let msg = 'Battery not released. No Full Battery Bank available.'
        console.log(msg)
        send_to_clients('message', msg)
    }
}