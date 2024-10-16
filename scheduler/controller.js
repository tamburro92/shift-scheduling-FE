//import moment from 'moment';

const DATE_FORMAT_MODEL = 'DD/MM/YYYY';
const DATE_FORMAT_VIEW = 'YYYY-MM-DD';

class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
    
      this.view.bindDateInput(this.handleDateInput);
      this.view.bindScheduleButton(this.handleScheduleButton);
      //this.view.bindCellClick((cellId) => this.model.getCellPreferences(cellId));
      this.view.bindCellClick(this.handleCellClick);
      this.view.bindAddModal(this.handleAddModalButton);
      this.view.bindDeletePreferenceClick(this.handleDeletePreference);

      this.model.bindToShiftsChanged(this.onShiftsChanged);


    }

    handleScheduleButton = () => {
      this.model.getScheduling();
      this.onShiftsChanged(this.model.startDate, this.model.numDays, this.model.employees, this.model.schedulingResponse.scheduling, this.model.preferences);
    }

    handleDateInput = (startDate) => { 
      const dateStr = moment(startDate).format(DATE_FORMAT_MODEL);
      this.model.setDateInput(dateStr);
      this.onShiftsChanged(this.model.startDate, this.model.numDays, this.model.employees, this.model.schedulingResponse.scheduling, this.model.preferences);
    }

    handleCellClick = (cell => {
      const id = cell.id;
      const emp = cell.getAttribute('data-emp');
      const date = cell.getAttribute('data-date');

      //const { shift, preference } = model.getShift(emp, date);
      const preferences = this.model.getCellPreferences(emp,date);
      const shiftOptions = this.model.getShiftOptions(emp,date);
      this.view.displayModal(cell, preferences, shiftOptions);
      this.view.updateCellPreference(cell, preferences.length);
    });

    handleAddModalButton = ((cell, selectedShiftValue, selectedShiftText, yesCheckbox, noCheckbox) => {
      const id = cell.id;
      const emp = cell.getAttribute('data-emp');
      const date = cell.getAttribute('data-date');
      this.model.addPreference({employee: emp, date: date, value: selectedShiftValue, text: selectedShiftText, yes:yesCheckbox, no:noCheckbox});
      //this.view.updateCell(empId, date, shift, preference); // Aggiorna la cella dopo il salvataggio
      const preferences = this.model.getCellPreferences(emp,date);
      const shiftOptions = this.model.getShiftOptions(emp,date);
      this.view.displayModal(cell, preferences, shiftOptions);
      this.view.updateCellPreference(cell, preferences.length);
    });

    handleDeletePreference = ((cell, p) => {
      const emp = p.getAttribute('data-emp');
      const date = p.getAttribute('data-date');
      const value = p.getAttribute('data-value');

      this.model.deletePreference(emp,date,value)

      const preferences = this.model.getCellPreferences(emp,date);
      const shiftOptions = this.model.getShiftOptions(emp,date);
      this.view.displayModal(cell, preferences, shiftOptions);
      this.view.updateCellPreference(cell, preferences.length);
    });
  
    
    onShiftsChanged = (startDate, numDays, employees, schedule, preferences) => {
        const momentObj = moment(startDate, DATE_FORMAT_MODEL);
        this.view.startDateInput.value = momentObj.format(DATE_FORMAT_VIEW);
        this.view.createScheduleTable(momentObj.toDate(), numDays, employees, schedule, preferences)
      }
  }

export {Controller}
