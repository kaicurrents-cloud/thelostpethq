// === STATE ===
let currentStep = 1;
let petPhotoData = null;
let petMode = 'lost'; // 'lost' or 'found'
let flyerLanguage = 'en'; // 'en' or 'es'
let flyerTemplate = 'classic'; // 'classic', 'bold', 'minimal'

// === TRANSLATIONS ===
const translations = {
    en: {
        lost: 'LOST',
        found: 'FOUND',
        lastSeen: '📍 LAST SEEN',
        foundAt: '📍 FOUND AT',
        reward: '💰 REWARD:',
        ifFound: 'IF FOUND, PLEASE CONTACT:',
        isThisYours: 'IS THIS YOUR PET? CONTACT:',
        createdWith: 'Created with TheLostPetHQ.com — Free Lost Pet Tool',
        scanToCall: 'SCAN TO CALL'
    },
    es: {
        lost: 'PERDIDO',
        found: 'ENCONTRADO',
        lastSeen: '📍 VISTO POR ÚLTIMA VEZ',
        foundAt: '📍 ENCONTRADO EN',
        reward: '💰 RECOMPENSA:',
        ifFound: 'SI LO ENCUENTRA, CONTACTE:',
        isThisYours: '¿ES SU MASCOTA? CONTACTE:',
        createdWith: 'Creado con TheLostPetHQ.com — Herramienta Gratuita',
        scanToCall: 'ESCANEAR PARA LLAMAR'
    }
};

function setFlyerLanguage(lang) {
    flyerLanguage = lang;
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Regenerate flyer
    generateFlyer();
}

function setFlyerTemplate(template) {
    flyerTemplate = template;
    
    // Update button states
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.template === template) {
            btn.classList.add('active');
        }
    });
    
    // Regenerate flyer
    generateFlyer();
}

// Template color schemes
const templateStyles = {
    classic: {
        headerGradient: ['#dc2626', '#b91c1c'],
        headerGradientFound: ['#059669', '#047857'],
        contactGradient: ['#1e1b4b', '#312e81'],
        contactGradientFound: ['#065f46', '#047857'],
        accentColor: '#dc2626',
        accentColorFound: '#059669'
    },
    bold: {
        headerGradient: ['#000000', '#1a1a1a'],
        headerGradientFound: ['#000000', '#1a1a1a'],
        contactGradient: ['#dc2626', '#b91c1c'],
        contactGradientFound: ['#059669', '#047857'],
        accentColor: '#dc2626',
        accentColorFound: '#059669'
    },
    minimal: {
        headerGradient: ['#374151', '#1f2937'],
        headerGradientFound: ['#374151', '#1f2937'],
        contactGradient: ['#f3f4f6', '#e5e7eb'],
        contactGradientFound: ['#f3f4f6', '#e5e7eb'],
        accentColor: '#374151',
        accentColorFound: '#059669',
        contactTextDark: true
    }
};

// === NAVIGATION ===
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

