// AV Control Interface - Lighting Effects System
// Handles layered PNG lighting with CSS blend modes

class AVLightingInterface {
    constructor() {
        this.currentSource = null;
        this.tvStates = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false
        };
        this.projectorState = false;
        this.volumeStates = {
            'master': 75,
            'bar': 75,
            'dining': 60
        };
        this.audioSourceState = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.updateAudioDisplay();
        
        // Initialize audio source buttons to off state
        document.querySelectorAll('.audio-source-btn').forEach(btn => {
            const indicator = btn.querySelector('.toggle-indicator');
            if (indicator) {
                indicator.classList.add('off');
                indicator.classList.remove('on');
            }
        });
        
        console.log('AV Lighting Interface initialized');
    }
    
    setupEventListeners() {
        // Source selection (now handled by drag and drop)
        // Legacy click support for source items
        document.querySelectorAll('.source-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Only handle clicks if not dragging
                if (!e.target.classList.contains('dragging')) {
                    this.selectSourceFromItem(e.target.closest('.source-item'));
                }
            });
        });
        
        // TV and Projector power controls are now handled by touch zones
        // Users tap the TV/projector in the 3D view to access power controls
        
        // Audio source toggles (mutually exclusive)
        document.querySelectorAll('.audio-source-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const audioSource = e.target.closest('.audio-source-btn').getAttribute('data-audio-source');
                this.toggleAudioSource(audioSource);
            });
        });
        
        // Commercial break button
        document.getElementById('commercialBreakBtn').addEventListener('click', () => {
            this.triggerCommercialBreak();
        });
        
        // Volume sliders
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const zone = e.target.getAttribute('data-zone');
                const value = parseInt(e.target.value);
                this.setVolume(zone, value);
            });
        });
        
        // Preset buttons
        document.getElementById('allOn').addEventListener('click', () => this.allOn());
        document.getElementById('allOff').addEventListener('click', () => this.allOff());
        document.getElementById('sportsMode').addEventListener('click', () => this.sportsMode());
        document.getElementById('partyMode').addEventListener('click', () => this.partyMode());
        
        // Touch zone event listeners
        this.setupTouchZones();
        
        // Control container close button
        document.getElementById('closeControlBtn').addEventListener('click', () => {
            this.hideDisplayControls();
        });
        
        // Power control tab close button
        document.getElementById('closeTabBtn').addEventListener('click', () => {
            this.hidePowerControl();
        });
        
        // Power toggle button
        document.getElementById('powerToggleBtn').addEventListener('click', () => {
            this.togglePower();
        });
        
        // Click outside power tab to close
        document.addEventListener('click', (e) => {
            const tab = document.getElementById('powerControlTab');
            if (tab.classList.contains('show') && 
                !tab.contains(e.target) && 
                !e.target.closest('.tv-touch-zone')) {
                this.hidePowerControl();
            }
        });
        
        // Setup dynamic positioning for touch zones
        this.setupDynamicPositioning();
        
        // Setup drag and drop functionality
        this.setupDragAndDrop();
        
        // Handle window resize for dynamic positioning
        window.addEventListener('resize', () => {
            this.updateTouchZonePositions();
        });
    }
    
    selectSourceFromItem(sourceItem) {
        // Clear previous source selection
        document.querySelectorAll('.source-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Activate selected source
        sourceItem.classList.add('active');
        this.currentSource = sourceItem.getAttribute('data-source');
        
        // Show notification
        this.showNotification(`Source selected: ${sourceItem.querySelector('.source-label').textContent}`, 'info');
        
        // Note: Individual TV assignment is now handled by drag and drop
        // This just selects the source for potential assignment
    }
    
    selectSource(sourceBtn) {
        // Legacy function for backward compatibility
        // Clear previous source selection
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate selected source
        sourceBtn.classList.add('active');
        this.currentSource = sourceBtn.getAttribute('data-source');
        
        // Get target TVs for this source
        const targetTVs = sourceBtn.getAttribute('data-tvs').split(',').map(tv => parseInt(tv));
        
        // Turn on target TVs and turn off others
        for (let i = 1; i <= 6; i++) {
            if (targetTVs.includes(i)) {
                this.tvStates[i] = true;
            } else {
                this.tvStates[i] = false;
            }
        }
        
        // Turn off projector when selecting a video source
        this.projectorState = false;
        
        this.updateDisplay();
        this.showNotification(`Source: ${sourceBtn.querySelector('.source-label').textContent}`);
    }
    
    toggleTV(tvNumber) {
        this.tvStates[tvNumber] = !this.tvStates[tvNumber];
        this.updateDisplay();
        
        const status = this.tvStates[tvNumber] ? 'On' : 'Off';
        this.showNotification(`TV ${tvNumber}: ${status}`);
        
        // Update power control tab if it's open for this TV
        if (this.currentPowerDisplay === `tv${tvNumber}`) {
            this.showPowerControl(`tv${tvNumber}`);
        }
    }
    
    toggleProjector() {
        this.projectorState = !this.projectorState;
        this.updateDisplay();
        
        const status = this.projectorState ? 'On' : 'Off';
        this.showNotification(`Projector: ${status}`);
        
        // Update power control tab if it's open for projector
        if (this.currentPowerDisplay === 'projector') {
            this.showPowerControl('projector');
        }
    }
    
    toggleAudioSource(audioSource) {
        // Clear all audio source buttons
        document.querySelectorAll('.audio-source-btn').forEach(btn => {
            btn.classList.remove('active');
            const indicator = btn.querySelector('.toggle-indicator');
            if (indicator) {
                indicator.classList.remove('on');
                indicator.classList.add('off');
            }
        });
        
        // If clicking the same source that's already active, turn it off
        if (this.audioSourceState === audioSource) {
            this.audioSourceState = null;
            this.showNotification('Audio Source: Off');
        } else {
            // Activate the new source
            this.audioSourceState = audioSource;
            const activeBtn = document.querySelector(`[data-audio-source="${audioSource}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                const indicator = activeBtn.querySelector('.toggle-indicator');
                if (indicator) {
                    indicator.classList.remove('off');
                    indicator.classList.add('on');
                }
            }
            
            const sourceName = audioSource === 'main-music' ? 'Main Music' : 'Bar Input';
            this.showNotification(`Audio Source: ${sourceName} On`);
        }
        
        this.updateAudioDisplay();
    }
    
    triggerCommercialBreak() {
        // Add visual feedback to the button
        const btn = document.getElementById('commercialBreakBtn');
        btn.style.transform = 'scale(0.9)';
        btn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.8)';
        
        // Reset after animation
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }, 200);
        
        // Show notification
        this.showNotification('Commercial Break Activated!', 'success');
        
        // Here you would integrate with actual audio system
        // For now, we'll just log the action
        console.log('Commercial Break triggered - audio system should pause/resume');
        
        // You could add logic here to:
        // - Pause current audio
        // - Play commercial break audio
        // - Resume previous audio after break
        // - Update system status
    }
    
    setVolume(zone, volume) {
        this.volumeStates[zone] = volume;
        
        // Update slider display
        const slider = document.querySelector(`[data-zone="${zone}"]`);
        const valueDisplay = slider.parentElement.querySelector('.volume-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${volume}%`;
        }
        
        // Update system volume (simulated)
        this.updateSystemVolume(zone, volume);
    }
    
    updateSystemVolume(zone, volume) {
        // Simulate volume change in the system
        console.log(`${zone} volume set to ${volume}%`);
        
        // Here you would integrate with actual audio system
        // For now, we'll just log the change
    }
    
    updateDisplay() {
        // Update TV layer visibility based on states
        for (let i = 1; i <= 6; i++) {
            const layer = document.getElementById(`tv${i}Layer`);
            
            if (this.tvStates[i]) {
                // Turn on TV layer with lighting effect
                layer.style.opacity = '1';
                
                // Add glow effect
                layer.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))';
                
                console.log(`TV ${i} PNG layer turned ON - opacity: ${layer.style.opacity}`);
            } else {
                // Turn off TV layer
                layer.style.opacity = '0';
                
                // Remove glow effect
                layer.style.filter = 'none';
                
                console.log(`TV ${i} PNG layer turned OFF - opacity: ${layer.style.opacity}`);
            }
        }
        
        // Update projector layer
        const projectorLayer = document.getElementById('projectorLayer');
        
        if (this.projectorState) {
            projectorLayer.style.opacity = '1';
            projectorLayer.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))';
            
            console.log('Projector PNG layer turned ON - opacity:', projectorLayer.style.opacity);
        } else {
            projectorLayer.style.opacity = '0';
            projectorLayer.style.filter = 'none';
            
            console.log('Projector PNG layer turned OFF - opacity:', projectorLayer.style.opacity);
        }
        
        // Update source item states if no source is selected
        if (!this.currentSource) {
            document.querySelectorAll('.source-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    updateAudioDisplay() {
        // Update audio source buttons based on current state
        document.querySelectorAll('.audio-source-btn').forEach(btn => {
            const audioSource = btn.getAttribute('data-audio-source');
            const indicator = btn.querySelector('.toggle-indicator');
            
            if (this.audioSourceState === audioSource) {
                btn.classList.add('active');
                if (indicator) {
                    indicator.classList.remove('off');
                    indicator.classList.add('on');
                }
            } else {
                btn.classList.remove('active');
                if (indicator) {
                    indicator.classList.remove('on');
                    indicator.classList.add('off');
                }
            }
        });
    }
    
    setupTouchZones() {
        // Add click event listeners to all touch zones (TVs and projector)
        const touchZones = document.querySelectorAll('.tv-touch-zone');
        
        touchZones.forEach((zone) => {
            zone.addEventListener('click', (e) => {
                const displayType = e.target.getAttribute('data-display');
                this.showPowerControl(displayType);
            });
        });
    }
    
    setupDynamicPositioning() {
        // Store the original coordinates for each touch zone
        this.touchZoneCoordinates = {
            tv1: { points: "545,149 594,162 594,192 545,179" },
            tv2: { points: "477,132 526,144 526,174 477,161" },
            tv3: { points: "462,440 510,452 510,482 462,469" },
            tv4: { points: "543,461 592,473 592,503 543,490" },
            tv5: { points: "295,418 344,430 344,459 295,447" },
            tv6: { points: "229,75 278,87 278,117 229,104" },
            projector: { points: "131,433 179,396 179,444 131,480" }
        };
        
        // Initial positioning update
        this.updateTouchZonePositions();
    }
    
    updateTouchZonePositions() {
        const svg = document.querySelector('.display-outlines');
        if (!svg) return;
        
        const svgRect = svg.getBoundingClientRect();
        const scaleX = svgRect.width / 750;
        const scaleY = svgRect.height / 750;
        
        // Update all touch zones
        Object.keys(this.touchZoneCoordinates).forEach(displayType => {
            const zone = document.querySelector(`[data-display="${displayType}"]`);
            if (zone) {
                const originalPoints = this.touchZoneCoordinates[displayType].points;
                const scaledPoints = this.scalePoints(originalPoints, scaleX, scaleY);
                zone.setAttribute('points', scaledPoints);
            }
        });
    }
    
    scalePoints(pointsString, scaleX, scaleY) {
        return pointsString.split(' ').map(point => {
            const [x, y] = point.split(',').map(Number);
            return `${x * scaleX},${y * scaleY}`;
        }).join(' ');
    }
    
    setupDragAndDrop() {
        // Setup draggable source items
        const sourceItems = document.querySelectorAll('.source-item');
        sourceItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
        
        // Setup drop zones for TVs and projector
        const touchZones = document.querySelectorAll('.tv-touch-zone');
        touchZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }
    
    handleDragStart(e) {
        const sourceType = e.target.getAttribute('data-source');
        e.dataTransfer.setData('text/plain', sourceType);
        e.dataTransfer.effectAllowed = 'copy';
        
        // Add dragging class
        e.target.classList.add('dragging');
        
        // Show drop zones
        this.showDropZones();
        
        console.log(`Started dragging: ${sourceType}`);
    }
    
    handleDragEnd(e) {
        // Remove dragging class
        e.target.classList.remove('dragging');
        
        // Hide drop zones
        this.hideDropZones();
        
        console.log('Drag ended');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drop-zone-hover');
    }
    
    handleDragLeave(e) {
        e.target.classList.remove('drop-zone-hover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        const sourceType = e.dataTransfer.getData('text/plain');
        const displayType = e.target.getAttribute('data-display');
        
        // Remove drop zone styling
        e.target.classList.remove('drop-zone-hover');
        
        if (sourceType && displayType) {
            this.assignSourceToDisplay(sourceType, displayType);
            console.log(`Assigned ${sourceType} to ${displayType}`);
        }
    }
    
    showDropZones() {
        document.querySelectorAll('.tv-touch-zone').forEach(zone => {
            zone.classList.add('drop-zone');
        });
    }
    
    hideDropZones() {
        document.querySelectorAll('.tv-touch-zone').forEach(zone => {
            zone.classList.remove('drop-zone', 'drop-zone-hover');
        });
    }
    
    assignSourceToDisplay(sourceType, displayType) {
        // Turn on the display if it's off
        if (displayType.startsWith('tv')) {
            const tvNumber = displayType.replace('tv', '');
            if (!this.tvStates[tvNumber]) {
                this.toggleTV(tvNumber);
            }
        } else if (displayType === 'projector' && !this.projectorState) {
            this.toggleProjector();
        }
        
        // Set the source for this display
        this.currentSource = sourceType;
        
        // Update the display
        this.updateDisplay();
        
        // Show success notification
        this.showNotification(`${sourceType} assigned to ${displayType}`, 'success');
        
        // Update system status
        this.updateSystemStatus();
    }
    
    showPowerControl(displayType) {
        const tab = document.getElementById('powerControlTab');
        const title = document.getElementById('tabTitle');
        const powerBtn = document.getElementById('powerToggleBtn');
        
        // Set title based on display type
        if (displayType.startsWith('tv')) {
            const tvNumber = displayType.replace('tv', '');
            title.textContent = `TV ${tvNumber}`;
            
            // Update button based on current state
            const isOn = this.tvStates[tvNumber];
            this.updatePowerButtonState(powerBtn, isOn);
        } else if (displayType === 'projector') {
            title.textContent = 'Projector';
            
            // Update button based on current state
            const isOn = this.projectorState;
            this.updatePowerButtonState(powerBtn, isOn);
        }
        
        // Store current display type for power toggle
        this.currentPowerDisplay = displayType;
        
        // Position the tab near the clicked TV/projector
        this.positionPowerTab(displayType);
        
        // Show tab
        tab.classList.add('show');
    }
    
    updatePowerButtonState(powerBtn, isOn) {
        if (isOn) {
            powerBtn.classList.remove('power-off');
            powerBtn.innerHTML = '<span class="power-icon">⏻</span><span class="power-label">Power Off</span>';
        } else {
            powerBtn.classList.add('power-off');
            powerBtn.innerHTML = '<span class="power-icon">⏻</span><span class="power-label">Power On</span>';
        }
    }
    
    positionPowerTab(displayType) {
        const tab = document.getElementById('powerControlTab');
        const svg = document.querySelector('.display-outlines');
        const svgRect = svg.getBoundingClientRect();
        
        // Get the touch zone for this display
        const touchZone = document.querySelector(`[data-display="${displayType}"]`);
        if (!touchZone) return;
        
        // Get the bounding box of the touch zone
        const touchRect = touchZone.getBoundingClientRect();
        
        // Calculate position for the tab
        let left, top;
        
        if (displayType.startsWith('tv')) {
            // Position tab to the right of the TV
            left = touchRect.right + 10;
            top = touchRect.top - 30;
        } else if (displayType === 'projector') {
            // Position tab below the projector
            left = touchRect.left - 20;
            top = touchRect.bottom + 10;
        }
        
        // Ensure tab stays within viewport
        const tabRect = tab.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left + tabRect.width > viewportWidth - 20) {
            left = touchRect.left - tabRect.width - 10;
        }
        
        if (top + tabRect.height > viewportHeight - 20) {
            top = touchRect.top - tabRect.height + 30;
        }
        
        // Apply positioning
        tab.style.left = `${left}px`;
        tab.style.top = `${top}px`;
    }
    
    hidePowerControl() {
        const tab = document.getElementById('powerControlTab');
        tab.classList.remove('show');
        this.currentPowerDisplay = null;
    }
    
    togglePower() {
        if (!this.currentPowerDisplay) return;
        
        if (this.currentPowerDisplay.startsWith('tv')) {
            const tvNumber = this.currentPowerDisplay.replace('tv', '');
            this.toggleTV(tvNumber);
        } else if (this.currentPowerDisplay === 'projector') {
            this.toggleProjector();
        }
        
        // Update the power control display
        this.showPowerControl(this.currentPowerDisplay);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    selectDisplay(displayType) {
        // Clear previous selections
        document.querySelectorAll('.tv-touch-zone').forEach(zone => {
            zone.classList.remove('selected');
        });
        
        // Select new display
        const selectedZone = document.querySelector(`[data-display="${displayType}"]`);
        if (selectedZone) {
            selectedZone.classList.add('selected');
        }
        
        // Show custom control container
        this.showDisplayControls(displayType);
    }
    
    showDisplayControls(displayType) {
        const container = document.getElementById('displayControlContainer');
        const title = document.getElementById('controlTitle');
        const content = document.getElementById('controlContent');
        
        // Set title
        title.textContent = `${displayType.toUpperCase()} Control`;
        
        // Generate content based on display type
        if (displayType.startsWith('tv')) {
            const tvNumber = displayType.replace('tv', '');
            content.innerHTML = this.generateTVControls(tvNumber);
        } else if (displayType === 'projector') {
            content.innerHTML = this.generateProjectorControls();
        }
        
        // Show container
        container.classList.add('active');
    }
    
    hideDisplayControls() {
        const container = document.getElementById('displayControlContainer');
        container.classList.remove('active');
        
        // Clear selection
        document.querySelectorAll('.tv-touch-zone').forEach(zone => {
            zone.classList.remove('selected');
        });
    }
    
    generateTVControls(tvNumber) {
        const tvState = this.tvStates[tvNumber];
        const currentSource = this.currentSource || 'None';
        
        return `
            <div class="tv-control-content">
                <div class="control-row">
                    <label>Power:</label>
                    <span class="control-value">${tvState ? 'On' : 'Off'}</span>
                </div>
                <div class="control-row">
                    <label>Current Source:</label>
                    <span class="control-value">${currentSource}</span>
                </div>
                <div class="control-row">
                    <label>TV Number:</label>
                    <span class="control-value">${tvNumber}</span>
                </div>
                <div class="control-row">
                    <button class="tv-btn" data-tv="${tvNumber}" onclick="window.avInterface.toggleTV(${tvNumber})">
                        ${tvState ? 'Turn Off' : 'Turn On'}
                    </button>
                </div>
            </div>
        `;
    }
    
    generateProjectorControls() {
        const projectorState = this.projectorState;
        
        return `
            <div class="tv-control-content">
                <div class="control-row">
                    <label>Power:</label>
                    <span class="control-value">${projectorState ? 'On' : 'Off'}</span>
                </div>
                <div class="control-row">
                    <label>Device:</label>
                    <span class="control-value">Projector</span>
                </div>
                <div class="control-row">
                    <button class="projector-btn" onclick="window.avInterface.toggleProjector()">
                        ${projectorState ? 'Turn Off' : 'Turn On'}
                    </button>
                </div>
            </div>
        `;
    }
    
    // Preset Functions
    allOn() {
        for (let i = 1; i <= 6; i++) {
            this.tvStates[i] = true;
        }
        this.projectorState = true;
        this.updateDisplay();
        this.showNotification('All displays turned on');
    }
    
    allOff() {
        for (let i = 1; i <= 6; i++) {
            this.tvStates[i] = false;
        }
        this.projectorState = false;
        this.currentSource = null;
        this.updateDisplay();
        this.showNotification('All displays turned off');
    }
    
    sportsMode() {
        // Sports mode: Main TVs on cable 1
        this.currentSource = 'cable1';
        this.tvStates[1] = true;
        this.tvStates[2] = true;
        this.tvStates[3] = true;
        this.tvStates[4] = false;
        this.tvStates[5] = false;
        this.tvStates[6] = false;
        this.projectorState = false;
        
        // Update source button
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-source') === 'cable1') {
                btn.classList.add('active');
            }
        });
        
        // Set audio levels for sports
        this.setVolume('master', 85);
        this.setVolume('bar', 85);
        this.setVolume('dining', 75);
        
        this.updateDisplay();
        this.showNotification('Sports Mode activated');
    }
    
    partyMode() {
        // Party mode: All displays on Apple TV
        this.currentSource = 'appletv';
        for (let i = 1; i <= 6; i++) {
            this.tvStates[i] = true;
        }
        this.projectorState = true;
        
        // Update source button
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-source') === 'appletv') {
                btn.classList.add('active');
            }
        });
        
        // Set audio levels for party
        this.setVolume('master', 95);
        this.setVolume('bar', 95);
        this.setVolume('dining', 80);
        
        this.updateDisplay();
        this.showNotification('Party Mode activated');
    }
    
    // Lighting Effect Functions
    createLightingEffect(tvNumber) {
        const layer = document.getElementById(`tv${tvNumber}Layer`);
        
        // Add multiple lighting effects
        layer.style.mixBlendMode = 'screen';
        layer.style.filter = `
            brightness(1.3) 
            contrast(1.1) 
            drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))
            drop-shadow(0 0 60px rgba(255, 255, 255, 0.2))
        `;
        
        // Add ambient lighting effect
        this.addAmbientLighting(tvNumber);
    }
    
    addAmbientLighting(tvNumber) {
        // Create ambient lighting effect around the TV
        const ambientLight = document.createElement('div');
        ambientLight.className = 'ambient-light';
        ambientLight.id = `ambient${tvNumber}`;
        ambientLight.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 30%,
                transparent 70%
            );
            pointer-events: none;
            z-index: 3;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
        `;
        
        const view3D = document.getElementById('view3D');
        view3D.appendChild(ambientLight);
        
        // Fade in ambient lighting
        setTimeout(() => {
            ambientLight.style.opacity = '1';
        }, 100);
    }
    
    removeAmbientLighting(tvNumber) {
        const ambientLight = document.getElementById(`ambient${tvNumber}`);
        if (ambientLight) {
            ambientLight.style.opacity = '0';
            setTimeout(() => {
                ambientLight.remove();
            }, 800);
        }
    }
    
    // Enhanced lighting effects
    updateLightingEffects() {
        for (let i = 1; i <= 4; i++) {
            if (this.tvStates[i]) {
                this.createLightingEffect(i);
            } else {
                this.removeAmbientLighting(i);
            }
        }
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#00ff88' : type === 'warning' ? '#ffa502' : '#feca57'};
            color: ${type === 'success' || type === 'warning' ? 'black' : 'white'};
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // System status updates
    updateSystemStatus() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        // Check if any displays are on
        const anyTVsOn = Object.values(this.tvStates).some(state => state);
        const anyDisplaysOn = anyTVsOn || this.projectorState;
        
        if (anyDisplaysOn) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'System Active';
        } else {
            statusDot.className = 'status-dot warning';
            statusText.textContent = 'System Standby';
        }
    }
    
    // Get current system state
    getSystemState() {
        return {
            currentSource: this.currentSource,
            tvStates: { ...this.tvStates },
            volumeStates: { ...this.volumeStates }
        };
    }
    
    // Reset system
    resetSystem() {
        this.currentSource = null;
        for (let i = 1; i <= 6; i++) {
            this.tvStates[i] = false;
        }
        this.projectorState = false;
        this.updateDisplay();
        this.showNotification('System reset');
    }
}

// Initialize the interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avInterface = new AVLightingInterface();
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AVLightingInterface;
} 