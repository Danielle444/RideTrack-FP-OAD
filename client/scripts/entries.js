/* ================================================
   RideTrack - Entries Module
   ניהול הרשמות למקצים (מתוקן)
   ================================================ */

const entries = {
    currentData: [],

    async init() {
        // האזנה לאירועים לפני הטעינה
        this.setupEventListeners(); 
        await this.loadEntries();
    },

    async loadEntries() {
        try {
            UI.showLoading();
            const data = await API.entries.getAll();
            
            // בדיקה בקונסול כדי לראות איך הנתונים מגיעים (אותיות גדולות/קטנות)
            console.log('Entries Data Loaded:', data); 

            this.currentData = data;
            this.displayEntries(data);

            // --- התיקון הקריטי כאן ---
            // עדכון ישיר של האלמנט לפי ה-ID שמופיע ב-HTML
            const totalElement = document.getElementById('totalEntries');
            if (totalElement) {
                totalElement.innerText = data.length;
                totalElement.setAttribute('data-target', data.length); // עדכון גם עבור אנימציות אם יש
            }
            // -------------------------

            UI.hideEmptyState('entriesEmptyState');
        } catch (error) {
            console.error('Error loading entries:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן לטעון הרשמות');
            UI.showEmptyState('entriesEmptyState');
        } finally {
            UI.hideLoading();
        }
    },

    displayEntries(data) {
        const grid = document.getElementById('entriesGrid');
        
        if (!data || data.length === 0) {
            grid.innerHTML = '';
            UI.showEmptyState('entriesEmptyState');
            return;
        }

        UI.hideEmptyState('entriesEmptyState');
        grid.innerHTML = data.map(entry => this.createEntryCard(entry)).join('');
    },

    createEntryCard(entry) {
        // טיפול בבעיית אותיות גדולות/קטנות (Case Sensitivity)
        // אם השרת מחזיר אות גדולה, נשתמש בה. אחרת באות קטנה.
        const id = entry.entryId || entry.EntryId;
        const rider = entry.riderName || entry.RiderName;
        const horse = entry.horseName || entry.HorseName;
        const payer = entry.payerName || entry.PayerName;
        const comp = entry.competitionName || entry.CompetitionName;
        const clsName = entry.className || entry.ClassName;
        const clsDay = entry.classDay || entry.ClassDay;
        const price = entry.classPrice || entry.ClassPrice;

        return `
            <div class="data-card" data-entry-id="${id}">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-user-circle"></i>
                        ${rider}
                    </h3>
                    <span class="card-badge badge-primary">#${id}</span>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-horse"></i> סוס:</span>
                            <span class="info-value">${horse}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-credit-card"></i> משלם:</span>
                            <span class="info-value">${payer}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-trophy"></i> תחרות:</span>
                            <span class="info-value">${comp}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-list"></i> מקצה:</span>
                            <span class="info-value">${clsName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-calendar"></i> תאריך:</span>
                            <span class="info-value">${typeof DateUtils !== 'undefined' ? DateUtils.formatDate(clsDay) : clsDay}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-dollar-sign"></i> מחיר:</span>
                            <span class="info-value">${typeof NumberUtils !== 'undefined' ? NumberUtils.formatPrice(price) : price}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="entries.showEditForm(${id})">
                        <i class="fas fa-edit"></i> ערוך
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="entries.confirmDelete(${id})">
                        <i class="fas fa-trash"></i> מחק
                    </button>
                </div>
            </div>
        `;
    },

    showAddForm() {
        const formContent = `
            <form id="entryForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר רוכב</label>
                        <input type="number" class="form-input" id="riderId" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מספר סוס</label>
                        <input type="number" class="form-input" id="horseId" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר משלם</label>
                        <input type="number" class="form-input" id="payerId" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מספר מקצה</label>
                        <input type="number" class="form-input" id="classId" required min="1">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="entries.saveEntry()">
                        <i class="fas fa-save"></i> שמור
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;
        UI.showModal('הוספת הרשמה חדשה', formContent);
    },

    async saveEntry() {
        if (!UI.validateForm('entryForm')) {
            UI.showToast('warning', 'שים לב', 'נא למלא את כל השדות');
            return;
        }

        const entry = {
            riderId: parseInt(document.getElementById('riderId').value),
            horseId: parseInt(document.getElementById('horseId').value),
            payerId: parseInt(document.getElementById('payerId').value),
            classId: parseInt(document.getElementById('classId').value)
        };

        try {
            UI.showLoading();
            await API.entries.add(entry);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'ההרשמה נוספה בהצלחה');
            
            // עדכון נתונים + עדכון המונה בדשבורד באופן יזום
            await this.loadEntries(); 
            
        } catch (error) {
            console.error('Error adding entry:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן להוסיף הרשמה');
        } finally {
            UI.hideLoading();
        }
    },

    showEditForm(entryId) {
        // חיפוש גמיש (גם ID מספר וגם ID מחרוזת)
        const entry = this.currentData.find(e => (e.entryId || e.EntryId) == entryId);
        if (!entry) return;

        // שימוש בשדות עם תמיכה באות גדולה/קטנה
        const rId = entry.riderId || entry.RiderId;
        const hId = entry.horseId || entry.HorseId;
        const pId = entry.payerId || entry.PayerId;
        const cId = entry.classId || entry.ClassId;
        const eId = entry.entryId || entry.EntryId;

        const formContent = `
            <form id="entryEditForm" class="modal-form">
                <input type="hidden" id="editEntryId" value="${eId}">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר רוכב</label>
                        <input type="number" class="form-input" id="editRiderId" value="${rId}" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מספר סוס</label>
                        <input type="number" class="form-input" id="editHorseId" value="${hId}" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר משלם</label>
                        <input type="number" class="form-input" id="editPayerId" value="${pId}" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מספר מקצה</label>
                        <input type="number" class="form-input" id="editClassId" value="${cId}" required min="1">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="entries.updateEntry()">
                        <i class="fas fa-save"></i> עדכן
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;
        UI.showModal('עריכת הרשמה', formContent);
    },

    async updateEntry() {
        if (!UI.validateForm('entryEditForm')) {
            UI.showToast('warning', 'שים לב', 'נא למלא את כל השדות');
            return;
        }

        const entry = {
            entryId: parseInt(document.getElementById('editEntryId').value),
            riderId: parseInt(document.getElementById('editRiderId').value),
            horseId: parseInt(document.getElementById('editHorseId').value),
            payerId: parseInt(document.getElementById('editPayerId').value),
            classId: parseInt(document.getElementById('editClassId').value)
        };

        try {
            UI.showLoading();
            await API.entries.update(entry);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'ההרשמה עודכנה בהצלחה');
            await this.loadEntries();
        } catch (error) {
            console.error('Error updating entry:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן לעדכן הרשמה');
        } finally {
            UI.hideLoading();
        }
    },

    confirmDelete(entryId) {
        UI.confirm(
            'מחיקת הרשמה',
            'האם אתה בטוח שברצונך למחוק הרשמה זו?',
            () => this.deleteEntry(entryId)
        );
    },

    async deleteEntry(entryId) {
        try {
            UI.showLoading();
            await API.entries.delete(entryId);
            UI.showToast('success', 'הצלחה!', 'ההרשמה נמחקה בהצלחה');
            await this.loadEntries(); // זה יעדכן גם את המונה בדשבורד
        } catch (error) {
            console.error('Error deleting entry:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן למחוק הרשמה');
        } finally {
            UI.hideLoading();
        }
    },

    searchEntries(searchText) {
        if (!searchText || searchText.length < 2) {
            this.displayEntries(this.currentData);
            return;
        }

        const filtered = this.currentData.filter(entry => {
            const searchStr = searchText.toLowerCase();
            // חיפוש גמיש שמתאים גם ל-camelCase וגם ל-PascalCase
            return (entry.riderName || entry.RiderName || '').toLowerCase().includes(searchStr) ||
                   (entry.horseName || entry.HorseName || '').toLowerCase().includes(searchStr) ||
                   (entry.payerName || entry.PayerName || '').toLowerCase().includes(searchStr);
        });

        this.displayEntries(filtered);
    },

    setupEventListeners() {
        const addBtn = document.getElementById('addEntryBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.showAddForm());

        const refreshBtn = document.getElementById('refreshEntries');
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadEntries());

        const searchInput = document.getElementById('searchEntries');
        if (searchInput) {
            let timeout = null;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.searchEntries(e.target.value), 300);
            });
        }

        const clearBtn = document.getElementById('clearEntriesSearch');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchEntries('');
            });
        }
    }
};