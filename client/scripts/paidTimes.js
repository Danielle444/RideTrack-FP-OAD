/* ================================================
   RideTrack - Paid Times Module
   ניהול פייד טיים (מתוקן)
   ================================================ */

const paidTimes = {
    currentData: [],

    async init() {
        console.log('🏇 Initializing Paid Times module...');
        this.setupEventListeners();
        await this.loadPaidTimes();
    },

    async loadPaidTimes() {
        try {
            UI.showLoading(); // תוקן ל-UI
            console.log('📡 Loading paid times from API...');
            
            const data = await API.paidTimes.getAll(); // תוקן ל-API
            console.log('✅ Paid times loaded:', data);
            
            this.currentData = data || [];
            this.displayPaidTimes(this.currentData);
            
            // עדכון המונה בדשבורד - לפי ה-ID ב-HTML
            const totalElement = document.getElementById('totalPaidTimes');
            if (totalElement) {
                totalElement.innerText = this.currentData.length;
                totalElement.setAttribute('data-target', this.currentData.length);
            }
            
            UI.hideEmptyState('paidTimesEmptyState');
        } catch (error) {
            console.error('❌ Error loading paid times:', error);
            UI.showToast('error', 'שגיאה', 'לא הצלחנו לטעון את הפייד טיימס. נסה שוב.');
            this.currentData = [];
            this.displayPaidTimes([]);
            UI.showEmptyState('paidTimesEmptyState');
        } finally {
            UI.hideLoading();
        }
    },

    displayPaidTimes(data) {
        // תוקן ל-ID הנכון ב-HTML
        const container = document.getElementById('paidTimesGrid'); 
        
        if (!container) {
            console.error('❌ Paid times grid container (paidTimesGrid) not found!');
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML = '';
            UI.showEmptyState('paidTimesEmptyState');
            return;
        }

        UI.hideEmptyState('paidTimesEmptyState');
        container.innerHTML = data.map(pt => this.createPaidTimeCard(pt)).join('');
    },

    createPaidTimeCard(paidTime) {
        // טיפול ב-Case Sensitivity
        const id = paidTime.paidTimeId || paidTime.PaidTimeId;
        const compId = paidTime.competitionId || paidTime.CompetitionId;
        const rId = paidTime.riderId || paidTime.RiderId;
        const hId = paidTime.horseId || paidTime.HorseId;
        const pId = paidTime.payerId || paidTime.PayerId;
        const arena = paidTime.arenaName || paidTime.ArenaName || 'זירה לא ידועה';
        const type = paidTime.slotType || paidTime.SlotType;
        const date = paidTime.day || paidTime.Day;
        const price = paidTime.price || paidTime.Price;
        const compName = paidTime.competitionName || paidTime.CompetitionName || 'N/A';
        const rName = paidTime.riderName || paidTime.RiderName || 'N/A';
        const hName = paidTime.horseName || paidTime.HorseName || 'N/A';
        const pName = paidTime.payerName || paidTime.PayerName || 'N/A';

        const slotTypeDisplay = type === 'Short' ? 'קצר' : 'ארוך';
        const badgeClass = type === 'Short' ? 'badge-warning' : 'badge-info';
        
        return `
            <div class="data-card" data-id="${id}">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-clock"></i>
                        ${arena}
                    </h3>
                    <span class="card-badge ${badgeClass}">
                        ${slotTypeDisplay}
                    </span>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-trophy"></i> תחרות:</span>
                            <span class="info-value">${compName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-user"></i> רוכב:</span>
                            <span class="info-value">${rName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-horse"></i> סוס:</span>
                            <span class="info-value">${hName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-user-tie"></i> משלם:</span>
                            <span class="info-value">${pName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-calendar"></i> תאריך:</span>
                            <span class="info-value">${typeof DateUtils !== 'undefined' ? DateUtils.formatDate(date) : date}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-dollar-sign"></i> מחיר:</span>
                            <span class="info-value">${typeof NumberUtils !== 'undefined' ? NumberUtils.formatPrice(price) : price}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="paidTimes.showEditForm(${id})">
                        <i class="fas fa-edit"></i> ערוך
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="paidTimes.confirmDelete(${id})">
                        <i class="fas fa-trash"></i> מחיקה
                    </button>
                </div>
            </div>
        `;
    },

    showAddForm() {
        const formHtml = `
            <form id="paidtime-form" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מזהה תחרות</label>
                        <input type="number" class="form-input" id="pt-competitionId" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מזהה רוכב</label>
                        <input type="number" class="form-input" id="pt-riderId" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מזהה סוס</label>
                        <input type="number" class="form-input" id="pt-horseId" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מזהה משלם</label>
                        <input type="number" class="form-input" id="pt-payerId" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">שם זירה</label>
                        <input type="text" class="form-input" id="pt-arenaName" required placeholder="לדוגמה: זירה A">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">תאריך</label>
                        <input type="date" class="form-input" id="pt-day" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">סוג סלוט</label>
                        <select id="pt-slotType" class="form-input" required>
                            <option value="">בחר סוג סלוט</option>
                            <option value="Short">קצר (Short)</option>
                            <option value="Long">ארוך (Long)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מחיר</label>
                        <input type="number" class="form-input" id="pt-price" required min="0" step="0.01">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="paidTimes.savePaidTime()">
                        <i class="fas fa-save"></i> שמור
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;

        UI.showModal('הוספת פייד טיים חדש', formHtml);
    },

    async savePaidTime() {
        if (!UI.validateForm('paidtime-form')) {
            UI.showToast('warning', 'שים לב', 'אנא מלא את כל השדות הנדרשים');
            return;
        }

        const paidTimeData = {
            competitionId: parseInt(document.getElementById('pt-competitionId').value),
            riderId: parseInt(document.getElementById('pt-riderId').value),
            horseId: parseInt(document.getElementById('pt-horseId').value),
            payerId: parseInt(document.getElementById('pt-payerId').value),
            arenaName: document.getElementById('pt-arenaName').value.trim(),
            day: document.getElementById('pt-day').value,
            slotType: document.getElementById('pt-slotType').value,
            price: parseFloat(document.getElementById('pt-price').value)
        };

        try {
            UI.showLoading();
            await API.paidTimes.add(paidTimeData);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'הפייד טיים נוסף בהצלחה');
            await this.loadPaidTimes();
        } catch (error) {
            console.error('❌ Error saving paid time:', error);
            UI.showToast('error', 'שגיאה', 'לא הצלחנו לשמור את הפייד טיים');
        } finally {
            UI.hideLoading();
        }
    },

    showEditForm(paidTimeId) {
        // חיפוש גמיש בנתונים
        const paidTime = this.currentData.find(pt => (pt.paidTimeId || pt.PaidTimeId) == paidTimeId);
        
        if (!paidTime) {
            UI.showToast('error', 'שגיאה', 'הפייד טיים לא נמצא');
            return;
        }

        // מיפוי שדות
        const id = paidTime.paidTimeId || paidTime.PaidTimeId;
        const cId = paidTime.competitionId || paidTime.CompetitionId;
        const rId = paidTime.riderId || paidTime.RiderId;
        const hId = paidTime.horseId || paidTime.HorseId;
        const pId = paidTime.payerId || paidTime.PayerId;
        const arena = paidTime.arenaName || paidTime.ArenaName;
        const day = paidTime.day || paidTime.Day;
        const type = paidTime.slotType || paidTime.SlotType;
        const price = paidTime.price || paidTime.Price;

        const formHtml = `
            <form id="paidtime-edit-form" class="modal-form">
                <input type="hidden" id="edit-paidTimeId" value="${id}">
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מזהה תחרות</label>
                        <input type="number" class="form-input" id="edit-competitionId" value="${cId}" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מזהה רוכב</label>
                        <input type="number" class="form-input" id="edit-riderId" value="${rId}" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">מזהה סוס</label>
                        <input type="number" class="form-input" id="edit-horseId" value="${hId}" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מזהה משלם</label>
                        <input type="number" class="form-input" id="edit-payerId" value="${pId}" required min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">שם זירה</label>
                        <input type="text" class="form-input" id="edit-arenaName" value="${arena}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">תאריך</label>
                        <input type="date" class="form-input" id="edit-day" value="${typeof DateUtils !== 'undefined' ? DateUtils.toISO(day) : day}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">סוג סלוט</label>
                        <select id="edit-slotType" class="form-input" required>
                            <option value="Short" ${type === 'Short' ? 'selected' : ''}>קצר (Short)</option>
                            <option value="Long" ${type === 'Long' ? 'selected' : ''}>ארוך (Long)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">מחיר</label>
                        <input type="number" class="form-input" id="edit-price" value="${price}" required min="0" step="0.01">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="paidTimes.updatePaidTime()">
                        <i class="fas fa-save"></i> עדכן
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;

        UI.showModal('עריכת פייד טיים', formHtml);
    },

    async updatePaidTime() {
        if (!UI.validateForm('paidtime-edit-form')) {
            UI.showToast('warning', 'שים לב', 'אנא מלא את כל השדות הנדרשים');
            return;
        }

        const paidTimeData = {
            paidTimeId: parseInt(document.getElementById('edit-paidTimeId').value),
            competitionId: parseInt(document.getElementById('edit-competitionId').value),
            riderId: parseInt(document.getElementById('edit-riderId').value),
            horseId: parseInt(document.getElementById('edit-horseId').value),
            payerId: parseInt(document.getElementById('edit-payerId').value),
            arenaName: document.getElementById('edit-arenaName').value.trim(),
            day: document.getElementById('edit-day').value,
            slotType: document.getElementById('edit-slotType').value,
            price: parseFloat(document.getElementById('edit-price').value)
        };

        try {
            UI.showLoading();
            await API.paidTimes.update(paidTimeData);
            UI.hideModal();
            UI.showToast('success', 'הצלחה!', 'הפייד טיים עודכן בהצלחה');
            await this.loadPaidTimes();
        } catch (error) {
            console.error('❌ Error updating paid time:', error);
            UI.showToast('error', 'שגיאה', 'לא הצלחנו לעדכן את הפייד טיים');
        } finally {
            UI.hideLoading();
        }
    },

    confirmDelete(paidTimeId) {
        UI.confirm(
            'אישור מחיקה',
            'האם אתה בטוח שברצונך למחוק את הפייד טיים הזה?',
            () => this.deletePaidTime(paidTimeId)
        );
    },

    async deletePaidTime(paidTimeId) {
        try {
            UI.showLoading();
            await API.paidTimes.delete(paidTimeId);
            UI.showToast('success', 'הצלחה!', 'הפייד טיים נמחק בהצלחה');
            await this.loadPaidTimes();
        } catch (error) {
            console.error('❌ Error deleting paid time:', error);
            UI.showToast('error', 'שגיאה', 'לא הצלחנו למחוק את הפייד טיים');
        } finally {
            UI.hideLoading();
        }
    },

    searchPaidTimes(searchText) {
        if (!searchText) {
            this.displayPaidTimes(this.currentData);
            return;
        }

        const search = searchText.toLowerCase();
        const filtered = this.currentData.filter(pt => {
            return (
                (pt.arenaName || pt.ArenaName || '').toLowerCase().includes(search) ||
                (pt.slotType || pt.SlotType || '').toLowerCase().includes(search) ||
                (pt.competitionId || pt.CompetitionId || '').toString().includes(search)
            );
        });

        this.displayPaidTimes(filtered);
    },

    setupEventListeners() {
        // שימוש ב-ID הנכון מה-HTML (addPaidTimeBtn)
        const addBtn = document.getElementById('addPaidTimeBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }

        const refreshBtn = document.getElementById('refreshPaidTimes');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadPaidTimes());
        }

        // שימוש ב-ID הנכון מה-HTML (searchPaidTimes)
        const searchInput = document.getElementById('searchPaidTimes');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.searchPaidTimes(e.target.value);
                }, 300);
            });
        }

        console.log('✅ Paid Times event listeners set up');
    }
};