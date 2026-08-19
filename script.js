let budgets = { needs: 0, wants: 0, savings: 0 };
let lists = { insurance: [], needs: [], wants: [], goals: [] };

const chartColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4'];
const formatINR = (num) => num.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const localNoteFiles = [
    '500 rupee.jpg',
    '200 rupee.jpg',
    '100 rupee.jpg',
    '50 rupee.jpg',
    '20 rupee.jpg',
    '10 rupee.jpg'
];

let lastCol = -1; 
function createMoneyParticle(isPrefill = false) {
    const money = document.createElement('div');
    money.classList.add('falling-money');
    
    const randomNote = localNoteFiles[Math.floor(Math.random() * localNoteFiles.length)];
    money.style.backgroundImage = `url('${randomNote}')`;
    
    const width = Math.random() * 40 + 90; 
    money.style.width = width + 'px';
    money.style.height = (width / 2.3) + 'px'; 
    
    let col = Math.floor(Math.random() * 4); 
    if (col === lastCol) col = (col + 1) % 4; 
    lastCol = col;
    
    let baseLeft = col * 22; 
    money.style.left = (baseLeft + Math.random() * 10) + 'vw';
    
    const duration = Math.random() * 8 + 10; 
    money.style.animationDuration = duration + 's';
    
    if (isPrefill) {
        money.style.animationDelay = `-${Math.random() * duration}s`;
    }
    
    money.style.setProperty('--end-x', (Math.random() * 300 - 150) + 'px'); 
    money.style.setProperty('--rot-x', (Math.random() * 1080) + 'deg'); 
    money.style.setProperty('--rot-y', (Math.random() * 1080) + 'deg');
    money.style.setProperty('--rot-z', (Math.random() * 360) + 'deg');  
    
    document.getElementById('money-container').appendChild(money);
    
    money.addEventListener('animationend', () => {
        money.remove();
    });
}

for(let i = 0; i < 6; i++) { createMoneyParticle(true); }
setInterval(() => createMoneyParticle(false), 1500);

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-scroll');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.hidden-scroll');
    cards.forEach(card => observer.observe(card));
});

function blendToDarkRed(baseHex, factor) {
    if (factor <= 0) return baseHex;
    if (factor >= 1) return '#8b0000'; 
    let r1 = parseInt(baseHex.substring(1, 3), 16), g1 = parseInt(baseHex.substring(3, 5), 16), b1 = parseInt(baseHex.substring(5, 7), 16);
    let r2 = 139, g2 = 0, b2 = 0; 
    let r = Math.round(r1 + factor * (r2 - r1)), g = Math.round(g1 + factor * (g2 - g1)), b = Math.round(b1 + factor * (b2 - b1));
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function triggerPulseAnimation(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove('pulse-action');
    void el.offsetWidth; 
    el.classList.add('pulse-action');
}

function updateSliderFill(slider) {
    const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary) ${val}%, #1e293b ${val}%)`;
}

const textInputs = Array.from(document.querySelectorAll('input:not([type="range"])'));
textInputs.forEach((input, index) => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(input.id === 'insurance-amt') { addInsurance(); document.getElementById('insurance-name').focus(); return; }
            if(input.id === 'need-amt') { addTrackerItem('needs'); document.getElementById('need-name').focus(); return; }
            if(input.id === 'want-amt') { addTrackerItem('wants'); document.getElementById('want-name').focus(); return; }
            if(input.id === 'goal-monthly') { addTrackerItem('goals'); document.getElementById('goal-name').focus(); return; }
            
            if (index < textInputs.length - 1) {
                textInputs[index + 1].focus();
            }
        }
    });
});

function addInsurance() {
    const name = document.getElementById('insurance-name').value || 'Unnamed Insurance';
    const amt = parseFloat(document.getElementById('insurance-amt').value) || 0;
    if (amt <= 0) return alert("Enter a valid amount.");
    
    lists.insurance.push({ id: Date.now(), name, amt, color: '#94a3b8' });
    document.getElementById('insurance-name').value = '';
    document.getElementById('insurance-amt').value = '';
    
    renderInsurance();
    calculateBudget();
    triggerPulseAnimation('insurance-list');
}

