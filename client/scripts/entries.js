const entries = {
    currentData: [],
    selectedFile: null,

    async init() {
        console.log('Initializing entries module...');
        this.setupEventListeners(); 
        await this.loadEntries();
    },

    async loadEntries() {
        try {
            UI.showLoading();
            const data = await API.entries.getAll();
            
            console.log('Entries Data Loaded:', data);

            this.currentData = data;
            this.displayEntries(data);
            const totalElement = document.getElementById('totalEntries');
            if (totalElement) {
                totalElement.innerText = data.length;
                totalElement.setAttribute('data-target', data.length);
            }

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
        const id = entry.entryId || entry.EntryId;
        const rider = entry.riderName || entry.RiderName;
        const horse = entry.horseName || entry.HorseName;
        const payer = entry.payerName || entry.PayerName;
        const comp = entry.competitionName || entry.CompetitionName;
        const clsName = entry.className || entry.ClassName;
        const clsDay = entry.classDay || entry.ClassDay;
        const price = entry.classPrice || entry.ClassPrice;
        const vetDoc = entry.veterinaryDocumentPath || entry.VeterinaryDocumentPath;

        const docStatusHtml = vetDoc 
            ? `<div class="doc-status doc-uploaded">
                   <i class="fas fa-check-circle"></i>
                   <span>מסמך וטרינרי צורף</span>
                   <button class="btn-view-doc" onclick="window.open('${API_CONFIG.serverUrl}${vetDoc}', '_blank')" title="צפה במסמך">
                       <i class="fas fa-eye"></i>
                   </button>
               </div>`
            : `<div class="doc-status doc-missing">
                   <i class="fas fa-exclamation-triangle"></i>
                   <span>לא צורף מסמך וטרינרי</span>
               </div>`;

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
                    ${docStatusHtml}
                </div>
                <div class="card-footer">
                    ${!vetDoc ? `
                        <button class="btn btn-sm btn-warning" onclick="entries.uploadDocument(${id})">
                            <i class="fas fa-file-upload"></i> צרף מסמך
                        </button>
                    ` : ''}
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

                <div class="divider">
                    <span>מסמך וטרינרי (אופציונלי)</span>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-file-medical"></i>
                        צרף מסמך וטרינרי של הסוס (PDF, JPG, PNG)
                    </label>
                    <div class="file-upload-box" id="fileUploadBox">
                        <input type="file" 
                               id="vetDocInput" 
                               accept=".pdf,.jpg,.jpeg,.png"
                               style="display: none;">
                        
                        <div class="file-upload-placeholder" id="fileUploadPlaceholder">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>לחץ לבחירת קובץ או גרור לכאן</p>
                            <small>PDF, JPG, PNG (עד 5MB)</small>
                        </div>

                        <div class="file-selected" id="fileSelected" style="display: none;">
                            <i class="fas fa-file-pdf file-icon"></i>
                            <div class="file-info">
                                <span class="file-name" id="selectedFileName"></span>
                                <span class="file-size" id="selectedFileSize"></span>
                            </div>
                            <button type="button" class="btn-remove-file" id="removeFileBtn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="entries.saveEntry()">
                        <i class="fas fa-save"></i> שמור הרשמה
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">
                        <i class="fas fa-times"></i> ביטול
                    </button>
                </div>
            </form>
        `;
        UI.showModal('הוספת הרשמה חדשה', formContent);
        
        setTimeout(() => {
            this.setupFileUploadHandlers();
        }, 100);
    },

    setupFileUploadHandlers() {
        const uploadBox = document.getElementById('fileUploadBox');
        const fileInput = document.getElementById('vetDocInput');
        const placeholder = document.getElementById('fileUploadPlaceholder');
        const fileSelected = document.getElementById('fileSelected');
        const removeBtn = document.getElementById('removeFileBtn');

        if (!uploadBox || !fileInput) return;

        placeholder.addEventListener('click', () => {
            fileInput.click();
        });

        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('drag-over');
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('drag-over');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelection(e.target.files[0]);
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.selectedFile = null;
                fileInput.value = '';
                placeholder.style.display = 'flex';
                fileSelected.style.display = 'none';
            });
        }
    },

    handleFileSelection(file) {
        const placeholder = document.getElementById('fileUploadPlaceholder');
        const fileSelected = document.getElementById('fileSelected');
        const fileName = document.getElementById('selectedFileName');
        const fileSize = document.getElementById('selectedFileSize');
        const fileIcon = fileSelected.querySelector('.file-icon');

        const extension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

        if (!allowedExtensions.includes(extension)) {
            UI.showToast('error', 'שגיאה', 'סוג קובץ לא נתמך. השתמש ב-PDF, JPG או PNG');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            UI.showToast('error', 'שגיאה', 'גודל הקובץ חורג מ-5MB');
            return;
        }
        this.selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        if (extension === 'pdf') {
            fileIcon.className = 'fas fa-file-pdf file-icon';
        } else {
            fileIcon.className = 'fas fa-file-image file-icon';
        }

        placeholder.style.display = 'none';
        fileSelected.style.display = 'flex';
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    async saveEntry() {
        if (!UI.validateForm('entryForm')) {
            UI.showToast('warning', 'שים לב', 'נא למלא את כל השדות החובה');
            return;
        }

        try {
            UI.showLoading();
            
            const entry = {
                riderId: parseInt(document.getElementById('riderId').value),
                horseId: parseInt(document.getElementById('horseId').value),
                payerId: parseInt(document.getElementById('payerId').value),
                classId: parseInt(document.getElementById('classId').value)
            };

            const newEntryId = await API.entries.add(entry);
            
            if (this.selectedFile) {
                await this.uploadDocumentForEntry(newEntryId, this.selectedFile);
                UI.showToast('success', 'הצלחה!', 'ההרשמה נוספה כולל מסמך וטרינרי');
            } else {
                UI.showToast('success', 'הצלחה!', 'ההרשמה נוספה בהצלחה');
            }
            
            UI.hideModal();
            this.selectedFile = null;
            await this.loadEntries();
            
        } catch (error) {
            console.error('Error adding entry:', error);
            UI.showToast('error', 'שגיאה', 'לא ניתן להוסיף הרשמה');
        } finally {
            UI.hideLoading();
        }
    },

    async uploadDocumentForEntry(entryId, file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
            `${API_CONFIG.baseURL}/Entries/upload-veterinary-document/${entryId}`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload document: ${errorText}`);
        }

        return await response.json();
    },

    uploadDocument(entryId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const extension = file.name.split('.').pop().toLowerCase();
            const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

            if (!allowedExtensions.includes(extension)) {
                UI.showToast('error', 'שגיאה', 'סוג קובץ לא נתמך');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                UI.showToast('error', 'שגיאה', 'גודל הקובץ חורג מ-5MB');
                return;
            }

            try {
                UI.showLoading();
                await this.uploadDocumentForEntry(entryId, file);
                UI.showToast('success', 'הצלחה!', 'המסמך הוטרינרי הועלה בהצלחה');
                await this.loadEntries();
            } catch (error) {
                console.error('Error uploading document:', error);
                UI.showToast('error', 'שגיאה', 'לא ניתן להעלות מסמך');
            } finally {
                UI.hideLoading();
            }
        };
        
        input.click();
    },

    showEditForm(entryId) {
        const entry = this.currentData.find(e => (e.entryId || e.EntryId) == entryId);
        if (!entry) {
            UI.showToast('error', 'שגיאה', 'לא נמצאה הרשמה');
            return;
        }

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
            await this.loadEntries();
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
            const rider = (entry.riderName || entry.RiderName || '').toLowerCase();
            const horse = (entry.horseName || entry.HorseName || '').toLowerCase();
            const payer = (entry.payerName || entry.PayerName || '').toLowerCase();
            
            return rider.includes(searchStr) || 
                   horse.includes(searchStr) || 
                   payer.includes(searchStr);
        });

        this.displayEntries(filtered);
    },

    setupEventListeners() {
        const addBtn = document.getElementById('addEntryBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }

        const refreshBtn = document.getElementById('refreshEntries');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadEntries());
        }

        const searchInput = document.getElementById('searchEntries');
        if (searchInput) {
            let searchTimeout = null;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchEntries(e.target.value);
                }, 300);
            });
        }

        const clearBtn = document.getElementById('clearEntriesSearch');
        if (clearBtn && searchInput) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchEntries('');
            });
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => entries.init());
} else {
    entries.init();
}