function startForm(mode = 'lost') {
    petMode = mode;
    
    document.getElementById('hero').style.display = 'none';
    document.querySelector('.trust-bar').style.display = 'none';
    document.querySelector('.how-it-works').style.display = 'none';
    document.querySelector('.resources-section').style.display = 'none';
    document.querySelector('.testimonials-section').style.display = 'none';
    document.querySelector('.cta-section').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('step1').classList.add('active');
    currentStep = 1;
    updateProgressSteps();
    
    // Set default date to today
    document.getElementById('lastDate').valueAsDate = new Date();
    
    // Update UI for found mode
    if (mode === 'found') {
        document.querySelector('.form-card h2').textContent = '🐾 Found Pet Details';
        document.getElementById('lastDateLabel').textContent = 'Date Found';
        document.getElementById('lastLocationLabel').textContent = 'Where did you find them?';
        document.querySelector('.contact-section-title').textContent = 'Your Contact Info (Finder)';
        document.querySelector('.contact-section-desc').textContent = 'So the owner can reach you to claim their pet';
        document.getElementById('formSection').classList.add('found-mode');
        // Hide reward field for found pets
        const rewardGroup = document.getElementById('rewardAmount').closest('.form-group');
        if (rewardGroup) rewardGroup.style.display = 'none';
    } else {
        document.querySelector('.form-card h2').textContent = '📝 Pet Details';
        document.getElementById('lastDateLabel').textContent = 'Date Lost';
        document.getElementById('lastLocationLabel').textContent = 'Last Seen Location';
        document.querySelector('.contact-section-title').textContent = 'Your Contact Info';
        document.querySelector('.contact-section-desc').textContent = 'This goes on the flyer so finders can reach you';
        document.getElementById('formSection').classList.remove('found-mode');
        // Show reward field for lost pets
        const rewardGroup = document.getElementById('rewardAmount').closest('.form-group');
        if (rewardGroup) rewardGroup.style.display = '';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToHero() {
    document.getElementById('hero').style.display = 'flex';
    document.querySelector('.trust-bar').style.display = 'block';
    document.querySelector('.how-it-works').style.display = 'block';
    document.querySelector('.resources-section').style.display = 'block';
    document.querySelector('.testimonials-section').style.display = 'block';
    document.querySelector('.cta-section').style.display = 'block';
    document.getElementById('formSection').style.display = 'none';
    hideAllSteps();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(step) {
    if (!validateCurrentStep()) return;
    
    // Mark current step as completed
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    hideAllSteps();
    document.getElementById('step' + step).classList.add('active');
    currentStep = step;
    updateProgressSteps();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    hideAllSteps();
    document.getElementById('step' + step).classList.add('active');
    currentStep = step;
    updateProgressSteps();
}

function hideAllSteps() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById('step' + i).classList.remove('active');
    }
}

function updateProgressSteps() {
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active');
        if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

// === VALIDATION ===
function validateCurrentStep() {
    const step = currentStep;
    
    if (step === 1) {
        const name = document.getElementById('petName').value.trim();
        const type = document.getElementById('petType').value;
        const color = document.getElementById('petColor').value.trim();
        
        if (!name || !type || !color) {
            showError('Please fill in the required fields (Name, Type, and Color)');
            return false;
        }
    }
    
    if (step === 3) {
        const location = document.getElementById('lastLocation').value.trim();
        const date = document.getElementById('lastDate').value;
        const zip = document.getElementById('zipCode').value.trim();
        
        if (!location || !date || !zip) {
            showError('Please fill in the location, date, and zip code');
            return false;
        }
    }
    
    if (step === 4) {
        const name = document.getElementById('ownerName').value.trim();
        const phone = document.getElementById('ownerPhone').value.trim();
        
        if (!name || !phone) {
            showError('Please enter your name and phone number');
            return false;
        }
    }
    
    return true;
}

function showError(message) {
    // Simple alert for now, can be enhanced with a toast
    alert(message);
}

// === PHOTO HANDLING ===
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        petPhotoData = e.target.result;
        document.getElementById('uploadPlaceholder').style.display = 'none';
        document.getElementById('photoPreview').style.display = 'block';
        document.getElementById('photoPreview').classList.add('active');
        document.getElementById('previewImg').src = petPhotoData;
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    petPhotoData = null;
    document.getElementById('petPhoto').value = '';
    document.getElementById('uploadPlaceholder').style.display = 'flex';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoPreview').classList.remove('active');
}

// === GENERATE RESULTS ===
function generateResults() {
    if (!validateCurrentStep()) return;
    
    // Show loading state
    const formSection = document.getElementById('formSection');
    const resultsSection = document.getElementById('resultsSection');
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Creating your flyer...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Simulate brief loading for better UX
    setTimeout(() => {
        formSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Set zip in map header
        document.getElementById('mapZipCode').textContent = document.getElementById('zipCode').value;
        
        // Update results page for found vs lost mode
        const resultsTitle = document.querySelector('.results-header h1');
        const resultsSubtitle = document.querySelector('.results-header p');
        
        if (petMode === 'found') {
            resultsTitle.textContent = 'Found Pet Flyer Ready!';
            resultsSubtitle.textContent = 'Share this to help find the owner. Check local lost pet posts and shelters.';
            document.getElementById('resultsSection').classList.add('found-mode');
        } else {
            resultsTitle.textContent = 'Your Lost Pet Kit is Ready!';
            resultsSubtitle.textContent = 'Share the flyer everywhere and follow the checklist below. The first 24 hours are critical.';
            document.getElementById('resultsSection').classList.remove('found-mode');
        }
        
        // Generate the flyer
        generateFlyer();
        
        // Load flyer locations (simulated)
        loadFlyerLocations();
        
        // Remove loading overlay
        loadingOverlay.remove();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
}

// === FLYER GENERATION ===
function generateFlyer() {
    const canvas = document.getElementById('flyerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Get form data
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const petBreed = document.getElementById('petBreed').value.trim();
    const petColor = document.getElementById('petColor').value.trim();
    const petSize = document.getElementById('petSize').value;
    const petFeatures = document.getElementById('petFeatures').value.trim();
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const lastDate = document.getElementById('lastDate').value;
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const ownerEmail = document.getElementById('ownerEmail').value.trim();
    const rewardAmount = document.getElementById('rewardAmount').value.trim();
    
    // Format date
    const dateObj = new Date(lastDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradient header - use template colors
    const style = templateStyles[flyerTemplate];
    const headerColors = petMode === 'found' ? style.headerGradientFound : style.headerGradient;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 120);
    gradient.addColorStop(0, headerColors[0]);
    gradient.addColorStop(1, headerColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 120);
    
    // "LOST" or "FOUND" text (translated)
    const t = translations[flyerLanguage];
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    const headerText = petMode === 'found' ? t.found + ' ' : t.lost + ' ';
    ctx.fillText(headerText + petType.toUpperCase(), canvas.width / 2, 85);
    
    // Pet photo area
    const photoY = 140;
    const photoHeight = 350;
    
    if (petPhotoData) {
        const img = new Image();
        img.onload = function() {
            const maxWidth = canvas.width - 80;
            const maxHeight = photoHeight;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = height * (maxWidth / width);
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = width * (maxHeight / height);
                height = maxHeight;
            }
            
            const x = (canvas.width - width) / 2;
            const y = photoY + (photoHeight - height) / 2;
            
            // Draw photo with rounded corners
            ctx.save();
            roundRect(ctx, x, y, width, height, 16);
            ctx.clip();
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
            
            // Draw border
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 3;
            roundRect(ctx, x, y, width, height, 16);
            ctx.stroke();
            
            drawFlyerContent();
        };
        img.src = petPhotoData;
    } else {
        // No photo placeholder
        ctx.fillStyle = '#f3f4f6';
        roundRect(ctx, 40, photoY, canvas.width - 80, photoHeight, 16);
        ctx.fill();
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '24px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText('No Photo Available', canvas.width / 2, photoY + photoHeight / 2);
        
        drawFlyerContent();
    }
    
    function drawFlyerContent() {
        let y = photoY + photoHeight + 50;
        
        // Pet name
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 56px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(petName.toUpperCase(), canvas.width / 2, y);
        y += 50;
        
        // Breed and details
        ctx.font = '26px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillStyle = '#4b5563';
        let detailsLine = petBreed || petType;
        if (petColor) detailsLine += ' • ' + petColor;
        if (petSize) detailsLine += ' • ' + petSize;
        ctx.fillText(detailsLine, canvas.width / 2, y);
        y += 40;
        
        // Distinguishing features
        if (petFeatures) {
            ctx.font = 'italic 20px "Plus Jakarta Sans", Arial, sans-serif';
            ctx.fillStyle = '#6b7280';
            const features = wrapText(ctx, '"' + petFeatures + '"', canvas.width - 120);
            features.forEach(line => {
                ctx.fillText(line, canvas.width / 2, y);
                y += 28;
            });
            y += 10;
        }
        
        // Divider
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(canvas.width - 80, y);
        ctx.stroke();
        y += 35;
        
        // Location info - different label for found vs lost (translated)
        ctx.fillStyle = petMode === 'found' ? style.accentColorFound : style.accentColor;
        ctx.font = 'bold 22px "Plus Jakarta Sans", Arial, sans-serif';
        const locationLabel = petMode === 'found' ? t.foundAt : t.lastSeen;
        ctx.fillText(locationLabel, canvas.width / 2, y);
        y += 32;
        
        ctx.fillStyle = '#111827';
        ctx.font = '22px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(lastLocation, canvas.width / 2, y);
        y += 28;
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(formattedDate, canvas.width / 2, y);
        y += 40;
        
        // Reward (only for lost pets) - translated
        if (rewardAmount && petMode === 'lost') {
            ctx.fillStyle = '#059669';
            ctx.font = 'bold 28px "Plus Jakarta Sans", Arial, sans-serif';
            ctx.fillText(t.reward + ' ' + rewardAmount, canvas.width / 2, y);
            y += 45;
        }
        
        // Contact section
        const contactBoxY = y;
        const contactBoxHeight = 110;
        
        const contactColors = petMode === 'found' ? style.contactGradientFound : style.contactGradient;
        const contactGradient = ctx.createLinearGradient(30, contactBoxY, canvas.width - 30, contactBoxY);
        contactGradient.addColorStop(0, contactColors[0]);
        contactGradient.addColorStop(1, contactColors[1]);
        ctx.fillStyle = contactGradient;
        roundRect(ctx, 30, contactBoxY, canvas.width - 60, contactBoxHeight, 12);
        ctx.fill();
        
        ctx.fillStyle = style.contactTextDark ? '#111827' : '#ffffff';
        ctx.font = 'bold 20px "Plus Jakarta Sans", Arial, sans-serif';
        const contactLabel = petMode === 'found' ? t.isThisYours : t.ifFound;
        ctx.fillText(contactLabel, canvas.width / 2, contactBoxY + 35);
        
        ctx.font = 'bold 36px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(ownerPhone, canvas.width / 2, contactBoxY + 80);
        
        y = contactBoxY + contactBoxHeight + 20;
        
        if (ownerEmail) {
            ctx.fillStyle = '#6b7280';
            ctx.font = '18px "Plus Jakarta Sans", Arial, sans-serif';
            ctx.fillText(ownerEmail, canvas.width / 2, y);
            y += 30;
        }
        
        // Generate and draw QR code (phone number)
        if (typeof QRCode !== 'undefined' && ownerPhone) {
            const qrSize = 90;
            const qrX = canvas.width - qrSize - 40;
            const qrY = contactBoxY - qrSize - 20;
            
            // Create tel: link for QR
            const phoneClean = ownerPhone.replace(/\D/g, '');
            const telLink = 'tel:' + phoneClean;
            
            // Generate QR code to canvas
            const qrCanvas = document.createElement('canvas');
            QRCode.toCanvas(qrCanvas, telLink, { 
                width: qrSize,
                margin: 1,
                color: { dark: '#1e1b4b', light: '#ffffff' }
            }, function(error) {
                if (!error) {
                    // Draw white background for QR
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#e5e7eb';
                    ctx.lineWidth = 2;
                    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 35, 8);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw QR code
                    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
                    
                    // Label
                    ctx.fillStyle = '#6b7280';
                    ctx.font = '10px "Plus Jakarta Sans", Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(t.scanToCall, qrX + qrSize/2, qrY + qrSize + 15);
                    ctx.textAlign = 'center'; // Reset
                }
            });
        }
        
        // Footer
        y = canvas.height - 30;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(t.createdWith, canvas.width / 2, y);
    }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Helper function to wrap text
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

// === LOAD FLYER LOCATIONS ===
function loadFlyerLocations() {
    const zipCode = document.getElementById('zipCode').value;
    
    // Simulate loading
    setTimeout(() => {
        document.querySelector('.map-placeholder').innerHTML = `
            <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; text-align: center;">
                <p style="color: #6b7280; margin-bottom: 12px;">📍 High-traffic locations near <strong>${zipCode}</strong></p>
                <p style="font-size: 0.85rem; color: #9ca3af;">Post your flyer at these spots for maximum visibility</p>
            </div>
        `;
        
        // Populate sample locations (in real app, would use Google Places API)
        document.getElementById('dogParks').innerHTML = `
            <div class="location-item-simple">🌳 Local dog parks and walking trails</div>
            <div class="location-item-simple">🏃 Popular jogging paths</div>
        `;
        
        document.getElementById('vetOffices').innerHTML = `
            <div class="location-item-simple">🏥 Local veterinary clinics</div>
            <div class="location-item-simple">🐾 Animal hospitals</div>
        `;
        
        document.getElementById('petStores').innerHTML = `
            <div class="location-item-simple">🛒 PetSmart / Petco locations</div>
            <div class="location-item-simple">🏪 Local pet supply stores</div>
        `;
        
        document.getElementById('coffeeShops').innerHTML = `
            <div class="location-item-simple">☕ Coffee shops with bulletin boards</div>
            <div class="location-item-simple">📬 Community centers</div>
            <div class="location-item-simple">🏫 Libraries and post offices</div>
        `;
    }, 1500);
}

// === DOWNLOAD & SHARE ===
function downloadFlyer() {
    const canvas = document.getElementById('flyerCanvas');
    const link = document.createElement('a');
    const petName = document.getElementById('petName').value.trim() || 'pet';
    link.download = 'LOST-' + petName.toUpperCase().replace(/\s+/g, '-') + '-flyer.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

function downloadFlyerPDF() {
    const canvas = document.getElementById('flyerCanvas');
    const petName = document.getElementById('petName').value.trim() || 'pet';
    const { jsPDF } = window.jspdf;
    
    // Create PDF in letter size (8.5 x 11 inches)
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
    });
    
    // Get canvas as image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Calculate dimensions to fit nicely on letter paper with margins
    const pageWidth = 8.5;
    const pageHeight = 11;
    const margin = 0.5;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    // Canvas aspect ratio
    const canvasRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = imgWidth / canvasRatio;
    
    // If too tall, scale down
    if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * canvasRatio;
    }
    
    // Center on page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
    pdf.save('LOST-' + petName.toUpperCase().replace(/\s+/g, '-') + '-flyer.pdf');
}

function shareToFacebook() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    
    const text = encodeURIComponent(`🚨 LOST ${petType.toUpperCase()}: ${petName} - Last seen near ${lastLocation}. Please help share!`);
    const url = encodeURIComponent('https://thelostpethq.com');
    
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
    
    // Prompt to download flyer first
    alert('Tip: Download your flyer first, then attach it to your Facebook post for maximum visibility!');
}