function deleteInsurance(id) {
    lists.insurance = lists.insurance.filter(item => item.id !== id);
    renderInsurance();
    calculateBudget();
}

function renderInsurance() {
    const listEl = document.getElementById('insurance-list');
    listEl.innerHTML = '';
    lists.insurance.forEach(item => {
        listEl.innerHTML += `
            <div class="item-card" style="border-left-color: #6b8e23;">
                <div class="item-info"><h4>${item.name}</h4><p>₹${formatINR(item.amt)}/mo</p></div>
                <button class="delete-btn" onclick="deleteInsurance(${item.id})">Remove</button>
            </div>`;
    });
}

const sliders = ['needs', 'wants', 'savings'];
sliders.forEach(cat => {
    const slider = document.getElementById(`${cat}-slider`);
    updateSliderFill(slider);
    slider.addEventListener('input', () => {
        document.getElementById(`${cat}-val`).innerText = slider.value;
        updateSliderFill(slider); 
    });
});

// NEW: Function to reset sliders to 50-30-20
function resetSplit() {
    document.getElementById('needs-slider').value = 50;
    document.getElementById('wants-slider').value = 30;
    document.getElementById('savings-slider').value = 20;
    
    document.getElementById('needs-val').innerText = 50;
    document.getElementById('wants-val').innerText = 30;
    document.getElementById('savings-val').innerText = 20;
    
    sliders.forEach(cat => {
        updateSliderFill(document.getElementById(`${cat}-slider`));
    });
    
    calculateBudget();
}

function calculateBudget() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const loan = parseFloat(document.getElementById('loan').value) || 0;
    const totalInsurance = lists.insurance.reduce((sum, item) => sum + item.amt, 0);
    
    const netIncomeWarning = document.getElementById('net-income-warning');
    if ((loan + totalInsurance) > income && income > 0) {
        netIncomeWarning.classList.remove('hidden');
    } else {
        netIncomeWarning.classList.add('hidden');
    }
    
    const pcts = {
        needs: parseFloat(document.getElementById('needs-slider').value),
        wants: parseFloat(document.getElementById('wants-slider').value),
        savings: parseFloat(document.getElementById('savings-slider').value)
    };

    if (pcts.needs + pcts.wants + pcts.savings !== 100) {
        return document.getElementById('split-error').classList.remove('hidden');
    } else {
        document.getElementById('split-error').classList.add('hidden');
    }

    let netIncome = income - loan - totalInsurance;
    if (netIncome < 0) netIncome = 0; 

    budgets.needs = netIncome * (pcts.needs / 100);
    budgets.wants = netIncome * (pcts.wants / 100);
    budgets.savings = netIncome * (pcts.savings / 100);

    document.getElementById('net-income').innerText = formatINR(netIncome);
    document.getElementById('needs-amt').innerText = formatINR(budgets.needs);
    document.getElementById('wants-amt').innerText = formatINR(budgets.wants);
    document.getElementById('savings-amt').innerText = formatINR(budgets.savings);

    // NEW: Update the display badges near the tracker headings
    document.getElementById('limit-needs').innerText = `(Budget: ₹${formatINR(budgets.needs)})`;
    document.getElementById('limit-wants').innerText = `(Budget: ₹${formatINR(budgets.wants)})`;
    document.getElementById('limit-savings').innerText = `(Budget: ₹${formatINR(budgets.savings)})`;

    renderTracker('needs'); renderTracker('wants'); renderTracker('goals');
    triggerPulseAnimation('budget-results');
}

