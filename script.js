document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Message Box Functions (Replaces alert()) ---
    const customMessageBox = document.getElementById('customMessageBox');
    const messageText = document.getElementById('messageText');
    const closeMessageBoxBtn = customMessageBox.querySelector('.close-message-box');
    const okButton = customMessageBox.querySelector('.ok-button');

    // Function to show the custom message box
    const showMessageBox = (message) => {
        messageText.textContent = message;
        customMessageBox.style.display = 'flex'; // Show the box
        // Add animation class
        customMessageBox.querySelector('.message-content').classList.add('slide-in');
    };

    // Function to hide the custom message box
    const hideMessageBox = () => {
        // Remove animation class after transition
        const messageContent = customMessageBox.querySelector('.message-content');
        messageContent.classList.remove('slide-in');
        // A small delay to allow animation to play in reverse if needed, then hide
        setTimeout(() => {
            customMessageBox.style.display = 'none'; // Hide the box
        }, 300); // Match CSS transition duration
    };

    // Event listeners for the custom message box
    closeMessageBoxBtn.addEventListener('click', hideMessageBox);
    okButton.addEventListener('click', hideMessageBox);
    customMessageBox.addEventListener('click', (event) => {
        if (event.target === customMessageBox) {
            hideMessageBox(); // Hide if clicked on overlay
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && customMessageBox.style.display === 'flex') {
            hideMessageBox(); // Hide if ESC key pressed
        }
    });

    // Ensure message box is hidden on load (CSS also handles this, but good for JS consistency)
    hideMessageBox();


    // --- 1. Scrollable Product Images Gallery ---
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked thumbnail
            thumbnail.classList.add('active');
            // Update the main image source with a fade effect
            mainProductImage.style.opacity = 0; // Fade out
            setTimeout(() => {
                mainProductImage.src = thumbnail.dataset.image;
                mainProductImage.style.opacity = 1; // Fade in
            }, 200); // Half of CSS transition duration for smooth swap
        });
    });

    // --- 2. Size Chart Button with Modal ---
    const openSizeChartBtn = document.getElementById('openSizeChart');
    const sizeChartModal = document.getElementById('sizeChartModal');
    const closeSizeChartBtn = document.getElementById('closeSizeChart');

    // Open modal
    openSizeChartBtn.addEventListener('click', () => {
        sizeChartModal.style.display = 'flex'; // Use flex to center
        sizeChartModal.querySelector('.modal-content').classList.add('slide-in');
    });

    // Close modal via button
    closeSizeChartBtn.addEventListener('click', () => {
        sizeChartModal.querySelector('.modal-content').classList.remove('slide-in');
        setTimeout(() => {
            sizeChartModal.style.display = 'none';
        }, 300);
    });

    // Close modal via overlay click
    sizeChartModal.addEventListener('click', (event) => {
        if (event.target === sizeChartModal) {
            sizeChartModal.querySelector('.modal-content').classList.remove('slide-in');
            setTimeout(() => {
                sizeChartModal.style.display = 'none';
            }, 300);
        }
    });

    // Close modal via ESC key
    document.addEventListener('keydown', (event) => {
        // Only close size chart modal if it's currently open
        if (event.key === 'Escape' && sizeChartModal.style.display === 'flex') {
            sizeChartModal.querySelector('.modal-content').classList.remove('slide-in');
            setTimeout(() => {
                sizeChartModal.style.display = 'none';
            }, 300);
        }
    });

    // --- 3. Product Variants (Color and Size) ---
    const colorOptions = document.getElementById('colorOptions');
    const sizeOptions = document.getElementById('sizeOptions');

    // Function to update active state for variant buttons
    const updateVariantSelection = (container, activeClass, datasetKey) => {
        container.querySelectorAll(`.${activeClass}`).forEach(button => {
            button.addEventListener('click', () => {
                container.querySelectorAll(`.${activeClass}`).forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Optional: Persist selection to localStorage
                localStorage.setItem(`selected${datasetKey.charAt(0).toUpperCase() + datasetKey.slice(1)}`, button.dataset[datasetKey]);
                console.log(`Selected ${datasetKey}: ${button.dataset[datasetKey]}`);
                // In a real scenario, you'd update product image/price based on variant
            });
        });
    };

    updateVariantSelection(colorOptions, 'color-swatch', 'color');
    updateVariantSelection(sizeOptions, 'size-option', 'size');

    // Bonus: Persist selected color/size using localStorage on page load
    const loadSavedVariant = (container, activeClass, datasetKey) => {
        const savedValue = localStorage.getItem(`selected${datasetKey.charAt(0).toUpperCase() + datasetKey.slice(1)}`);
        if (savedValue) {
            const savedButton = container.querySelector(`[data-${datasetKey}="${savedValue}"]`);
            if (savedButton) {
                container.querySelectorAll(`.${activeClass}`).forEach(btn => btn.classList.remove('active'));
                savedButton.classList.add('active');
            }
        }
    };

    loadSavedVariant(colorOptions, 'color-swatch', 'color');
    loadSavedVariant(sizeOptions, 'size-option', 'size');


    // --- 4. Compare Colours Button with Modal ---
    const openCompareColorsBtn = document.getElementById('openCompareColors');
    const compareColorsModal = document.getElementById('compareColorsModal');
    const closeCompareColorsBtn = document.getElementById('closeCompareColors');
    const compareColorSwatches = document.querySelectorAll('.compare-color-options .compare-color-swatch');
    const selectedColorsDisplay = document.getElementById('selectedColorsDisplay');
    const clearCompareSelectionBtn = document.getElementById('clearCompareSelection');

    let selectedColors = []; // Array to store selected colors for comparison

    const updateSelectedColorsDisplay = () => {
        selectedColorsDisplay.innerHTML = ''; // Clear previous display
        if (selectedColors.length === 0) {
            selectedColorsDisplay.innerHTML = '<p>No colors selected for comparison.</p>';
            return;
        }
        selectedColors.forEach(colorData => {
            const colorItem = document.createElement('div');
            colorItem.classList.add('selected-color-item');
            colorItem.innerHTML = `
                <div class="swatch-display" style="background-color: ${colorData.hex};"></div>
                <span class="color-label">${colorData.label}</span>
            `;
            selectedColorsDisplay.appendChild(colorItem);
        });
    };

    // Open Compare Colors modal
    openCompareColorsBtn.addEventListener('click', () => {
        compareColorsModal.style.display = 'flex';
        compareColorsModal.querySelector('.modal-content').classList.add('slide-in');
        updateSelectedColorsDisplay(); // Initialize display
    });

    // Close Compare Colors modal via button
    closeCompareColorsBtn.addEventListener('click', () => {
        compareColorsModal.querySelector('.modal-content').classList.remove('slide-in');
        setTimeout(() => {
            compareColorsModal.style.display = 'none';
        }, 300);
    });

    // Close Compare Colors modal via overlay click
    compareColorsModal.addEventListener('click', (event) => {
        if (event.target === compareColorsModal) {
            compareColorsModal.querySelector('.modal-content').classList.remove('slide-in');
            setTimeout(() => {
                compareColorsModal.style.display = 'none';
            }, 300);
        }
    });

    // Close Compare Colors modal via ESC key
    document.addEventListener('keydown', (event) => {
        // Only close compare colors modal if it's currently open
        if (event.key === 'Escape' && compareColorsModal.style.display === 'flex') {
            compareColorsModal.querySelector('.modal-content').classList.remove('slide-in');
            setTimeout(() => {
                compareColorsModal.style.display = 'none';
            }, 300);
        }
    });

    // Handle color swatch selection in compare modal
    compareColorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            const label = swatch.dataset.label;
            const hex = swatch.style.backgroundColor; // Get the actual background color

            const existingIndex = selectedColors.findIndex(item => item.color === color);

            if (existingIndex > -1) {
                // If already selected, deselect it
                selectedColors.splice(existingIndex, 1);
                swatch.classList.remove('selected');
            } else {
                // If not selected, add it
                selectedColors.push({ color, label, hex });
                swatch.classList.add('selected');
            }
            updateSelectedColorsDisplay();
        });
    });

    // Clear selection in compare modal
    clearCompareSelectionBtn.addEventListener('click', () => {
        selectedColors = [];
        compareColorSwatches.forEach(swatch => swatch.classList.remove('selected'));
        updateSelectedColorsDisplay();
    });


    // --- 7. Tabs for Product Info ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('fade-in')); // Remove fade-in from previous

            // Add active class to the clicked button
            button.classList.add('active');

            // Show the corresponding tab pane with fade-in animation
            const targetTabId = button.dataset.tab;
            const targetPane = document.getElementById(targetTabId);
            targetPane.classList.add('active');
            targetPane.classList.add('fade-in'); // Add fade-in for the new active tab
        });
    });

    // --- Bonus: Image Zoom on Hover for Main Product Image ---
    const imageZoomArea = document.querySelector('.image-zoom-area'); // This element is in HTML but not directly used for zoom
                                                                    // The zoom is applied directly to mainProductImage
    mainProductImage.addEventListener('mousemove', (e) => {
        // Only apply zoom on larger screens to avoid issues on mobile
        if (window.innerWidth > 767) {
            const { left, top, width, height } = mainProductImage.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;

            mainProductImage.style.transformOrigin = `${x}% ${y}%`;
            mainProductImage.style.transform = 'scale(1.5)'; // Adjust zoom level
        }
    });

    mainProductImage.addEventListener('mouseleave', () => {
        mainProductImage.style.transformOrigin = 'center center';
        mainProductImage.style.transform = 'scale(1)';
    });

    // --- Basic Add to Cart / Buy Now button functionality (for demonstration) ---
    const addToCartButton = document.querySelector('.add-to-cart-button');
    const buyNowButton = document.querySelector('.buy-now-button');
    const addBundleToCartButton = document.querySelector('.add-bundle-to-cart');

    addToCartButton.addEventListener('click', () => {
        const quantity = document.getElementById('quantity').value;
        const selectedColor = colorOptions.querySelector('.color-swatch.active')?.dataset.color || 'N/A';
        const selectedSize = sizeOptions.querySelector('.size-option.active')?.dataset.size || 'N/A';
        console.log(`Added ${quantity} item(s) to cart: Color - ${selectedColor}, Size - ${selectedSize}`);
        // In a real app, this would add to a cart object/storage
        showMessageBox(`Successfully added ${quantity} Premium Canvas Backpack(s) (Color: ${selectedColor}, Size: ${selectedSize}) to your cart!`);
    });

    buyNowButton.addEventListener('click', () => {
        const quantity = document.getElementById('quantity').value;
        const selectedColor = colorOptions.querySelector('.color-swatch.active')?.dataset.color || 'N/A';
        const selectedSize = sizeOptions.querySelector('.size-option.active')?.dataset.size || 'N/A';
        console.log(`Buying ${quantity} item(s) now: Color - ${selectedColor}, Size - ${selectedSize}`);
        // In a real app, this would redirect to a checkout page
        showMessageBox(`Proceeding to checkout for ${quantity} Premium Canvas Backpack(s) (Color: ${selectedColor}, Size: ${selectedSize}).`);
    });

    addBundleToCartButton.addEventListener('click', () => {
        const combinedPrice = document.querySelector('.combined-price').textContent;
        console.log(`Added bundle to cart for ${combinedPrice}`);
        showMessageBox(`Successfully added the bundle to your cart for ${combinedPrice}!`);
    });
});
