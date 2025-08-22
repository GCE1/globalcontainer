// Container Carousel for 20GP CW products
class ContainerCarousel {
    constructor(containerId, containerType) {
        this.container = document.getElementById(containerId);
        this.containerType = containerType;
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        // 20GP CW container images
        this.cwImages = [
            '/attached_assets/20GP-Cw/20GP CW.png',
            '/attached_assets/20GP-Cw/20gp cw-2.png',
            '/attached_assets/20GP-Cw/20GP CW-3.png',
            '/attached_assets/20GP-Cw/20GP Cw-4.png',
            '/attached_assets/20GP-Cw/20gp Cw-5.png'
        ];
        
        this.init();
    }
    
    shouldShowCarousel() {
        const type = this.containerType.toLowerCase();
        return type.includes('cw') || 
               type.includes('cargo worthy') || 
               type.includes('20gp');
    }
    
    init() {
        if (!this.shouldShowCarousel() || !this.container) {
            return;
        }
        
        this.createCarouselHTML();
        this.bindEvents();
        this.startAutoPlay();
    }
    
    createCarouselHTML() {
        this.container.innerHTML = `
            <div class="carousel-wrapper" style="position: relative; width: 100%; height: 200px; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
                <div class="carousel-container" style="position: relative; width: 100%; height: 100%;">
                    <img id="carousel-image" src="${this.cwImages[0]}" alt="20GP CW Container" 
                         style="width: 100%; height: 100%; object-fit: contain; transition: opacity 0.3s ease;">
                    
                    <button class="carousel-prev" 
                            style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); 
                                   background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; 
                                   width: 32px; height: 32px; cursor: pointer; font-size: 16px;">‹</button>
                    
                    <button class="carousel-next" 
                            style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                   background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; 
                                   width: 32px; height: 32px; cursor: pointer; font-size: 16px;">›</button>
                    
                    <div class="carousel-counter" 
                         style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); 
                                color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        ${this.currentIndex + 1} / ${this.cwImages.length}
                    </div>
                </div>
                
                <div class="carousel-dots" style="display: flex; justify-content: center; margin-top: 8px; gap: 8px;">
                    ${this.cwImages.map((_, index) => 
                        `<button class="carousel-dot" data-index="${index}" 
                                 style="width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer;
                                        background: ${index === 0 ? '#42d1bd' : '#ccc'};"></button>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        const prevBtn = this.container.querySelector('.carousel-prev');
        const nextBtn = this.container.querySelector('.carousel-next');
        const dots = this.container.querySelectorAll('.carousel-dot');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.goToPrevious());
        if (nextBtn) nextBtn.addEventListener('click', () => this.goToNext());
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    }
    
    updateDisplay() {
        const image = this.container.querySelector('#carousel-image');
        const counter = this.container.querySelector('.carousel-counter');
        const dots = this.container.querySelectorAll('.carousel-dot');
        
        if (image) image.src = this.cwImages[this.currentIndex];
        if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.cwImages.length}`;
        
        dots.forEach((dot, index) => {
            dot.style.background = index === this.currentIndex ? '#42d1bd' : '#ccc';
        });
    }
    
    goToPrevious() {
        this.currentIndex = this.currentIndex === 0 ? this.cwImages.length - 1 : this.currentIndex - 1;
        this.updateDisplay();
    }
    
    goToNext() {
        this.currentIndex = this.currentIndex === this.cwImages.length - 1 ? 0 : this.currentIndex + 1;
        this.updateDisplay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateDisplay();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.goToNext();
        }, 3000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoPlay();
    }
}

// Export for use in other files
window.ContainerCarousel = ContainerCarousel;