function addTrackerItem(category) {
    let budgetLimit = category === 'goals' ? budgets.savings : budgets[category];
    if (budgetLimit === 0) return alert("Calculate budget first!");

    let nameId = category === 'goals' ? 'goal-name' : `${category.slice(0,-1)}-name`;
    let amtId = category === 'goals' ? 'goal-monthly' : `${category.slice(0,-1)}-amt`;
    
    const name = document.getElementById(nameId).value || `Unnamed ${category}`;
    const monthly = parseFloat(document.getElementById(amtId).value) || 0;
    const target = category === 'goals' ? (parseFloat(document.getElementById('goal-target').value) || 0) : null;
    
    if (monthly <= 0) return alert("Enter valid amount.");

    let allocated = lists[category].reduce((sum, item) => sum + item.monthly, 0);
    if (allocated + monthly > budgetLimit) {
        return document.getElementById(`${category}-warning`).classList.remove('hidden');
    } else {
        document.getElementById(`${category}-warning`).classList.add('hidden');
    }

    lists[category].push({
        id: Date.now(), name, monthly, target,
        color: chartColors[lists[category].length % chartColors.length]
    });

    document.getElementById(nameId).value = '';
    document.getElementById(amtId).value = '';
    if(target) document.getElementById('goal-target').value = '';

    renderTracker(category);
    triggerPulseAnimation(`${category}-list`);
}

function deleteTrackerItem(category, id) {
    lists[category] = lists[category].filter(item => item.id !== id);
    document.getElementById(`${category}-warning`).classList.add('hidden');
    renderTracker(category);
}

function renderTracker(category) {
    let budgetLimit = category === 'goals' ? budgets.savings : budgets[category];
    const listEl = document.getElementById(`${category}-list`);
    listEl.innerHTML = '';
    let cumulativeMonthly = 0;
    let gradientStops = [];

    lists[category].forEach(item => {
        cumulativeMonthly += item.monthly;
        let cumulativePct = cumulativeMonthly / budgetLimit;
        
        let subtext = `₹${formatINR(item.monthly)}/mo`;
        let segmentColor = item.color;
        
        if (category === 'goals') {
            let m = Math.ceil(item.target / item.monthly);
            subtext += ` • Goal: ₹${formatINR(item.target)} • Reach in ${Math.floor(m/12)>0 ? Math.floor(m/12)+'y ' : ''}${m%12}m`;
            
            let factor = 0;
            if (cumulativePct > 0.6) {
                factor = (cumulativePct - 0.6) / 0.4; 
                if (factor > 1) factor = 1;
            }
            segmentColor = blendToDarkRed(item.color, factor);
        }

        listEl.innerHTML += `
            <div class="item-card" style="border-left-color: ${segmentColor};">
                <div class="item-info"><h4>${item.name}</h4><p>${subtext}</p></div>
                <button class="delete-btn" onclick="deleteTrackerItem('${category}', ${item.id})">Remove</button>
            </div>`;
            
        item.displayColor = segmentColor;
    });

    if (category === 'goals') {
        const dash = document.getElementById('goals-dashboard');
        const bar = document.getElementById('chart-bar');
        dash.classList.toggle('hidden', lists.goals.length === 0);
        bar.innerHTML = lists.goals.map(g => `<div class="chart-segment" style="width:${(g.monthly/budgetLimit)*100}%; background:${g.displayColor};" title="${g.name}: ₹${formatINR(g.monthly)}/mo"></div>`).join('');
    } else {
        const pie = document.getElementById(`${category}-pie`);
        if (lists[category].length === 0) {
            pie.style.display = 'none';
        } else {
            pie.style.display = 'block';
            let currentAngle = 0;
            lists[category].forEach(item => {
                let angle = (item.monthly / budgetLimit) * 100;
                gradientStops.push(`${item.displayColor || item.color} ${currentAngle}% ${currentAngle + angle}%`);
                currentAngle += angle;
            });
            gradientStops.push(`var(--chart-bg) ${currentAngle}% 100%`);
            pie.style.background = `conic-gradient(${gradientStops.join(', ')})`;
        }
    }
}

