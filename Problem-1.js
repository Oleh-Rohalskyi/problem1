
// Please make sure are queue of object keys are the same for each colapse station
const railWaysMap = {
    coordMap: [
        [{ A: 1 }, { A: 2 }, { A: 3, C: 3 }, { A: 4 }, { A: 5, B: 4 }, { A: 6 }, { A: 7 }],
        [{ B: 1 }, { B: 2 }, { B: 3, C: 4 }, { A: 5, B: 4 }, { B: 5 }, { B: 6 }],
        [{ C: 1 }, { C: 2 }, { A: 3, C: 3 }, { B: 3, C: 4 }, { C: 5 }, { C: 6 }]
    ],
    KievUndergrounMap: [
        [{ A: "Вокзальна" }, { A: "Університет" }, { A: "Театральна", C: "Золоті Ворота" }, { A: "Токіо 3" }, { A: "Хрещатик", B: "майдан Незалежності" }, { A: "Арсенальна" }, { A: "Дніпро" }],
        [{ B: "Палац Україна" }, { B: "Олімпійська" }, { B: "пл. Льва Толстого", C: "Палац Спорту" }, { A: "Хрещатик", B: "майдан Незалежності" }, { B: "Поштава площа" }, { B: "Контрактова площа" }],
        [{ C: "Лукьянівська" }, { C: "Львівська Брама" }, { A: "Театральна", C: "Золоті Ворота" }, { B: "пл. Льва Толстого", C: "Палац Спорту" }, { C: "Кловська" }, { C: "Печерська" }]
    ]
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let _collapsedCoords = [];

class Station {

    constructor(coord) {

        this.coord = coord;
        this.isCollapsed = false;
        const _coordKeys = Object.keys(coord);
        this.stationName = `${coord[_coordKeys[0]]}`;

        if (_coordKeys.length > 1) {
            this.stationName = _coordKeys.reduce((prev,next)=>{
                return prev + " " + coord[next];
            },"")
            this.isCollapsed = true;
            //Check if coord is colapsed coords it meen no need create new instanse for 2 branchs;
            let preparedCoords = _collapsedCoords.filter((station) => {
                return station.stationName === this.stationName
            })[0];

            if (preparedCoords)
                return preparedCoords;

            _collapsedCoords.push(this)

        }

    }

}

let HIGHT_ACCESS;
let LOW_ACCESS;
let NO_NEED_ACCESS;

const ALLREADY_ALLOWED__OWN_COMUNICATION = "ALLREADY_ALLOWED__OWN_COMUNICATION";
const NEXT_STATION_STRAIGHT__OWN_COMUNICATION = "NEXT_STATION_STRAIGHT__OWN_COMUNICATION";
const ANOTHER_HAS_MORE_PERSONS__INTERTRAIN_COMUNICATION = "ANOTHER_HAS_MORE_PERSONS__INTERTRAIN_COMUNICATION";
const THIS_HAS_MORE_PERSONS__OWN_COMUNICATION = "THIS_HAS_MORE_PERSONS__OWN_COMUNICATION";
const ANOTHER_TRAIN_IS_SAFE__OWN_COMUNICATION = "ANOTHER_TRAIN_IS_SAFE__OWN_COMUNICATION";

class Train {

    constructor(branchWithStation, numOfTrains) {

        if (!(branchWithStation[0] instanceof Station)) {
            throw new Error("branch dont have allowed stations")
        }

        this.branch = branchWithStation;
        this.lastStation = this.branch[this.branch.length - 1];
        this.firstStaion = this.branch[0];
        this.name = `(${this.firstStaion.stationName}/${this.lastStation.stationName})`;
        this.numberOfPersons = 0;
        this.inited = false;


        // i think able need to greate class for mermissions
        let _hasPermissionToMove = false;

        let _stepsToUnlock = numOfTrains - 1;
        let _numOfTrains = numOfTrains;

        function _givePermissionPoint(points) {
            _stepsToUnlock = _stepsToUnlock - points;
            if (_stepsToUnlock <= 0) {
                _hasPermissionToMove = true;
                _stepsToUnlock = _numOfTrains - 1;
            }
        }

        this.askPermission = () => {
            return _hasPermissionToMove;
        }

        HIGHT_ACCESS = (_numOfTrains - 1);
        LOW_ACCESS = 1;
        NO_NEED_ACCESS = 0;

        this.givePermission = (reason, points) => {
            _givePermissionPoint(points);
            this.message(reason);
        }

        this.canselPermission = () => {
            _hasPermissionToMove = false;
        }

    }

    init(startStation) {
        this.direction = getRandomInt(0, 1) === 0 ? -1 : 1;
        this.nextStation = startStation;
        this.inited = true;
        this.makeStationProcedure();
        return this;
    }

    getNextStation(previos) {
        switch (previos) {
            case this.firstStaion: {
                this.direction = 1
                break;
            }
            case this.lastStation: {
                this.direction = -1
                break;
            }
        }
        return this.branch[this.branch.indexOf(previos) + this.direction];
    }

    //before sheck lifecicle; so current station is this.nextStation
    makeStationProcedure() {
        this.message("-station-sings"); //...

        //landing and boarding of passengers;
        this.numberOfPersons = getRandomInt(5, 100);

    }

    warningMessage() {
        console.log('⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩');
        console.log('==== WARNING ====');
        console.log('⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧');
    }

    message(message) {
        console.log(`"${this.name}-TRAIN": ${message}`);
    }

    check(allTrains) {

        if (!this.inited) {
            return;
        }

        console.table([{
            name: this.name,
            persons: this.numberOfPersons,
            current: this.nextStation.stationName,
            direction: this.direction,
            next: this.getNextStation(this.nextStation).stationName,
            "first-station": this.firstStaion.stationName,
            "last-station": this.lastStation.stationName
        }]);

        //some train olready say you can go
        if (this.askPermission()) {
            this.givePermission(ALLREADY_ALLOWED__OWN_COMUNICATION, NO_NEED_ACCESS);
            return;
        }

        //check if the next station will have collapse situation? or previous train allready sand you can go
        if (!this.getNextStation(this.nextStation).isCollapsed) {

            //road is clear 
            this.givePermission(NEXT_STATION_STRAIGHT__OWN_COMUNICATION, HIGHT_ACCESS);

        } else {

            this.message("start check another trains")

            allTrains.forEach((someTrain) => {

                //no need to compare with same train
                if (someTrain === this) {
                    this.message("train try to check himself, return");
                    return;
                };

                this.message(`start scan ${someTrain.name}`);

                console.table([{
                    name: this.name,
                    persons: this.numberOfPersons,
                    current: this.nextStation.stationName,
                    direction: this.direction,
                    next: this.getNextStation(this.nextStation).stationName,
                    compare: `next same: ${this.getNextStation(this.nextStation) === someTrain.getNextStation(someTrain.nextStation)}`,
                    permission: this.askPermission()
                }, {
                    name: someTrain.name,
                    persons: someTrain.numberOfPersons,
                    current: someTrain.nextStation.stationName,
                    direction: someTrain.direction,
                    next: someTrain.getNextStation(someTrain.nextStation).stationName,
                    compare: `more persons: ${this.numberOfPersons <= someTrain.numberOfPersons}`,
                    permission: someTrain.askPermission()
                }]);

                //check if some train has the same next station
                //!!! ahtung !!! while tranin dont went they have nextStation as current, so logic is first check() then move()
                //!!! ahtung !!! becouse logic of move is revrating of coordinats by the n period of time
                if (this.getNextStation(this.nextStation) === someTrain.getNextStation(someTrain.nextStation)) {
                    //looks like some one wantet to go to the same station
                    this.warningMessage();
                    this.message(`train find conflickt with train: ${someTrain.name}`);
                    //check if this train has more persons than other train 
                    if (this.numberOfPersons <= someTrain.numberOfPersons) {

                        // say to anoter driver ok guy you can go;
                        someTrain.givePermission(ANOTHER_HAS_MORE_PERSONS__INTERTRAIN_COMUNICATION, HIGHT_ACCESS);

                    } else {
                        // say to driver ok guy you can go;
                        this.givePermission(THIS_HAS_MORE_PERSONS__OWN_COMUNICATION, HIGHT_ACCESS);

                    };

                } else {

                    this.givePermission(ANOTHER_TRAIN_IS_SAFE__OWN_COMUNICATION, LOW_ACCESS);

                };

            });

        };

    }

    move() {

        if (this.inited && this.askPermission()) {
            this.nextStation = this.getNextStation(this.nextStation);
            this.canselPermission();
            this.message("-move");
            this.makeStationProcedure();
            return;
        }
        this.message("-wait");

    }

}

let _instanse;

class App {

    constructor(Train, Station, railWaysMap) {
        if (_instanse) {
            return _instanse;
        }

        this.timeId;
        this.trains = [];

        //crate stations instanses 
        railWaysMap.forEach(branch => {

            let branchWithStations = branch.map(coords => {
                let station = new Station(coords);
                return station;
            });

            const train = new Train(branchWithStations, railWaysMap.length);

            this.trains.push(train.init(branchWithStations[3]))

        });


        if (this.trains[0].branch[2] !== this.trains[2].branch[2]) {
            throw new Error("test instans of Stations not the same, check 'test' map");
        }

        this.instanse = this;

    }
    start(actionFun) {
        if (this.timeId) return;
        this.timeId = setInterval(actionFun.bind(null, this.trains), 100);
    }
}

const app = new App(Train, Station, railWaysMap.KievUndergrounMap);

app.start((trains) => {
    trains.forEach((train) => {
        train.check(trains);
    })
    trains.forEach((train) => {
        train.move();
    })
})



