export class Event {
    constructor(
        public _id : string,
        public timestamp : string,
        public company : string,
        public location : String,
        public area : String,
        public data : Object
    ){}
}
