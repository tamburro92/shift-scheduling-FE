import {responseSTUB} from './stubData.js'

const slots_data = [{'from':'08:00', 'to':'14:30', 'type':'F4', 'id':1},
    {'from':'08:00', 'to':'13:00', 'type':'F1', 'id':2},
    {'from':'09:00', 'to':'13:00', 'type':'F1', 'id':3},
    {'from':'10:00', 'to':'13:30', 'type':'F1', 'id':4},
    
    {'from':'16:00', 'to':'20:00', 'type':'F2', 'id':5},
    {'from':'16:00', 'to':'20:30', 'type':'F2', 'id':6},
    {'from':'17:00', 'to':'20:00', 'type':'F2', 'id':7},

    {'from':'13:00', 'to':'21:00', 'type':'F3', 'id':8},
    {'from':'14:30', 'to':'21:00', 'type':'F3', 'id':9},
    {'from':'08:00', 'to':'16:00', 'type':'F8', 'id':10},
    {'from':'08:30', 'to':'13:00', 'type':'F5', 'id':11},
    {'from':'09:30', 'to':'13:00', 'type':'F5', 'id':12},
    {'from':'16:00', 'to':'20:30', 'type':'F6', 'id':13},
    {'from':'17:30', 'to':'21:00', 'type':'F6', 'id':14},
    {'from':'13:00', 'to':'21:00', 'type':'F7','isClosing':true, 'id':15},

    {'from':'', 'to':'', 'type':'LEAVING', 'id':16},
    {'from':'12:30', 'to':'20:30', 'type':'EXTRA', 'id':17}
  ];

const START_DATE = '01/07/2024';
const NUM_DAYS = 28;
const EMPLOYEES = ['Raffaele', 'Nunzia', 'Roberta', 'Francesca', 'Viviana', 'Pouya', 'Chiara', 'Giacomo', 'Bianca']

class Model {
    constructor(startDate = START_DATE, numDays = NUM_DAYS, employees = EMPLOYEES) {

      this.employees = employees;
      this.startDate  = startDate;
      this.numDays = numDays;

      this.shifts = [];
      this.preferences =  [];
      this.schedulingResponse = {};
    }
  
    addShift(s) {
      const shift = {
        id : s.id,
        day : s.day,
        employee : s.employee,
        idShift: s.idShift,
        hours: s.hours,
        type: s.type,
      };
      this.shifts.push(shift);
  
      //this._commit(this.shifts)
    }

    editShift(id, sIn) {
        this.shifts = this.preferences.map(s =>
          s.id === id ? { id: sIn.id, } : s
        );
    }
    
    deleteShift(id) {
        this.shifts = this.shifts.filter(s => s.id !== id);
    }

    deleteShifts() {
        this.shifts = [];
    }

    addPreference(p) {
        this.preferences.push(p);
    }
  
    editPreference(id, pIn) {
      this.preferences = this.preferences.map(p =>
        p.id === id ? { id: pIn.id, } : p
      );
    }
  
    deletePreference(emp, date, value) {
      this.preferences = this.preferences.filter(p => p.employee !== emp || p.date !==date || p.value!==value);
    }

    deletePreferences() {
        this.preferences = [];
    }

    setDateInput(startDate) {
        this.startDate = startDate;
    }
  
    getScheduling(){
      this.schedulingResponse = responseSTUB;
      this.startDate = START_DATE;
      //this.onShiftsChanged(this.startDate, this.numDays, this.employees, this.schedulingResponse.scheduling);
    }

    getCellPreferences(emp, date){
      return this.preferences.filter(p => p.employee === emp && p.date ===date);
    }

    getShiftOptions(emp, date){
      const transformed_data = slots_data.map(slot => {
        return {
          text: `${slot.from} - ${slot.to} ${slot.type}`,
          id: slot.id
        };
      });
      return transformed_data;
    }

    //binding
    bindToShiftsChanged(callback) {
      this.onShiftsChanged = callback
  }

  }

  export {Model}