const tooltip = document.getElementById('pie-tooltip');
['needs', 'wants'].forEach(category => {
    const pie = document.getElementById(`${category}-pie`);
    pie.addEventListener('mousemove', (e) => {
        let budgetLimit = budgets[category];
        if(budgetLimit === 0 || lists[category].length === 0) return;

        const rect = pie.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        let percentage = (angle / 360) * 100;
        let currentPct = 0;
        let hoveredItem = null;

        for (let item of lists[category]) {
            let itemPct = (item.monthly / budgetLimit) * 100;
            if (percentage >= currentPct && percentage <= currentPct + itemPct) { hoveredItem = item; break; }
            currentPct += itemPct;
        }

        if (hoveredItem) {
            tooltip.innerText = `${hoveredItem.name}: ₹${formatINR(hoveredItem.monthly)}`;
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = e.pageY + 'px';
            tooltip.classList.remove('hidden');
        } else { tooltip.classList.add('hidden'); }
    });
    pie.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
});

const dictionary = {
    'Principal': 'The principal is the original amount of money you borrow from a lender. For example, if you take a loan of ₹50,000, that amount is the principal. It does not include any interest or additional charges. This amount gradually decreases as you make EMI payments over time.',
    'Interest Rate': 'The interest rate is the cost of borrowing money, expressed as a percentage of the principal. It can be fixed (remains constant throughout the loan tenure) or floating (changes based on market conditions). In India, personal loan interest rates typically range from 10% to 36% per annum. A higher credit score often helps secure lower rates.',
    'Collateral': 'Collateral is an asset you pledge as security for a loan, such as property, gold, or fixed deposits. Secured loans (like home or gold loans) require collateral and usually offer lower interest rates. Unsecured loans (like personal loans) do not require collateral but come with higher interest rates due to higher risk for lenders.',
    'Amortization': 'Amortization refers to the process of gradually reducing the loan balance through regular EMIs. In the initial stages, a major part of the EMI goes toward paying interest, with a smaller portion reducing the principal. Over time, this ratio reverses, and more of the EMI goes toward the principal.',
    'Loan Tenure': 'Loan tenure is the duration over which you agree to repay the loan. In India, personal loans usually have tenures from 1 to 5 years, while home loans can extend up to 30 years. A longer tenure reduces monthly EMI but increases the total interest paid, while a shorter tenure has higher EMIs but lowers overall interest cost.',
    'EMI': 'An EMI (Equated Monthly Installment) is the fixed amount you pay every month to repay your loan. It includes both a portion of the principal and the interest. The EMI amount depends on the loan amount, interest rate, and tenure. EMIs help in budgeting as they remain constant (for fixed-rate loans), making repayment predictable.',
    'Prepayment / Foreclosure': 'Prepayment means paying a part of the outstanding loan before the due date, reducing the principal and interest burden. Foreclosure refers to closing the entire loan early. While some lenders allow this, they may charge a prepayment penalty (usually 1–5%), especially on fixed-rate loans.',
    'Processing Fee': 'This is a one-time charge levied by the lender for processing your loan application. It typically ranges from 0.5% to 2.5% of the loan amount and is deducted from the disbursed sum. For example, on a ₹1 lakh loan with a 2% fee, you receive ₹98,000 after deduction.',
    'Credit Score': 'A credit score (ranging from 300 to 900 in India) reflects your creditworthiness based on your repayment history, credit utilization, and other factors. A score above 750 is considered good and increases your chances of loan approval with favorable terms. Banks and NBFCs use this score to assess lending risk.',
    'Default': 'Default occurs when you fail to make EMI payments as per the agreed schedule. After 90 days of non-payment, the loan is classified as a Non-Performing Asset (NPA). Defaulting damages your credit score, leads to penalties, and may result in legal action or asset seizure in case of secured loans.',
    'Hidden Interest Rates': 'Loan sharks often advertise low interest rates (e.g., “2% interest”) without clarifying whether it’s monthly or annual. A 2% monthly rate equals 24% annually, and with compounding, it can exceed 30%. Some charge interest on a daily basis, making the effective rate extremely high.',
    'Daily or Weekly Collections': 'Instead of monthly EMIs, illegal lenders may demand daily or weekly payments. Missing even one payment triggers heavy penalties. This constant pressure keeps borrowers in a cycle of stress and makes it difficult to plan finances, often leading to further borrowing.',
    'Blank Cheques or Documents': 'Borrowers are often made to sign blank cheques or incomplete loan agreements. These documents can later be misused to claim higher amounts or initiate legal action fraudulently. This practice is common in unregulated lending and can lead to financial and legal trouble.',
    'Harassment Tactics': 'Loan sharks use threats, frequent calls, public shaming, and even physical intimidation to recover money. They may contact your family, friends, or employer to pressure you. Online loan apps may misuse access to your phone contacts and photos to blackmail you.',
    'Fake Loan Apps': 'Unregulated mobile apps pose as legitimate lenders but operate illegally. They demand access to personal data and use it to harass or extort money. These apps are often not listed on official app stores and may disappear after collecting money or data.',
    'Excessive Penalties': 'Late fees can be unreasonably high—such as ₹500 per day—or interest may compound rapidly. A small delay can cause the debt to balloon quickly, making it nearly impossible to repay. These hidden charges are rarely disclosed upfront.',
    'No Written Agreement': 'Many illegal lenders avoid formal contracts, relying on verbal agreements. This lack of documentation leaves borrowers with no proof of the actual terms, making it hard to seek legal help or dispute unfair claims.',
    'Rolling Loans (Debt Trap)': 'If you can’t repay, lenders may offer another loan to cover the first. This creates a cycle: old debt + new debt + more interest. Borrowers end up paying endlessly without reducing the actual liability, falling into a deep debt trap.',
    'How to Protect Yourself': 'Always borrow from RBI-registered banks or NBFCs. Check the lender’s legitimacy using the RBI’s official directory of Digital Lending Apps (DLAs), available on its website. Read all terms carefully, especially whether the interest rate is annual or monthly. Avoid lenders who don’t provide a written agreement or demand blank documents.\n\nNever share personal data like contacts, photos, or Aadhaar without verifying the lender. Avoid apps that aren’t available on official app stores or lack transparency. If harassed, file a complaint with the bank’s grievance officer, then escalate to the RBI Banking Ombudsman if unresolved within 30 days.\n\nYou can also report illegal lenders to the National Cybercrime Reporting Portal (www.cybercrime.gov.in) or call the helpline at 1930. Under RBI guidelines, recovery agents cannot contact you before 7 AM or after 7 PM, use abusive language, or involve third parties. Know your rights—harassment is illegal, and you have legal recourse.'
};

const modal = document.getElementById('term-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

function openModal(term) {
    modalTitle.innerText = term;
    modalDesc.innerText = dictionary[term] || "Definition not found.";
    
    if (['Principal', 'Interest Rate', 'Collateral', 'Amortization', 'Loan Tenure', 'EMI', 'Prepayment / Foreclosure', 'Processing Fee', 'Credit Score', 'Default'].includes(term)) {
        modalTitle.style.color = '#6b8e23'; 
        document.querySelector('.modal-content').style.borderTopColor = '#6b8e23';
    } else if (term === 'How to Protect Yourself') {
        modalTitle.style.color = '#10b981';
        document.querySelector('.modal-content').style.borderTopColor = '#10b981';
    } else {
        modalTitle.style.color = '#ef4444'; 
        document.querySelector('.modal-content').style.borderTopColor = '#ef4444';
    }
    
    modal.classList.remove('hidden');
}

function closeModal() { modal.classList.add('hidden'); }
window.onclick = function(e) { if (e.target == modal) closeModal(); }