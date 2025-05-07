var DueDateModule = (function() {

    const monthNamesFull = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];


    function calculateWorkingDays(startDate, days) {
        let date = new Date(startDate);
        date.setHours(0, 0, 0, 0);
        let count = 0;
        while (count < days) {
            date.setDate(date.getDate() + 1);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
        }
        return date;
    }

    function calculateOneMonthLater(startDate) {
         let date = new Date(startDate);
         date.setHours(0, 0, 0, 0);
         const currentDay = date.getDate();
         date.setDate(1);
         date.setMonth(date.getMonth() + 1);

         if (date.getDate() < currentDay) {
              date.setDate(0);
         } else {
             date.setDate(currentDay);
         }

        return date;
    }

    function formatDate(date, format) {
        if (!(date instanceof Date) || isNaN(date)) {
            return '';
        }

         const year = date.getUTCFullYear();
         const monthIndex = date.getUTCMonth(); // 0-indexed
         const day = date.getUTCDate();

         const mm = String(monthIndex + 1).padStart(2, '0');
         const dd = String(day).padStart(2, '0');
         const fullYear = String(year);
         const yy = fullYear.slice(-2);

         const monthNameFull = monthNamesFull[monthIndex];
         const monthNameShort = monthNamesShort[monthIndex];

         let formatted = format;
         formatted = formatted.replace('Month', monthNameFull);
         formatted = formatted.replace('Mon', monthNameShort);
         formatted = formatted.replace('yyyy', fullYear);
         formatted = formatted.replace('mm', mm);
         formatted = formatted.replace('dd', dd);
         formatted = formatted.replace('yy', yy);

         return formatted;
    }

    var DueDateFieldInstance = function(containerId, defaultFormat = 'Month dd, yyyy') {
        //mm-dd-yyyy, dd-mm-yyyy, yyyy-mm-dd, Month dd, yyyy, Mon dd, yyyy
        if (!containerId) {
            console.error('Container ID is required. Instance not created.');
            return null;
        }
        if (typeof containerId !== 'string') {
            console.error('Container ID must be a string. Instance not created.');
            return null;
        }
        if (containerId.trim() === '') {
            console.error('Container ID cannot be empty. Instance not created.');
            return null;
        }
        if (typeof defaultFormat !== 'string') {
            console.error('Default format must be a string. Instance not created.');
            return null;
        }
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container element with ID "${containerId}" not found. Instance not created.`);
            return null;
        }

        this.defaultFormat = defaultFormat;
        this._userInput = '';
        this._calculatedDate = null;

        this.selector = null;
        this.datePicker = null;

        this.render();
        this.attachEventListeners();
        this.handleSelectionChange();
    };

    DueDateFieldInstance.prototype.render = function() {
        this.container.innerHTML = `
            <div class="due-date-container">
                <select class="due-date-selector">
                    <option value="On Receipt">On Receipt</option>
                    <option value="1 Week">1 Week</option>
                    <option value="15 Working Days">15 Working Days</option>
                    <option value="1 Month">1 Month</option>
                    <option value="Custom">Custom</option>
                </select>
                <input type="date" class="custom-date-picker">
            </div>
        `;

        this.selector = this.container.querySelector('.due-date-selector');
        this.datePicker = this.container.querySelector('.custom-date-picker');
    };

    DueDateFieldInstance.prototype.attachEventListeners = function() {
        this.selector.addEventListener('change', this.handleSelectionChange.bind(this));
        this.datePicker.addEventListener('change', this.handleCustomDateChange.bind(this));
    };

    DueDateFieldInstance.prototype.handleSelectionChange = function() {
        const selectedValue = this.selector.value;
        this._userInput = selectedValue;

        this.datePicker.style.display = 'none';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (selectedValue) {
            case 'On Receipt':
                this._calculatedDate = 'On Receipt';
                this.datePicker.value = '';
                break;
            case '1 Week':
                const oneWeekLater = new Date(today);
                oneWeekLater.setDate(today.getDate() + 7);
                this._calculatedDate = oneWeekLater;
                 this.datePicker.value = '';
                break;
            case '15 Working Days':
                this._calculatedDate = calculateWorkingDays(today, 15);
                 this.datePicker.value = '';
                break;
            case '1 Month':
                this._calculatedDate = calculateOneMonthLater(today);
                 this.datePicker.value = '';
                break;
            case 'Custom':
                this._calculatedDate = null;
                this.datePicker.style.display = 'inline-block';
                break;
        }
    };

    DueDateFieldInstance.prototype.handleCustomDateChange = function() {
         if (this.selector.value === 'Custom') {
            const selectedDateString = this.datePicker.value;
            if (selectedDateString) {
                 const [year, month, day] = selectedDateString.split('-').map(Number);
                 this._calculatedDate = new Date(Date.UTC(year, month - 1, day));
            } else {
                this._calculatedDate = null;
            }
         }
    };

    DueDateFieldInstance.prototype.getUserInput = function() {
        return this._userInput;
    };

    DueDateFieldInstance.prototype.getValue = function(format = this.defaultFormat) {
        if (this._calculatedDate === 'On Receipt') {
            return 'On Receipt';
        } else if (this._calculatedDate instanceof Date) {
            return formatDate(this._calculatedDate, format);
        } else if (this.selector.value === 'Custom' && !this.datePicker.value) {
             return '';
        }
         return '';
    };

    return {
        create: function(containerId, defaultFormat) {
            return new DueDateFieldInstance(containerId, defaultFormat);
        }
    };

})();