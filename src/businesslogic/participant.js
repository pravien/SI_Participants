class Participant{
    constructor(email,name){
        this.email = email
        this.name = name
        this.events = []
    }

    addEvent(eventId){
        let exist = false
        for (const elm of this.events) {
            if(eventId == elm){
                exist = true
                break
            }
        }
        if(!exist){
            this.events.push(eventId)
        }
    }
    getEvents(){
        return this.events
    }

    deleteEvent(eventId){
        let temp = this.events.filter((id)=>{
            if(id != eventId){
                return id
            }
        })
        this.events = temp
    }
}
module.exports =  Participant