function shareToNextdoor() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const text = `🚨 LOST ${petType.toUpperCase()}: ${petName}
📍 Last seen: ${lastLocation}
📞 Contact: ${ownerPhone}

Please share with neighbors! #LostPet`;
    
    navigator.clipboard.writeText(text).then(() => {
        window.open('https://nextdoor.com/news_feed/', '_blank');
        alert('Text copied! Paste it in your Nextdoor post and attach your downloaded flyer.');
    }).catch(() => {
        prompt('Copy this text for Nextdoor:', text);
        window.open('https://nextdoor.com/news_feed/', '_blank');
    });
}

function shareToTwitter() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const text = encodeURIComponent(`🚨 LOST ${petType.toUpperCase()}: ${petName}
📍 Last seen: ${lastLocation}
📞 ${ownerPhone}

Please RT! 🙏 #LostPet #LostDog #LostCat`);
    
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
}

function shareToWhatsApp() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const text = encodeURIComponent(`🚨 *LOST ${petType.toUpperCase()}*: ${petName}

📍 Last seen: ${lastLocation}
📞 Contact: ${ownerPhone}

Please share with your neighbors! 🙏
_Flyer created at TheLostPetHQ.com_`);
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
    
    // Prompt to download flyer
    setTimeout(() => {
        alert('Tip: Download your flyer first, then attach it to your WhatsApp message!');
    }, 500);
}

