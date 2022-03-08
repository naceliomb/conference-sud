class Orator{
    constructor(id, name, role, active=false, firstPray=false, lastPray=false){
        this.id = id;
        this.name = name;
        this.role = role;
        this.active = active;
        this.firstPray = firstPray;
        this.lastPray = lastPray;
    }
}

export default Orator;