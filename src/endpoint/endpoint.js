var express = require('express');
const cors = require('cors');
var app = express();
const { toXML } = require('jstoxml');
app.use(express.json())
app.use(cors())

let Participant = require('../businesslogic/participant')

let participants = []
let events = []
let _id = 0
function generateParticipants(){
    tempList = [
        {
            email : 'mikkel@sadmuch.dk',
            name : 'mikkel'
        },
        {
            email : 'lovro@lovesrussia.RU',
            name : 'lovro'
        },
        {
            email : 'justas@latvia.dk',
            name : 'justas',
        }


    ]
    for(var i = 0; i<tempList.length; i++){
        part = tempList[i]
        let participant = new Participant(_id,part.email,part.name);
        _id+=1
        participant.events = [10,100,200,4,5];
        participants.push(participant)

    }
    //console.log(participants)
}

generateParticipants()

function addEventToParticipant(eventId,participantEmail,participantName){
    let added = false
    for(let i = 0; i<participants.length; i++){
        let part = participants[i]
        if(part.email === participantEmail){
            part.addEvent(eventId)
            added = true
            console.log(`Found participant with email ${participantEmail} and added event with id ${eventId}`)
            break
        }
    }
    if (added != true){
        console.log(`Participant with email ${participantEmail} not found`)
        participant = new Participant(_id,participantEmail,participantName)
        _id+=1
        participant.addEvent(eventId)
        participants.push(participant)
        console.log(`Created participant with id ${_id} and added event ${eventId}`)
    }
}


function getParticipantsByEventId(eventId){
    let res = []
    for (const elm of participants) {
        for (const event of elm.events) {
           if(event == eventId){
                res.push(elm)
           } 
        }
    }
    return res
}

function participants2Xml(list){
    console.log(list)
    let str = '<participants>'
    for (const participant of list){
        str+=`<participant><id>${participant.id}</id><email>${participant.email}</email>
        <name>${participant.name}</name></participant>`
    }
    str+='</participants>'
    return str
}

function delEvent(eventId,participantId){
    for (const participant of participants){
        if(participant.id == participantId){
            participant.deleteEvent(eventId)
            return 'success'
        }
    }
    return 'failed'
}

// Delete by event ID for user params body must contain email and eventid

app.delete('/:participantId/event/:eventId', function(req, res){
    try{
        let participantId = req.params.participantId
        let eventId = req.params.eventId
        let contentType = req.headers["content-type"]
        let message_con = {message : delEvent(eventId,participantId)}
        res.status(200)
        if(contentType == 'application/json'){
            res.set({'Content-Type': 'application/json'})
            res.send(JSON.stringify(message_con))
        }else{
            res.set({'Content-Type': 'application/xml'})
            res.send(toXML(message_con))
        }

    }
    catch(error){
        res.status(400)
        console.log(error)
        let contentType = req.headers["content-type"]
        if(contentType == 'application/json'){
            res.send(JSON.stringify({
                message:"failed"
            }))
        }else{
            res.set({'Content-Type': 'application/xml'})
            res.send(toXML({
                message:"failed"
            }))
        }
    }
})


// get by Id or use ALL to get all

app.get('/:eventId', function (req, res) {
    try{
        let body = []
        let contentType = req.headers["content-type"]
        let eventId = req.params.eventId
        console.log(eventId,contentType)
        if (eventId.toLowerCase() != 'all'){
            body = getParticipantsByEventId(eventId)
        }else{
            body = participants
        } 
        console.log('body',body)
        res.status(200)
        if(contentType == 'application/json'){
            res.send(JSON.stringify(body))  
        }else{
            res.send(participants2Xml(body))
        }
    }catch(error){
        console.log(error)
        let contentType = req.headers["content-type"]
        res.status(400)
        if(contentType == 'application/json'){
            res.send(JSON.stringify({
                message:"failed"
            }))  
        }else{
            res.send(participants2Xml({
                message:"failed"
            }))
        }
    }     
})

// create participant
 app.post('/', function (req, res) {
    let contentType = req.headers["content-type"]
    try{
        for (const part of req.body.participants) {
            addEventToParticipant(part.eventId,part.email,part.name)
        }
        res.status(201)
        if(contentType == 'application/json'){
            res.set({'Content-Type': 'application/json'})
            res.send(JSON.stringify({
                message:"success"
            }))
        }else{
            res.set({'Content-Type': 'application/xml'})
            res.send(toXML({
                message:"success"
            }))
        }
    }
    catch(error) {
        res.status(400)
        let contentType = req.headers["content-type"]
        console.log(error)
        if(contentType == 'application/json'){
            res.send(JSON.stringify({
                message:"failed"
            }))
        }else{
            res.set({'Content-Type': 'application/xml'})
            res.send(toXML({
                message:"failed"
            }))
        }
      }
 })
 

var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    console.log(participants2Xml(participants))
 })