function shareViaSMS() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const text = encodeURIComponent(`🚨 LOST ${petType.toUpperCase()}: ${petName}! Last seen: ${lastLocation}. If found, call ${ownerPhone}. Please share!`);
    
    // Works on mobile, opens default SMS app
    window.location.href = `sms:?body=${text}`;
}

function shareViaEmail() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const ownerEmail = document.getElementById('ownerEmail').value.trim();
    
    const subject = encodeURIComponent(`URGENT: Lost ${petType} - ${petName} - Please Help!`);
    const body = encodeURIComponent(`Hi,

I'm reaching out because my ${petType}, ${petName}, has gone missing and I need help spreading the word.

📍 LAST SEEN: ${lastLocation}
📞 CONTACT: ${ownerPhone}
${ownerEmail ? '📧 EMAIL: ' + ownerEmail : ''}

If you see ${petName} or have any information, please contact me immediately.

Please forward this email to anyone in the area who might be able to help!

Thank you so much,
${document.getElementById('ownerName').value.trim()}

---
Flyer created with TheLostPetHQ.com - Free lost pet tools`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

async function copyFlyerToClipboard() {
    const canvas = document.getElementById('flyerCanvas');
    const btn = event.target.closest('button');
    
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        
        // Show feedback
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback - download instead
        alert('Clipboard copy not supported in this browser. Downloading instead...');
        downloadFlyer();
    }
}

