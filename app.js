// === STATE ===
let currentStep = 1;
let petPhotoData = null;

// === NAVIGATION ===
function startForm() {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('step1').style.display = 'block';
    currentStep = 1;
    updateProgress();
    
    // Set default date to today
    document.getElementById('lastDate').valueAsDate = new Date();
}

function goToHero() {
    document.getElementById('hero').style.display = 'block';
    document.getElementById('formSection').style.display = 'none';
    hideAllSteps();
}

function nextStep(step) {
    if (!validateCurrentStep()) return;
    hideAllSteps();
    document.getElementById('step' + step).style.display = 'block';
    currentStep = step;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    hideAllSteps();
    document.getElementById('step' + step).style.display = 'block';
    currentStep = step;
    updateProgress();
}

function hideAllSteps() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById('step' + i).style.display = 'none';
    }
}

function updateProgress() {
    const fill = document.getElementById('progressFill');
    const indicator = document.getElementById('currentStep');
    fill.style.width = (currentStep * 25) + '%';
    indicator.textContent = currentStep;
}

// === VALIDATION ===
function validateCurrentStep() {
    const step = currentStep;
    
    if (step === 1) {
        const name = document.getElementById('petName').value.trim();
        const type = document.getElementById('petType').value;
        const color = document.getElementById('petColor').value.trim();
        
        if (!name || !type || !color) {
            alert('Please fill in the required fields (Name, Type, and Color)');
            return false;
        }
    }
    
    if (step === 3) {
        const location = document.getElementById('lastLocation').value.trim();
        const date = document.getElementById('lastDate').value;
        const zip = document.getElementById('zipCode').value.trim();
        
        if (!location || !date || !zip) {
            alert('Please fill in the location, date, and zip code');
            return false;
        }
    }
    
    if (step === 4) {
        const name = document.getElementById('ownerName').value.trim();
        const phone = document.getElementById('ownerPhone').value.trim();
        
        if (!name || !phone) {
            alert('Please enter your name and phone number');
            return false;
        }
    }
    
    return true;
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
        document.getElementById('previewImg').src = petPhotoData;
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    petPhotoData = null;
    document.getElementById('petPhoto').value = '';
    document.getElementById('uploadPlaceholder').style.display = 'flex';
    document.getElementById('photoPreview').style.display = 'none';
}

