// === STATE ===
let currentStep = 1;
let petPhotoData = null;

// === NAVIGATION ===
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

function startForm() {
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
    
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Set zip in map header
    document.getElementById('mapZipCode').textContent = document.getElementById('zipCode').value;
    
    // Generate the flyer
    generateFlyer();
    
    // Load flyer locations (simulated)
    loadFlyerLocations();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Gradient header
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 120);
    gradient.addColorStop(0, '#dc2626');
    gradient.addColorStop(1, '#b91c1c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 120);
    
    // "LOST" text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOST ' + petType.toUpperCase(), canvas.width / 2, 85);
    
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
        
        // Last seen info
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 22px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText('📍 LAST SEEN', canvas.width / 2, y);
        y += 32;
        
        ctx.fillStyle = '#111827';
        ctx.font = '22px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(lastLocation, canvas.width / 2, y);
        y += 28;
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(formattedDate, canvas.width / 2, y);
        y += 40;
        
        // Reward
        if (rewardAmount) {
            ctx.fillStyle = '#059669';
            ctx.font = 'bold 28px "Plus Jakarta Sans", Arial, sans-serif';
            ctx.fillText('💰 REWARD: ' + rewardAmount, canvas.width / 2, y);
            y += 45;
        }
        
        // Contact section
        const contactBoxY = y;
        const contactBoxHeight = 110;
        
        const contactGradient = ctx.createLinearGradient(30, contactBoxY, canvas.width - 30, contactBoxY);
        contactGradient.addColorStop(0, '#1e1b4b');
        contactGradient.addColorStop(1, '#312e81');
        ctx.fillStyle = contactGradient;
        roundRect(ctx, 30, contactBoxY, canvas.width - 60, contactBoxHeight, 12);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText('IF FOUND, PLEASE CONTACT:', canvas.width / 2, contactBoxY + 35);
        
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
                    ctx.fillText('SCAN TO CALL', qrX + qrSize/2, qrY + qrSize + 15);
                    ctx.textAlign = 'center'; // Reset
                }
            });
        }
        
        // Footer
        y = canvas.height - 30;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText('Created with TheLostPetHQ.com — Free Lost Pet Tool', canvas.width / 2, y);
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