function copyShareLink() {
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const shareText = `🚨 LOST ${petType.toUpperCase()}: ${petName}
📍 Last seen: ${lastLocation}
📞 Contact: ${ownerPhone}

Create a lost pet flyer free at: https://thelostpethq.com`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        // Show feedback
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        prompt('Copy this text:', shareText);
    });
}

function shareFlyer() {
    const canvas = document.getElementById('flyerCanvas');
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const shareText = `🚨 LOST ${petType.toUpperCase()}: ${petName}
📍 Last seen: ${lastLocation}
📞 Contact: ${ownerPhone}

Please share! Created with TheLostPetHQ.com`;
    
    if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'lost-pet-flyer.jpg', { type: 'image/jpeg' });
            const shareData = {
                title: 'LOST ' + petType + ': ' + petName,
                text: shareText,
                files: [file]
            };
            
            if (navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    fallbackShare(shareText);
                }
            } else {
                fallbackShare(shareText);
            }
        }, 'image/jpeg', 0.95);
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Share text copied to clipboard! Paste it along with your downloaded flyer.');
    }).catch(() => {
        prompt('Copy this text to share:', text);
    });
}

// === CHECKLIST PERSISTENCE ===
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressBar = document.getElementById('checklistProgress');
    const progressText = document.getElementById('checklistProgressText');
    
    // Load saved state
    const saved = JSON.parse(localStorage.getItem('lostpethq_checklist') || '{}');
    
    checkboxes.forEach((cb, index) => {
        // Restore state
        if (saved[index]) {
            cb.checked = true;
        }
        
        // Save on change
        cb.addEventListener('change', () => {
            const state = {};
            checkboxes.forEach((c, i) => {
                if (c.checked) state[i] = true;
            });
            localStorage.setItem('lostpethq_checklist', JSON.stringify(state));
            updateChecklistProgress();
        });
    });
    
    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressBar = document.getElementById('checklistProgress');
    const progressText = document.getElementById('checklistProgressText');
    
    if (!progressBar || !progressText) return;
    
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = Math.round((checked / total) * 100);
    
    progressBar.style.width = percent + '%';
    progressText.textContent = `${checked}/${total} completed (${percent}%)`;
    
    // Celebrate completion
    if (percent === 100 && checked > 0) {
        progressBar.classList.add('complete');
        progressText.textContent = '🎉 All done! Keep checking shelters daily.';
    } else {
        progressBar.classList.remove('complete');
    }
}