// === GENERATE RESULTS ===
function generateResults() {
    if (!validateCurrentStep()) return;
    
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Set zip in resources header
    document.getElementById('resourceZip').textContent = document.getElementById('zipCode').value;
    
    // Generate the flyer
    generateFlyer();
    
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
    const ownerName = document.getElementById('ownerName').value.trim();
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
    
    // Red header bar
    ctx.fillStyle = '#e63946';
    ctx.fillRect(0, 0, canvas.width, 120);
    
    // "LOST" text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOST ' + petType.toUpperCase(), canvas.width / 2, 85);
    
    // Pet photo area
    const photoY = 140;
    const photoHeight = 350;
    
    if (petPhotoData) {
        const img = new Image();
        img.onload = function() {
            // Calculate dimensions to fit photo
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
            
            // Draw photo with rounded corners effect (draw as rectangle for simplicity)
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 12);
            ctx.clip();
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
            
            // Draw border
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 12);
            ctx.stroke();
            
            // Continue drawing rest of flyer
            drawFlyerContent();
        };
        img.src = petPhotoData;
    } else {
        // No photo placeholder
        ctx.fillStyle = '#f1f3f4';
        ctx.beginPath();
        ctx.roundRect(40, photoY, canvas.width - 80, photoHeight, 12);
        ctx.fill();
        
        ctx.fillStyle = '#6c757d';
        ctx.font = '24px Inter, Arial, sans-serif';
        ctx.fillText('No Photo Available', canvas.width / 2, photoY + photoHeight / 2);
        
        drawFlyerContent();
    }
    
    function drawFlyerContent() {
        let y = photoY + photoHeight + 40;
        
        // Pet name
        ctx.fillStyle = '#1d3557';
        ctx.font = 'bold 48px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(petName.toUpperCase(), canvas.width / 2, y);
        y += 50;
        
        // Breed and details line
        ctx.font = '24px Inter, Arial, sans-serif';
        ctx.fillStyle = '#495057';
        let detailsLine = petBreed || petType;
        if (petColor) detailsLine += ' • ' + petColor;
        if (petSize) detailsLine += ' • ' + petSize;
        ctx.fillText(detailsLine, canvas.width / 2, y);
        y += 40;
        
        // Distinguishing features
        if (petFeatures) {
            ctx.font = 'italic 20px Inter, Arial, sans-serif';
            ctx.fillStyle = '#6c757d';
            const features = wrapText(ctx, '"' + petFeatures + '"', canvas.width - 100);
            features.forEach(line => {
                ctx.fillText(line, canvas.width / 2, y);
                y += 28;
            });
            y += 10;
        }
        
        // Divider
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(canvas.width - 60, y);
        ctx.stroke();
        y += 30;
        
        // Last seen info
        ctx.fillStyle = '#e63946';
        ctx.font = 'bold 22px Inter, Arial, sans-serif';
        ctx.fillText('LAST SEEN', canvas.width / 2, y);
        y += 30;
        
        ctx.fillStyle = '#1d3557';
        ctx.font = '22px Inter, Arial, sans-serif';
        ctx.fillText(lastLocation, canvas.width / 2, y);
        y += 28;
        ctx.fillStyle = '#6c757d';
        ctx.font = '20px Inter, Arial, sans-serif';
        ctx.fillText(formattedDate, canvas.width / 2, y);
        y += 40;
        
        // Reward if specified
        if (rewardAmount) {
            ctx.fillStyle = '#2a9d8f';
            ctx.font = 'bold 28px Inter, Arial, sans-serif';
            ctx.fillText('💰 REWARD: ' + rewardAmount, canvas.width / 2, y);
            y += 40;
        }
        
        // Contact section
        ctx.fillStyle = '#1d3557';
        ctx.fillRect(30, y, canvas.width - 60, 100);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Inter, Arial, sans-serif';
        ctx.fillText('IF FOUND, PLEASE CONTACT:', canvas.width / 2, y + 30);
        
        ctx.font = 'bold 32px Inter, Arial, sans-serif';
        ctx.fillText(ownerPhone, canvas.width / 2, y + 70);
        
        y += 115;
        
        if (ownerEmail) {
            ctx.fillStyle = '#495057';
            ctx.font = '18px Inter, Arial, sans-serif';
            ctx.fillText(ownerEmail, canvas.width / 2, y);
            y += 25;
        }
        
        // Footer
        y = canvas.height - 30;
        ctx.fillStyle = '#adb5bd';
        ctx.font = '14px Inter, Arial, sans-serif';
        ctx.fillText('Created with TheLostPetHQ.com — Free Lost Pet Tool', canvas.width / 2, y);
    }
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

// Polyfill for roundRect if needed
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
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

function shareFlyer() {
    const canvas = document.getElementById('flyerCanvas');
    const petName = document.getElementById('petName').value.trim();
    const petType = document.getElementById('petType').value;
    const lastLocation = document.getElementById('lastLocation').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    
    const shareText = `🚨 LOST ${petType.toUpperCase()}: ${petName}\n📍 Last seen: ${lastLocation}\n📞 Contact: ${ownerPhone}\n\nPlease share! Created with TheLostPetHQ.com`;
    
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
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        alert('Share text copied to clipboard! Paste it along with your downloaded flyer.');
    }).catch(() => {
        prompt('Copy this text to share:', text);
    });
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
    
    // Reset view
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('hero').style.display = 'block';
    hideAllSteps();
    
    currentStep = 1;
    updateProgress();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === FOOTER MODALS ===
function showAbout() {
    alert('The Lost Pet HQ is a free tool to help reunite lost pets with their families. We believe every pet deserves to find their way home.\n\nCreated with ❤️');
}

function showContact() {
    alert('Questions or feedback? Email us at hello@thelostpethq.com');
}
