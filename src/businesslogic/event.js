class Event{
    
    constructor(id){
        this.id = id
        this.accomendations = []
    }
    addAccomendation(accomendation){
        this.accomendations.push(accomendation)
    }
    getAccomendations(){
        return this.accomendations
    }
}
module.exports =  Event