function resetChecklist() {
    if (confirm('Reset all checklist items? This cannot be undone.')) {
        localStorage.removeItem('lostpethq_checklist');
        document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        updateChecklistProgress();
    }
}

// Initialize checklist and time counter when results are shown
const originalGenerateResults = generateResults;
generateResults = function() {
    originalGenerateResults.apply(this, arguments);
    setTimeout(initChecklist, 100);
    setTimeout(initTimeElapsed, 100);
};

// === TIME ELAPSED COUNTER ===
let timeElapsedInterval;

function initTimeElapsed() {
    const dateInput = document.getElementById('lastDate').value;
    const timeInput = document.getElementById('lastTime').value || '12:00';
    const petName = document.getElementById('petName').value.trim();
    
    if (!dateInput) return;
    
    // Set pet name in display
    document.getElementById('petNameDisplay').textContent = petName;
    
    // Calculate and update
    updateTimeElapsed(dateInput, timeInput);
    
    // Update every minute
    if (timeElapsedInterval) clearInterval(timeElapsedInterval);
    timeElapsedInterval = setInterval(() => updateTimeElapsed(dateInput, timeInput), 60000);
}

function updateTimeElapsed(dateStr, timeStr) {
    const lostDate = new Date(dateStr + 'T' + timeStr);
    const now = new Date();
    const diffMs = now - lostDate;
    
    if (diffMs < 0) {
        document.getElementById('timeElapsed').textContent = 'Just now';
        return;
    }
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let timeStr2, message, alertClass;
    
    if (diffMins < 60) {
        timeStr2 = diffMins + ' minute' + (diffMins !== 1 ? 's' : '');
        message = '🟢 Great timing! Most pets are found within the first few hours.';
        alertClass = 'alert-good';
    } else if (diffHours < 4) {
        timeStr2 = diffHours + ' hour' + (diffHours !== 1 ? 's' : '');
        message = '🟡 Critical window! Act fast — share everywhere now.';
        alertClass = 'alert-urgent';
    } else if (diffHours < 24) {
        timeStr2 = diffHours + ' hour' + (diffHours !== 1 ? 's' : '');
        message = '🟠 Still in the critical period. Keep searching and sharing!';
        alertClass = 'alert-warning';
    } else if (diffDays < 7) {
        timeStr2 = diffDays + ' day' + (diffDays !== 1 ? 's' : '') + ', ' + (diffHours % 24) + ' hours';
        message = '📍 Don\'t give up! Many pets are found after several days.';
        alertClass = 'alert-info';
    } else {
        timeStr2 = diffDays + ' days';
        message = '💪 Keep going! Pets have been reunited after weeks or months.';
        alertClass = 'alert-info';
    }
    
    document.getElementById('timeElapsed').textContent = timeStr2;
    document.getElementById('timeMessage').textContent = message;
    
    const alertEl = document.getElementById('timeAlert');
    alertEl.className = 'time-alert ' + alertClass;
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(e) {
    // Only when results are visible
    const resultsVisible = document.getElementById('resultsSection').style.display !== 'none';
    if (!resultsVisible) return;
    
    // Ctrl/Cmd + D = Download JPG
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadFlyer();
        showToast('Downloading flyer...');
    }
    
    // Ctrl/Cmd + P = Print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    
    // Ctrl/Cmd + Shift + C = Copy image
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyFlyerToClipboard();
    }
});

