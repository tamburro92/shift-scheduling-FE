/**
 * @class View
 *
 * Visual representation of the model.
 */

class View {
    constructor() {

        this.scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
        this.scheduleButton = document.getElementById('schedule-button');
        this.startDateInput = document.getElementById('start-date');
        
        // modal element
        //this.shiftModal = document.getElementById('shift-modal');
        this.shiftSelect = document.getElementById('shift-select');
        this.addShiftButton = document.getElementById('add-shift-button');
        this.yesCheckbox = document.getElementById('preferenceYes');
        this.noCheckbox = document.getElementById('preferenceNo');
        this.addedShiftsContainer = document.getElementById('added-shifts');
        this.closeButton = document.querySelector('.close');

        this.currentCell = null;
  
        this._initLocalListeners()
    }
  
    get _todoText() {
      return this.input.value
    }
  
    _resetInput() {
      this.input.value = ''
    }
  
    createElement(tag, className) {
      const element = document.createElement(tag)
  
      if (className) element.classList.add(className)
  
      return element
    }
  
    getElement(selector) {
      const element = document.querySelector(selector)
  
      return element
    }

    // Aggiungi le intestazioni delle colonne per i giorni
    createHeader(startDate, numDays) {
        const thead = document.getElementById('schedule-table').getElementsByTagName('thead')[0];
        const headerRow = thead.getElementsByTagName('tr')[0];

        // Rimuovi eventuali intestazioni esistenti (escluso il primo elemento)
        while (headerRow.children.length > 1) {
            headerRow.removeChild(headerRow.lastChild);
        }

        // Aggiungi nuove intestazioni
        for (let day = 0; day < numDays; day++) {
            const th = document.createElement('th');
            th.classList.add('header-day')
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + day);
            th.textContent = currentDate.toLocaleDateString('it-IT');

            // Aggiungi classi per sabato e domenica
            if (day%7 === 5) { // Sabato
                th.classList.add('saturday');
            } else if (day%7 === 6) { // Domenica
                th.classList.add('sunday');
            }

            headerRow.appendChild(th);
            
        }
    }

    createRows(employees, startDate, numDays){
        this.scheduleTable.innerHTML = '';
        let id = 0;
        // Aggiungi una riga per ogni impiegato
        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = employee;
            nameCell.classList.add('employee-name'); // Aggiungi la classe per evidenziare
            row.appendChild(nameCell);

            for (let day = 0; day < numDays; day++) {
                const cell = document.createElement('td');
                id +=1 ;
                cell.id = 'cell_' + id;
                cell.classList.add('clickable', 'cell-shift');
                cell.textContent = '';  // Celle vuote inizialmente
                
                const currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + day);
                cell.setAttribute('data-emp',employee)
                cell.setAttribute('data-date',currentDate.toLocaleDateString('it-IT'))

                // Aggiungi classi per sabato e domenica
                if (day%7 === 5) { // Sabato
                    cell.classList.add('saturday');
                } else if (day%7 === 6) { // Domenica
                    cell.classList.add('sunday');
                }

                //cell.addEventListener('click', () => this.displayModal(cell));
                cell.addEventListener('click', () => this.cellClicking(cell));
                row.appendChild(cell);
                
            }

            this.scheduleTable.appendChild(row);
        });
    }

    updateScheduleTable(employees, schedule) {
        if (schedule.length === 0)
            return;
        // Pulisce la tabella esistente
        const rows = this.scheduleTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            for (let j = 1; j < cells.length; j++) {
                cells[j].innerHTML = '';  // Pulisce le celle
            }
        }
    
        // Aggiorna la tabella con la pianificazione letta dal JSON
        const scheduling = schedule;
    
        for (const [date, shifts] of Object.entries(scheduling)) {
            shifts.forEach(shift => {
                const employeeIndex = employees.indexOf(shift.nome);
                if (employeeIndex !== -1) {
                    const cellIndex = this.getCellIndexForDate(date);
                    if (cellIndex !== -1) {
                        const row = rows[employeeIndex];
                        const cell = row.getElementsByTagName('td')[cellIndex + 1]; // +1 per saltare la cella del nome
                        const shiftTypeClass = `shift-${shift.tipo}`;
                        cell.innerHTML+= `
                            <div class="${shiftTypeClass}">
                            <div>${shift.da}</div>
                            <div class="shift-details">${shift.tipo}</div>
                            </div>
                        `;
                    }
                }
            });
        }
    }

    // Crea la tabella dei turni vuota
    createScheduleTable(startDate, numDays, employees, schedule=[], createScheduleTable = []) {
        this.createHeader(startDate, numDays);
        this.createRows(employees, startDate, numDays);
        this.updateScheduleTable(employees, schedule)
    }

    // Restituisce l'indice della cella per una data specifica
    getCellIndexForDate(date) {
        const headerCells = document.getElementById('schedule-table').getElementsByTagName('thead')[0].getElementsByTagName('th');
        for (let i = 1; i < headerCells.length; i++) {
            if (headerCells[i].textContent === date) {
                return i - 1; // -1 per saltare la prima colonna (nome impiegato)
            }
        }
        return -1;
    }

    _initLocalListeners() {
        this.closeButton.addEventListener('click', this.closeShiftModal);
       //this.saveShiftButton.addEventListener('click', this.saveShift);
    }

    // Apri la modale per la selezione del turno
    displayModal(cell, preferences=null, options=null) {
        this.currentCell = cell;

        // Rimuovetutte le opzioni
        while (this.shiftSelect.firstChild) {
            this.shiftSelect.removeChild(this.shiftSelect.firstChild);
        }
        // Aggiungi le opzioni di turno alla modale
        options.forEach(o => {
            const option = document.createElement('option');
            option.value = o.id;
            option.textContent = o.text;
            this.shiftSelect.appendChild(option);
        });

        // Rimuovetutte le preferenze
        this.addedShiftsContainer.innerHTML = ''; // Pulisce i turni aggiunti
        // Aggiungi le preferenze di turno alla modale
        preferences.forEach(p => {
            const divRoot = document.createElement('div');
            divRoot.classList.add('d-flex', 'justify-content-between');
            const div = document.createElement('div');
            const button = document.createElement('button');
            button.innerText = 'X';
            
            button.setAttribute('data-emp',cell.getAttribute('data-emp'));
            button.setAttribute('data-date',cell.getAttribute('data-date'));
            button.setAttribute('data-value',p.value);
            button.addEventListener('click', () => this.deletePreferenceButton(cell, button));

            divRoot.appendChild(div);
            divRoot.appendChild(button);

            div.classList.add('shift-entry'); 
            div.textContent = `${p.text}: ${p.yes ? 'SI': 'NO'}`;
            this.addedShiftsContainer.appendChild(divRoot);
        });


        $('#shift-modal').modal('show');
    }

    closeShiftModal() {
        $('#shift-modal').modal('hide');
    }

    updateCellPreference(cell, pLength){
        const element = cell.querySelector('.circle-preference');
        if(element!==null) element.remove();
        if(pLength > 0){
            let preferenceElement = document.createElement('div');
            preferenceElement.classList.add('circle-preference');
            preferenceElement.textContent = pLength;
            cell.appendChild(preferenceElement);
        }
    }


    bindDateInput(handler) {
        this.startDateInput.addEventListener('change', () => {
            const startDate = new Date(this.startDateInput.value);
            if (!isNaN(startDate)) {
                handler(startDate);
            }
        });
    }

    bindScheduleButton(handler) {
        this.scheduleButton.addEventListener('click', handler);

    }

    bindCellClick(handler) {
        this.cellClicking = handler;
    }

    bindAddModal(handler) {
        this.addShiftButton.addEventListener('click', () => {
            const selectedShiftValue = this.shiftSelect.value;
            const selectedShiftText = this.shiftSelect.options[this.shiftSelect.selectedIndex].text; // Ottieni il testo associato
            handler(this.currentCell, selectedShiftValue, selectedShiftText, this.yesCheckbox.checked, this.noCheckbox.checked);
        });
    }

    bindDeletePreferenceClick(handler) {
        this.deletePreferenceButton = handler;
    }

  }

export {View}