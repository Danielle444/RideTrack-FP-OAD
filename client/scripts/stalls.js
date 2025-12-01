/* ================================================
   RideTrack - Stalls Module
   ניהול תאים (מתוקן)
   ================================================ */

const stalls = {
    currentData: [],

    async init() {
        this.setupEventListeners();
        await this.loadStalls();
    },

    async loadStalls() {
        try {
            UI.showLoading();
            const data = await API.stalls.getAll();
            
            console.log('Stalls Data Loaded:', data); // לדיבאג

            this.currentData = data;
            this.displayStalls(data);

            // עדכון המונה בדשבורד
            const totalElement = document.getElementById('totalStalls');
            if (totalElement) {
                totalElement.innerText = data.length;
                totalElement.setAttribute('data-target', data.length);
            }

            UI.hideEmptyState('stallsEmptyState');
        } catch (error) {
            console.error('Error loading stalls:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן לטעון תאים');
            UI.showEmptyState('stallsEmptyState');
        } finally {
            UI.hideLoading();
        }
    },

    displayStalls(data) {
        const grid = document.getElementById('stallsGrid');
        
        if (!data || data.length === 0) {
            grid.innerHTML = '';
            UI.showEmptyState('stallsEmptyState');
            return;
        }

        UI.hideEmptyState('stallsEmptyState');
        grid.innerHTML = data.map(stall => this.createStallCard(stall)).join('');
    },

    createStallCard(stall) {
        // טיפול ב-Case Sensitivity
        const id = stall.stallId || stall.StallId;
        const number = stall.stallNumber || stall.StallNumber;
        const horse = stall.horseName || stall.HorseName || 'N/A';
        const payer = stall.payerName || stall.PayerName || 'N/A';
        const comp = stall.competitionName || stall.CompetitionName || 'N/A';
        const arrival = stall.arrivalDate || stall.ArrivalDate;
        const departure = stall.departureDate || stall.DepartureDate;
        const total = stall.totalPrice || stall.TotalPrice;

        return `
            <div class="data-card" data-stall-id="${id}">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-warehouse"></i>
                        תא #${number}
                    </h3>
                    <span class="card-badge badge-success">#${id}</span>
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
                            <span class="info-label"><i class="fas fa-calendar-check"></i> הגעה:</span>
                            <span class="info-value">${typeof DateUtils !== 'undefined' ? DateUtils.formatDate(arrival) : arrival}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-calendar-times"></i> עזיבה:</span>
                            <span class="info-value">${typeof DateUtils !== 'undefined' ? DateUtils.formatDate(departure) : departure}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-dollar-sign"></i> מחיר כולל:</span>
                            <span class="info-value">${typeof NumberUtils !== 'undefined' ? NumberUtils.formatPrice(total) : total}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="stalls.showEditForm(${id})">
                        <i class="fas fa-edit"></i> ערוך
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="stalls.confirmDelete(${id})">
                        <i class="fas fa-trash"></i> מחק
                    </button>
                </div>
            </div>
        `;
    },

    showAddForm() {
        const formContent = `
            <form id="stallForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר תחרות</label>
                        <input type="number" class="form-input" id="competitionId" required min="1">
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
                        <label class="form-label required">מספר תא</label>
                        <input type="number" class="form-input" id="stallNumber" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">תאריך הגעה</label>
                        <input type="date" class="form-input" id="arrivalDate" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">תאריך עזיבה</label>
                        <input type="date" class="form-input" id="departureDate" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">תעריף יומי</label>
                        <input type="number" class="form-input" id="dailyRate" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מחיר כולל</label>
                        <input type="number" class="form-input" id="totalPrice" required min="0" step="0.01">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="stalls.saveStall()">
                        <i class="fas fa-save"></i> שמור
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;
        
        UI.showModal('הוספת תא חדש', formContent);
    },

    async saveStall() {
        if (!UI.validateForm('stallForm')) {
            UI.showToast('warning', 'שים לב', 'נא למלא את כל השדות');
            return;
        }

        const stall = {
            competitionId: parseInt(document.getElementById('competitionId').value),
            horseId: parseInt(document.getElementById('horseId').value),
            payerId: parseInt(document.getElementById('payerId').value),
            stallNumber: parseInt(document.getElementById('stallNumber').value),
            arrivalDate: document.getElementById('arrivalDate').value,
            departureDate: document.getElementById('departureDate').value,
            dailyRate: parseFloat(document.getElementById('dailyRate').value),
            totalPrice: parseFloat(document.getElementById('totalPrice').value)
        };

        try {
            UI.showLoading();
            await API.stalls.add(stall);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'התא נוסף בהצלחה');
            await this.loadStalls();
        } catch (error) {
            console.error('Error adding stall:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן להוסיף תא');
        } finally {
            UI.hideLoading();
        }
    },

    showEditForm(stallId) {
        const stall = this.currentData.find(s => (s.stallId || s.StallId) == stallId);
        if (!stall) return;

        // מיפוי שדות לטופס
        const sId = stall.stallId || stall.StallId;
        const cId = stall.competitionId || stall.CompetitionId;
        const hId = stall.horseId || stall.HorseId;
        const pId = stall.payerId || stall.PayerId;
        const sNum = stall.stallNumber || stall.StallNumber;
        const arrDate = stall.arrivalDate || stall.ArrivalDate;
        const depDate = stall.departureDate || stall.DepartureDate;
        const dRate = stall.dailyRate || stall.DailyRate;
        const tPrice = stall.totalPrice || stall.TotalPrice;

        const formContent = `
            <form id="stallEditForm" class="modal-form">
                <input type="hidden" id="editStallId" value="${sId}">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מספר תחרות</label>
                        <input type="number" class="form-input" id="editCompetitionId" value="${cId}" required min="1">
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
                        <label class="form-label required">מספר תא</label>
                        <input type="number" class="form-input" id="editStallNumber" value="${sNum}" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">תאריך הגעה</label>
                        <input type="date" class="form-input" id="editArrivalDate" value="${typeof DateUtils !== 'undefined' ? DateUtils.toISO(arrDate) : arrDate}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">תאריך עזיבה</label>
                        <input type="date" class="form-input" id="editDepartureDate" value="${typeof DateUtils !== 'undefined' ? DateUtils.toISO(depDate) : depDate}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">תעריף יומי</label>
                        <input type="number" class="form-input" id="editDailyRate" value="${dRate}" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מחיר כולל</label>
                        <input type="number" class="form-input" id="editTotalPrice" value="${tPrice}" required min="0" step="0.01">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="stalls.updateStall()">
                        <i class="fas fa-save"></i> עדכן
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;
        
        UI.showModal('עריכת תא', formContent);
    },

    async updateStall() {
        if (!UI.validateForm('stallEditForm')) {
            UI.showToast('warning', 'שים לב', 'נא למלא את כל השדות');
            return;
        }

        const stall = {
            stallId: parseInt(document.getElementById('editStallId').value),
            competitionId: parseInt(document.getElementById('editCompetitionId').value),
            horseId: parseInt(document.getElementById('editHorseId').value),
            payerId: parseInt(document.getElementById('editPayerId').value),
            stallNumber: parseInt(document.getElementById('editStallNumber').value),
            arrivalDate: document.getElementById('editArrivalDate').value,
            departureDate: document.getElementById('editDepartureDate').value,
            dailyRate: parseFloat(document.getElementById('editDailyRate').value),
            totalPrice: parseFloat(document.getElementById('editTotalPrice').value)
        };

        try {
            UI.showLoading();
            await API.stalls.update(stall);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'התא עודכן בהצלחה');
            await this.loadStalls();
        } catch (error) {
            console.error('Error updating stall:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן לעדכן תא');
        } finally {
            UI.hideLoading();
        }
    },

    confirmDelete(stallId) {
        UI.confirm(
            'מחיקת תא',
            'האם אתה בטוח שברצונך למחוק תא זה?',
            () => this.deleteStall(stallId)
        );
    },

    async deleteStall(stallId) {
        try {
            UI.showLoading();
            await API.stalls.delete(stallId);
            UI.showToast('success', 'הצלחה!', 'התא נמחק בהצלחה');
            await this.loadStalls();
        } catch (error) {
            console.error('Error deleting stall:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן למחוק תא');
        } finally {
            UI.hideLoading();
        }
    },

    searchStalls(searchText) {
        if (!searchText || searchText.length < 2) {
            this.displayStalls(this.currentData);
            return;
        }

        const filtered = this.currentData.filter(stall => {
            const searchStr = searchText.toLowerCase();
            return (stall.horseName || stall.HorseName || '').toLowerCase().includes(searchStr) ||
                   (stall.payerName || stall.PayerName || '').toLowerCase().includes(searchStr) ||
                   (stall.competitionName || stall.CompetitionName || '').toLowerCase().includes(searchStr) ||
                   (stall.stallNumber || stall.StallNumber || '').toString().includes(searchStr);
        });

        this.displayStalls(filtered);
    },

    setupEventListeners() {
        const addBtn = document.getElementById('addStallBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.showAddForm());

        const refreshBtn = document.getElementById('refreshStalls');
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadStalls());

        const searchInput = document.getElementById('searchStalls');
        if (searchInput) {
            let timeout = null;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.searchStalls(e.target.value), 300);
            });
        }

        const clearBtn = document.getElementById('clearStallsSearch');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchStalls('');
            });
        }
    }
};