function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === TIPS ACCORDION ===
function toggleTip(button) {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all tips
    document.querySelectorAll('.tip-item').forEach(tip => {
        tip.classList.remove('open');
    });
    
    // Open clicked one (if it wasn't already open)
    if (!isOpen) {
        item.classList.add('open');
    }
}

// === EMAIL CAPTURE ===
function handleEmailSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('emailCapture').value;
    
    // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
    // For now, store in localStorage and show success
    const emails = JSON.parse(localStorage.getItem('lostpethq_emails') || '[]');
    emails.push({ email, timestamp: Date.now() });
    localStorage.setItem('lostpethq_emails', JSON.stringify(emails));
    
    // Hide form, show success
    document.querySelector('.email-form').style.display = 'none';
    document.getElementById('emailSuccess').style.display = 'block';
    
    // Track in analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_signup', { event_category: 'engagement' });
    }
    
    console.log('Email captured:', email);
}

// === START OVER ===
function startOver() {
    // Reset form
    document.getElementById('petName').value = '';
    document.getElementById('petType').value = '';
    document.getElementById('petBreed').value = '';
    document.getElementById('petColor').value = '';
    document.getElementById('petSize').value = '';
    document.getElementById('petFeatures').value = '';
    document.getElementById('lastLocation').value = '';
    document.getElementById('lastDate').value = '';
    document.getElementById('lastTime').value = '';
    document.getElementById('zipCode').value = '';
    document.getElementById('ownerName').value = '';
    document.getElementById('ownerPhone').value = '';
    document.getElementById('ownerEmail').value = '';
    document.getElementById('rewardAmount').value = '';
    
    removePhoto();
    
    // Reset checklist
    document.querySelectorAll('.checklist-item input').forEach(cb => cb.checked = false);
    
    // Reset progress steps
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Reset view
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'none';
    
    goToHero();
    
    currentStep = 1;
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// === NAVBAR SCROLL EFFECT ===
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Add some CSS for location items via JS
const style = document.createElement('style');
style.textContent = `
    .location-item-simple {
        padding: 10px 12px;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 0.9rem;
        color: #374151;
    }
`;
document.head.appendChild(style);

// === PET ID CARD ===
let idCardPhotoData = null;

function openIdCardTool() {
    document.getElementById('idCardModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    generateIdCard(); // Generate preview
}

function closeIdCardModal() {
    document.getElementById('idCardModal').classList.remove('active');
    document.body.style.overflow = '';
}

function handleIdCardPhoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            idCardPhotoData = e.target.result;
            generateIdCard();
        };
        reader.readAsDataURL(file);
    }
}

function generateIdCard() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    
    const petName = document.getElementById('idCardPetName').value || 'PET NAME';
    const petType = document.getElementById('idCardPetType').value || 'Dog';
    const breed = document.getElementById('idCardBreed').value || '';
    const color = document.getElementById('idCardColor').value || '';
    const phone = document.getElementById('idCardPhone').value || '(XXX) XXX-XXXX';
    const microchip = document.getElementById('idCardMicrochip').value || '';
    const medical = document.getElementById('idCardMedical').value || '';
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Card border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    roundRect(ctx, 5, 5, canvas.width - 10, canvas.height - 10, 16);
    ctx.stroke();
    
    // Header
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 50);
    headerGradient.addColorStop(0, '#667eea');
    headerGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = headerGradient;
    roundRect(ctx, 5, 5, canvas.width - 10, 50, {tl: 14, tr: 14, br: 0, bl: 0});
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪪 PET ID CARD', canvas.width / 2, 38);
    
    // Photo area
    const photoX = 20;
    const photoY = 70;
    const photoSize = 100;
    
    if (idCardPhotoData) {
        const img = new Image();
        img.onload = function() {
            ctx.save();
            roundRect(ctx, photoX, photoY, photoSize, photoSize, 10);
            ctx.clip();
            
            // Center crop
            const scale = Math.max(photoSize / img.width, photoSize / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = photoX + (photoSize - w) / 2;
            const y = photoY + (photoSize - h) / 2;
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();
            
            // Photo border
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 2;
            roundRect(ctx, photoX, photoY, photoSize, photoSize, 10);
            ctx.stroke();
        };
        img.src = idCardPhotoData;
    } else {
        // Placeholder
        ctx.fillStyle = '#f3f4f6';
        roundRect(ctx, photoX, photoY, photoSize, photoSize, 10);
        ctx.fill();
        ctx.fillStyle = '#9ca3af';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📷', photoX + photoSize/2, photoY + photoSize/2 + 15);
    }
    
    // Info section
    const infoX = 140;
    let infoY = 85;
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(petName.toUpperCase(), infoX, infoY);
    infoY += 28;
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px "Plus Jakarta Sans", Arial, sans-serif';
    let details = petType;
    if (breed) details += ' • ' + breed;
    if (color) details += ' • ' + color;
    ctx.fillText(details, infoX, infoY);
    infoY += 25;
    
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('📞 ' + phone, infoX, infoY);
    infoY += 22;
    
    if (microchip) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText('Microchip: ' + microchip, infoX, infoY);
        infoY += 18;
    }
    
    // Medical notes at bottom
    if (medical) {
        ctx.fillStyle = '#dc2626';
        ctx.font = '12px "Plus Jakarta Sans", Arial, sans-serif';
        const medicalText = '⚠️ ' + medical;
        ctx.fillText(medicalText.substring(0, 50), 20, canvas.height - 45);
    }
    
    // Footer
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TheLostPetHQ.com — Keep this card in your wallet', canvas.width / 2, canvas.height - 15);
}

