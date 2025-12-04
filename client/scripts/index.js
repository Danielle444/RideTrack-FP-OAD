document.addEventListener('DOMContentLoaded', async () => {
    console.log('🐴 RideTrack initialized');

    setupNavigation();

    setupModalHandlers();
    setupMobileNav(); 

    if (typeof entries !== 'undefined') entries.init();
    if (typeof stalls !== 'undefined') stalls.init();
    if (typeof shavingsOrders !== 'undefined') shavingsOrders.init();
    if (typeof paidTimes !== 'undefined') paidTimes.init();

    await updateDashboardCounts();


    await loadSection('entries');

    if (typeof entries !== 'undefined') {
        await entries.init();
    }
});

// הפונקציה החדשה לטעינת המונים - מותאמת ל-HTML שלך
async function updateDashboardCounts() {
    try {
        // שליחת 4 בקשות במקביל
        const [allEntries, allStalls, allShavings, allPaidTimes] = await Promise.all([
            API.entries.getAll(),
            API.stalls.getAll(),
            API.shavingsOrders.getAll(),
            API.paidTimes.getAll()
        ]);

        // עדכון המספרים ב-HTML לפי ה-IDs הנכונים
        if (allEntries) document.getElementById('totalEntries').innerText = allEntries.length;
        if (allStalls) document.getElementById('totalStalls').innerText = allStalls.length;
        if (allShavings) document.getElementById('totalShavings').innerText = allShavings.length;
        if (allPaidTimes) document.getElementById('totalPaidTimes').innerText = allPaidTimes.length;

    } catch (error) {
        console.error("Error updating dashboard counts:", error);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const targetSection = link.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            await loadSection(targetSection);
        });
    });
}

async function loadSection(sectionName) {
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    switch(sectionName) {
        case 'entries':
            if (typeof entries !== 'undefined') {
                await entries.loadEntries();
            }
            break;
        case 'stalls':
            if (typeof stalls !== 'undefined') {
                await stalls.loadStalls();
            }
            break;
        case 'shavings':
            if (typeof shavingsOrders !== 'undefined') {
                await shavingsOrders.loadShavingsOrders();
            }
            break;
        case 'paidtimes':
            if (typeof paidTimes !== 'undefined') {
                await paidTimes.loadPaidTimes();
            }
            break;
    }
}

function setupModalHandlers() {
    const modal = document.getElementById('mainModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            UI.hideModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            UI.hideModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            UI.hideModal();
        }
    });
}

function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }
}

setupMobileNav();