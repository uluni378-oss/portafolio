// assets/js/tracking.js

const WA_NUMBER = "5217451085028";

/**
 * Tracks the click and opens the Pre-Lead Modal.
 */
function trackWhatsApp(source, customMessage = "") {
    // 1. Analytics Event Tracking (GA4)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'Lead Generation',
            'event_label': source,
            'page_location': window.location.href
        });
    }
    console.log(`[Tracking] WA Click recorded from: ${source} at ${new Date().toISOString()}`);

    // 2. Open Pre-Lead Modal instead of direct WA link
    openPreLeadModal(source, customMessage);
}

/**
 * Injects and opens the Pre-Lead Modal.
 */
function openPreLeadModal(source, customMessage) {
    // Create modal if it doesn't exist
    if (!document.getElementById('wa-pre-lead-modal')) {
        const modalHTML = `
            <div id="wa-pre-lead-modal" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl transform scale-95 transition-transform duration-300">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white flex items-center gap-2"><i class="fa-brands fa-whatsapp text-green-500"></i> Contacto Rápido</h3>
                        <button onclick="closePreLeadModal()" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button>
                    </div>
                    <form id="wa-lead-form" onsubmit="submitPreLeadForm(event)">
                        <input type="hidden" id="wa-source" value="">
                        <input type="hidden" id="wa-custom-msg" value="">
                        
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-400 mb-1">Tu Nombre</label>
                            <input type="text" id="wa-name" required class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="Ej. Juan Pérez">
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-400 mb-1">¿Qué necesitas o cuál es tu problema?</label>
                            <input type="text" id="wa-need" required class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="Ej. Necesito una landing page">
                        </div>
                        <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex justify-center items-center gap-2">
                            Continuar a WhatsApp <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </form>
                    <p class="text-center text-xs text-gray-500 mt-4">Redirección segura a WhatsApp Oficial.</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Set values and show
    document.getElementById('wa-source').value = source;
    document.getElementById('wa-custom-msg').value = customMessage;
    
    const modal = document.getElementById('wa-pre-lead-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');
}

/**
 * Closes the Pre-Lead Modal.
 */
function closePreLeadModal() {
    const modal = document.getElementById('wa-pre-lead-modal');
    if(modal) {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
    }
}

/**
 * Submits the form and redirects to WhatsApp.
 */
function submitPreLeadForm(e) {
    e.preventDefault();
    const name = document.getElementById('wa-name').value;
    const need = document.getElementById('wa-need').value;
    const source = document.getElementById('wa-source').value;
    let baseMsg = document.getElementById('wa-custom-msg').value;

    if (!baseMsg) {
        baseMsg = `Hola, vengo desde [${source}].`;
    }

    const finalMessage = `${baseMsg}\n\nSoy *${name}* y busco ayuda con: *${need}*.`;
    const encodedMessage = encodeURIComponent(finalMessage);
    
    closePreLeadModal();
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodedMessage}`, '_blank');
}

// Bind clicks on any element with data-wa-source
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-wa-source]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const source = btn.getAttribute('data-wa-source');
            const customMsg = btn.getAttribute('data-wa-msg') || "";
            trackWhatsApp(source, customMsg);
        });
    });
});