function downloadIdCard() {
    generateIdCard();
    setTimeout(() => {
        const canvas = document.getElementById('idCardCanvas');
        const link = document.createElement('a');
        const petName = document.getElementById('idCardPetName').value || 'pet';
        link.download = petName.toUpperCase().replace(/\s+/g, '-') + '-ID-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, 100);
}

// Update preview on input change
document.addEventListener('DOMContentLoaded', function() {
    const idCardInputs = document.querySelectorAll('#idCardModal input, #idCardModal select');
    idCardInputs.forEach(input => {
        input.addEventListener('input', generateIdCard);
    });
});

// === SIGHTING REPORTS ===
function openSightingModal() {
    document.getElementById('sightingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set default date to today
    document.getElementById('sightingDate').valueAsDate = new Date();
}

function closeSightingModal() {
    document.getElementById('sightingModal').classList.remove('active');
    document.body.style.overflow = '';
}

function submitSighting(e) {
    e.preventDefault();
    
    const sighting = {
        id: Date.now(),
        location: document.getElementById('sightingLocation').value,
        date: document.getElementById('sightingDate').value,
        time: document.getElementById('sightingTime').value || 'Unknown',
        description: document.getElementById('sightingDescription').value,
        contact: document.getElementById('sightingContact').value,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const sightings = JSON.parse(localStorage.getItem('lostpethq_sightings') || '[]');
    sightings.unshift(sighting);
    localStorage.setItem('lostpethq_sightings', JSON.stringify(sightings));
    
    // Update display
    displaySightings();
    
    // Close modal and show toast
    closeSightingModal();
    showToast('Sighting reported! Thank you for helping. 🙏');
    
    // Reset form
    e.target.reset();
}

function displaySightings() {
    const sightings = JSON.parse(localStorage.getItem('lostpethq_sightings') || '[]');
    const container = document.getElementById('sightingsList');
    
    if (sightings.length === 0) {
        container.innerHTML = `
            <div class="no-sightings">
                <span>📭</span>
                <p>No sightings reported yet. Share your flyer to get tips!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sightings.map(s => {
        const date = new Date(s.date + 'T' + (s.time || '12:00'));
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: s.time ? 'numeric' : undefined,
            minute: s.time ? '2-digit' : undefined
        });
        
        return `
            <div class="sighting-item">
                <div class="sighting-item-header">
                    <span class="sighting-location">📍 ${s.location}</span>
                    <span class="sighting-date">${formattedDate}</span>
                </div>
                ${s.description ? `<p class="sighting-desc">${s.description}</p>` : ''}
                ${s.contact ? `<p class="sighting-contact">Contact: ${s.contact}</p>` : ''}
            </div>
        `;
    }).join('');
}

// Load sightings when results are shown
const originalGenerateResults2 = generateResults;
generateResults = function() {
    originalGenerateResults2.apply(this, arguments);
    setTimeout(displaySightings, 100);
};

// === ANIMATED COUNTERS ===
function animateCounters() {
    const counters = document.querySelectorAll('.trust-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const format = counter.dataset.format;
        const suffix = counter.dataset.suffix || '';
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (format === 'K+') {
                    counter.textContent = Math.floor(current / 1000) + 'K+';
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (format === 'K+') {
                    counter.textContent = (target / 1000) + 'K+';
                } else {
                    counter.textContent = target.toLocaleString() + suffix;
                }
            }
        };
        
        updateCounter();
    });
}

// Run counter animation when trust bar is visible
document.addEventListener('DOMContentLoaded', function() {
    const trustBar = document.querySelector('.trust-bar');
    if (trustBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(trustBar);
    }
});
