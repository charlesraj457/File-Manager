function switchRole(role) {
    // Update active class on buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.role === role) {
            btn.classList.add('active');
        }
    });

    // Update form logic based on role (placeholder if needed)
    console.log(`Switched to ${role} role`);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // Simulate login success
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

        // Check active role
        const activeRoleBtn = document.querySelector('.role-btn.active');
        const isAdmin = activeRoleBtn && activeRoleBtn.dataset.role === 'admin';

        setTimeout(() => {
            if (isAdmin) {
                window.location.href = 'pages/admin.html';
            } else {
                window.location.href = 'pages/dashboard.html';
            }
        }, 1500);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        if (typeof showToast === 'function') {
            showToast("Passwords do not match!", "error");
        } else {
            alert("Passwords do not match!");
        }
        return;
    }

    if (fullname && email && password) {
        // Simulate signup success
        const signupBtn = document.querySelector('.login-btn');
        const originalContent = signupBtn.innerHTML;
        signupBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast("Account created successfully! Please sign in.");
            } else {
                alert("Account created successfully! Please sign in.");
            }
            window.location.href = 'index.html';
        }, 1500);
    }
}


// Add event listeners for social buttons
// Social Login Handling
document.addEventListener('DOMContentLoaded', () => {
    // 1. Social Login Simulation
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual feedback
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';

            // Simulate network request
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 800);
        });
    });

    // 2. Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const allItems = document.querySelectorAll('.file-card, .folder-card');

            allItems.forEach(item => {
                const nameElement = item.querySelector('.file-name, span:not(.file-meta)');
                if (nameElement) {
                    const name = nameElement.textContent.toLowerCase();
                    if (name.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    }

    // 3. New Content Logic (Dropdown: Folder & Upload)
    const newBtn = document.getElementById('newBtn');
    const newDropdown = document.getElementById('newDropdown');
    const isDashboard = window.location.pathname.endsWith('dashboard.html') || window.location.pathname.endsWith('/') || window.location.pathname.split('/').pop() === 'dashboard.html';

    // State text for breadcrumb
    let currentPath = ['File Manager'];

    if (newBtn) {
        if (isDashboard) {
            // Toggle Dropdown
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (newDropdown) newDropdown.classList.toggle('show');
            });

            // --- File Upload Logic ---
            const fileUploadTrigger = document.getElementById('fileUploadTrigger');
            if (fileUploadTrigger) {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.multiple = true;
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);

                fileUploadTrigger.addEventListener('click', () => {
                    fileInput.click();
                    if (newDropdown) newDropdown.classList.remove('show');
                });

                fileInput.addEventListener('change', (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                        // Determine target grid: Current view
                        let targetGrid = document.querySelector('.grid-row.files');

                        // If we are inside a folder (simulated), we might want to append there.
                        // For this static demo, we just append to the visible file grid.

                        if (targetGrid) {
                            // Check for empty placeholder and remove it
                            const emptyPlaceholder = targetGrid.querySelector('.empty-folder-placeholder');
                            if (emptyPlaceholder) {
                                emptyPlaceholder.remove();
                            }

                            files.forEach(file => {
                                const fileCard = createFileCard(file);
                                targetGrid.insertBefore(fileCard, targetGrid.firstChild);
                            });
                            if (typeof showToast === 'function') showToast(`Uploaded ${files.length} file(s)`);
                        }
                        fileInput.value = '';
                    }
                });
            }

            // --- Folder Upload Logic ---
            const folderUploadTrigger = document.getElementById('folderUploadTrigger');
            if (folderUploadTrigger) {
                const folderInput = document.createElement('input');
                folderInput.type = 'file';
                folderInput.webkitdirectory = true;
                folderInput.multiple = true;
                folderInput.style.display = 'none';
                document.body.appendChild(folderInput);

                folderUploadTrigger.addEventListener('click', () => {
                    folderInput.click();
                    if (newDropdown) newDropdown.classList.remove('show');
                });

                folderInput.addEventListener('change', (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                        // Extract folder name from the first file's relative path
                        const firstFile = files[0];
                        const relativePath = firstFile.webkitRelativePath;
                        const folderName = relativePath.split('/')[0];

                        const foldersGrid = document.querySelector('.grid-row.folders');
                        if (foldersGrid && folderName) {
                            const folderCard = document.createElement('div');
                            folderCard.className = 'folder-card';
                            folderCard.dataset.folderName = folderName;
                            folderCard.innerHTML = `
                                <i class="fa-solid fa-folder"></i>
                                <span>${folderName}</span>
                            `;
                            // Prepend to folders grid
                            foldersGrid.insertBefore(folderCard, foldersGrid.firstChild);

                            // Bind standard click logic
                            if (typeof bindFolderClick === 'function') {
                                bindFolderClick(folderCard);
                            }

                            if (typeof showToast === 'function') showToast(`Uploaded folder "${folderName}" with ${files.length} files`);
                        }
                        folderInput.value = '';
                    }
                });
            }

            // --- New Folder Logic ---
            const newFolderTrigger = document.getElementById('newFolderTrigger');
            const newFolderModal = document.getElementById('newFolderModal');
            const createFolderBtn = document.getElementById('createFolderBtn');
            const cancelFolderBtn = document.getElementById('cancelFolderBtn');
            const folderNameInput = document.getElementById('folderNameInput');

            if (newFolderTrigger && newFolderModal) {
                // Open Modal
                newFolderTrigger.addEventListener('click', () => {
                    newFolderModal.style.display = 'flex';
                    if (newDropdown) newDropdown.classList.remove('show');
                    if (folderNameInput) {
                        folderNameInput.value = '';
                        setTimeout(() => folderNameInput.focus(), 100);
                    }
                });

                const closeFolderModal = () => {
                    newFolderModal.style.display = 'none';
                };

                if (cancelFolderBtn) {
                    cancelFolderBtn.addEventListener('click', closeFolderModal);
                }

                // Create Folder
                if (createFolderBtn) {
                    createFolderBtn.addEventListener('click', () => {
                        const name = folderNameInput.value.trim() || 'Untitled folder';

                        const foldersGrid = document.querySelector('.grid-row.folders');

                        if (foldersGrid) {
                            const folderCard = document.createElement('div');
                            folderCard.className = 'folder-card';
                            folderCard.dataset.folderName = name; // Metadata
                            folderCard.innerHTML = `
                                <i class="fa-solid fa-folder"></i>
                                <span>${name}</span>
                            `;
                            // Prepend
                            foldersGrid.insertBefore(folderCard, foldersGrid.firstChild);

                            // Re-bind click events for new folder
                            bindFolderClick(folderCard);

                            if (typeof showToast === 'function') showToast(`Folder "${name}" created`);
                        }

                        closeFolderModal();
                    });
                }

                // Close on click outside modal content
                newFolderModal.addEventListener('click', (e) => {
                    if (e.target === newFolderModal) closeFolderModal();
                });
            }

            // --- Folder Navigation Logic ---
            const breadcrumbTitle = document.querySelector('.breadcrumb h2');
            const fileExplorer = document.querySelector('.file-explorer');

            function bindFolderClick(folderCard) {
                folderCard.addEventListener('click', () => {
                    const folderName = folderCard.querySelector('span').innerText;
                    enterFolder(folderName);
                });
            }

            // Initial bind
            document.querySelectorAll('.folder-card').forEach(bindFolderClick);

            function enterFolder(folderName) {
                currentPath.push(folderName);
                updateBreadcrumb();

                // Hide Suggested and Folders sections, clear Files and show "Empty" or simulated content
                document.querySelectorAll('.section-group').forEach(section => {
                    const h3 = section.querySelector('h3');
                    if (h3 && (h3.innerText === 'Suggested' || h3.innerText === 'Folders')) {
                        section.style.display = 'none';
                    }
                });

                // Update Files Header
                const filesHeader = document.querySelector('.section-group h3');
                // Wait, there are multiple "section-group". The last one is usually files.
                // Let's target specific headers if possible or rely on structure.

                // For simulation: Clear existing files and show specific ones or empty state
                const filesGrid = document.querySelector('.grid-row.files');
                if (filesGrid) {
                    // Store original content if needed (not doing complex state management here)
                    // Just clearing for demo
                    filesGrid.innerHTML = '';

                    const emptyMsg = document.createElement('div');
                    emptyMsg.className = 'empty-folder-placeholder';
                    emptyMsg.style.gridColumn = '1 / -1';
                    emptyMsg.style.textAlign = 'center';
                    emptyMsg.style.color = 'var(--text-secondary)';
                    emptyMsg.style.padding = '3rem';
                    emptyMsg.innerHTML = '<i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>This folder is empty</p>';
                    filesGrid.appendChild(emptyMsg);
                }
            }

            function updateBreadcrumb() {
                if (breadcrumbTitle) {
                    // Create breadcrumb navigation
                    breadcrumbTitle.innerHTML = currentPath.map((path, index) => {
                        if (index === currentPath.length - 1) {
                            return `<span>${path}</span>`;
                        }
                        return `<span class="breadcrumb-link" style="cursor: pointer; color: var(--text-secondary);">${path}</span> <i class="fa-solid fa-angle-right" style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0.5rem;"></i>`;
                    }).join('');

                    // Re-bind clicks to breadcrumb links
                    const links = breadcrumbTitle.querySelectorAll('.breadcrumb-link');
                    links.forEach((link, index) => {
                        link.addEventListener('click', () => {
                            navigateToPath(index);
                        });
                    });
                }
            }

            function navigateToPath(index) {
                // Slice path
                currentPath = currentPath.slice(0, index + 1);
                updateBreadcrumb();

                // If index is 0 (Root), restore view
                if (index === 0) {
                    document.querySelectorAll('.section-group').forEach(section => {
                        section.style.display = 'block';
                    });

                    // Restore original files (Simulated reload or hardcoded restore)
                    const filesGrid = document.querySelector('.grid-row.files');
                    if (filesGrid) {
                        // Ideally we would restore from a stored state. 
                        // For now, let's just reload the page or manually reset HTML.
                        // Reloading is easiest to reset state for this static demo.
                        window.location.reload();
                    }
                }
            }
            updateBreadcrumb(); // Initial call to display "File Manager"
        } else {
            // Redirect
            newBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
    }
    // Theme Handling
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle?.querySelector('i');

    // Check saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fa-regular fa-sun';
        } else {
            themeIcon.className = 'fa-regular fa-moon';
        }
    }

    // Profile Dropdown Handling
    const profileTrigger = document.getElementById('profileDropdownTrigger');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Notification Dropdown Handling
    const notificationTrigger = document.getElementById('notificationTrigger');
    const notificationDropdown = document.getElementById('notificationDropdown');

    if (notificationTrigger && notificationDropdown) {
        notificationTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');

            // Close profile dropdown if open
            if (profileDropdown && profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });

        document.addEventListener('click', (e) => {
            if (!notificationTrigger.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }

    // Support Dropdown Handling
    const supportTrigger = document.getElementById('supportTrigger');
    const supportDropdown = document.getElementById('supportDropdown');

    if (supportTrigger && supportDropdown) {
        // Toggle dropdown on click
        const supportBtn = supportTrigger.querySelector('.action-btn');
        if (supportBtn) {
            supportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                supportDropdown.classList.toggle('show');

                // Close other dropdowns
                if (profileDropdown) profileDropdown.classList.remove('show');
                if (notificationDropdown) notificationDropdown.classList.remove('show');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!supportTrigger.contains(e.target)) {
                supportDropdown.classList.remove('show');
            }
        });

        // Handle Support Actions
        const helpBtn = document.getElementById('helpBtn');
        const feedbackBtn = document.getElementById('feedbackBtn');
        const teamsBtn = document.getElementById('teamsBtn');
        const policyBtn = document.getElementById('policyBtn');

        if (helpBtn) {
            helpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close dropdown
                supportDropdown.classList.remove('show');
                // Open modal
                const helpModal = document.getElementById('helpModal');
                if (helpModal) {
                    helpModal.style.display = 'flex';
                } else {
                    showToast('Opening Help Center...');
                }
            });
        }

        // Help Modal Close Logic
        const closeHelpBtn = document.getElementById('closeHelpBtn');
        const helpModal = document.getElementById('helpModal');
        if (closeHelpBtn && helpModal) {
            closeHelpBtn.addEventListener('click', () => {
                helpModal.style.display = 'none';
            });
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.style.display = 'none';
                }
            });
        }

        if (feedbackBtn) feedbackBtn.addEventListener('click', () => showToast('Send Feedback form opening...'));
        if (teamsBtn) teamsBtn.addEventListener('click', () => showToast('Opening Teams integration...'));
        if (policyBtn) policyBtn.addEventListener('click', () => showToast('Opening Policy...'));

        // Initialize File Preview Logic
        setupFilePreviewModal();
    }
});

function createFileCard(file) {
    const div = document.createElement('div');
    div.className = 'file-card';

    // Determine icon based on file type
    let iconClass = 'fa-regular fa-file';
    let iconColor = '#64748b';

    if (file.type.includes('image')) {
        iconClass = 'fa-regular fa-image';
        iconColor = '#4F46E5';
    } else if (file.type.includes('pdf')) {
        iconClass = 'fa-regular fa-file-pdf';
        iconColor = '#ef4444';
    } else if (file.type.includes('sheet') || file.type.includes('excel')) {
        iconClass = 'fa-regular fa-file-excel';
        iconColor = '#22c55e';
    }

    div.innerHTML = `
        <div class="file-preview">
            <i class="${iconClass}" style="color: ${iconColor};"></i>
        </div>
        <div class="file-info">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="file-name">${file.name}</span>
                <button class="more-actions-btn" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.2rem;">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </div>
            <span class="file-meta">Uploaded just now</span>
        </div>
    `;

    // Attach details listener (excluding more btn)
    const moreBtn = div.querySelector('.more-actions-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Trigger context menu at this location
            const rect = moreBtn.getBoundingClientRect();
            // Dispatch a custom contextmenu event or reuse existing logic?
            // Reuse existing context menu logic is best, but we need to mock the event or call a function.
            // Let's manually trigger the context menu logic.
            const contextMenu = document.getElementById('fileContextMenu');
            if (contextMenu) {
                contextMenu.style.top = `${rect.bottom}px`;
                contextMenu.style.left = `${rect.left - 150}px`; // Adjust to show to left
                contextMenu.classList.add('show');
                contextMenu.dataset.targetName = file.name;
                contextMenu.targetElement = div;
            }
        });
    }

    // Attach details listener
    attachFileCardListener(div, file.name, file.type || "Document", "Just now", (file.size / 1024 / 1024).toFixed(2) + " MB");

    return div;
}

// File Details Modal Functions
function setupFilePreviewModal() {
    const modal = document.getElementById('fileDetailModal');
    const closeBtnX = document.getElementById('closeDetailModal');
    const closeBtnFooter = document.getElementById('closeDetailBtn');
    const fileCards = document.querySelectorAll('.file-card, .folder-card');

    if (modal) {
        const closeAction = () => {
            modal.classList.remove('show');
        };

        if (closeBtnX) closeBtnX.addEventListener('click', closeAction);
        if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeAction);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Attach to existing cards
        fileCards.forEach(card => {
            const nameEl = card.querySelector('.file-name') || card.querySelector('span:not(.file-meta)');
            if (!nameEl) return;

            const fileName = nameEl.textContent;
            const meta = card.querySelector('.file-meta') ? card.querySelector('.file-meta').textContent : "Folder";

            // Infer type from icon or name
            let type = card.classList.contains('folder-card') ? "Folder" : "Document";
            if (fileName.includes('pdf')) type = "PDF Document";
            else if (fileName.includes('xls')) type = "Spreadsheet";
            else if (fileName.includes('img') || fileName.includes('png') || fileName.includes('jpg')) type = "Image";
            else if (fileName.includes('doc')) type = "Word Document";

            attachFileCardListener(card, fileName, type, meta, (Math.random() * 5 + 0.5).toFixed(1) + " MB");
        });
    }
}

function attachFileCardListener(card, fileName, fileType, fileDate, fileSize) {
    card.addEventListener('click', (e) => {
        // Prevent if clicking on actions inside card
        if (e.target.closest('button')) return;

        const modal = document.getElementById('fileDetailModal');
        if (!modal) return;

        // Populate Data
        document.getElementById('detailFileName').textContent = fileName;
        document.getElementById('detailFileType').textContent = fileType || "Document";
        document.getElementById('detailFileSize').textContent = fileSize || "Unknown";
        document.getElementById('detailUploadDate').textContent = fileDate || "Just now";
        document.getElementById('detailOwner').textContent = "John Doe"; // Static

        // Preview Logic
        const imagePreview = document.getElementById('imagePreview');
        const iconPreview = document.getElementById('iconPreview');
        const isImage = (fileType && fileType.toLowerCase().includes('image')) || fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

        if (isImage) {
            imagePreview.style.display = 'flex';
            iconPreview.style.display = 'none';
            // Use random placeholder 
            imagePreview.querySelector('img').src = `https://via.placeholder.com/600x400/e0e7ff/4f46e5?text=${encodeURIComponent(fileName)}`;
        } else {
            imagePreview.style.display = 'none';
            iconPreview.style.display = 'flex';
            // Reset icon
            let iconClass = 'fa-regular fa-file';
            if (fileName.includes('pdf')) iconClass = 'fa-regular fa-file-pdf';
            else if (fileName.includes('xls') || fileName.includes('csv')) iconClass = 'fa-regular fa-file-excel';
            else if (fileName.includes('doc')) iconClass = 'fa-regular fa-file-word';
            else if (fileName.includes('ppt')) iconClass = 'fa-regular fa-file-powerpoint';
            else if (fileName.includes('zip')) iconClass = 'fa-regular fa-file-zipper';

            iconPreview.querySelector('i').className = iconClass;
        }

        modal.classList.add('show');
    });
}

// Mobile Menu & Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = sidebar ? sidebar.querySelectorAll('.nav-item') : [];

    if (mobileMenuBtn && sidebarOverlay && sidebar) {
        // Toggle Sidebar
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
        });

        // Close on Overlay Click
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });

        // Close on Sidebar Link Click (so it collapses after navigation)
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
            });
        });
    }
});

// Toast Notification Helper
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        // Add toast icon if missing
        toast.innerHTML = `<i class="fa-solid fa-circle-check toast-icon"></i> <span class="toast-message"></span>`;
        document.body.appendChild(toast);
    }

    // Reset classes
    toast.className = `toast ${type}`;
    toast.querySelector('.toast-message').textContent = message;

    // Trigger reflow
    void toast.offsetWidth;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Settings Save Handler (Global availability)
window.saveSettings = function () {
    const btn = document.querySelector('.admin-content button'); // Target the save button
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Saving...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            showToast('Settings saved successfully!');
        }, 1200);
    } else {
        showToast('Settings saved successfully!');
    }
    return false; // Prevent form submit
}

// Filter and Sort Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Filter Dropdown Logic
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');

    if (filterBtn && filterDropdown) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdown.classList.toggle('show');
        });

        // Filter Options
        const filterOptions = filterDropdown.querySelectorAll('.dropdown-option');
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                // UI Update
                filterOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                filterDropdown.classList.remove('show');
                filterBtn.classList.add('active');

                const filterType = option.dataset.filter;
                applyFilter(filterType);
            });
        });
    }

    function applyFilter(type) {
        const items = document.querySelectorAll('.file-card, .folder-card');
        items.forEach(item => {
            if (type === 'all') {
                item.style.display = 'flex'; // Restore
                return;
            }

            // Infer type from icon
            const icon = item.querySelector('i');
            let itemType = 'other';

            if (icon && icon.classList.contains('fa-image')) itemType = 'image';
            else if (icon && (icon.classList.contains('fa-file-pdf') || icon.classList.contains('fa-file-lines') || icon.classList.contains('fa-file-word'))) itemType = 'document';
            else if (icon && (icon.classList.contains('fa-file-excel') || icon.classList.contains('fa-file-csv'))) itemType = 'spreadsheet';
            else if (icon && icon.classList.contains('fa-folder')) itemType = 'folder';

            if (type === itemType || (type === 'document' && itemType === 'spreadsheet')) { // Group sheets with docs if needed, or strict
                if (type === 'document' && itemType === 'spreadsheet') {
                    // Separate logic? No, let's include sheets in docs for simplicity or strict
                }
                if (type === itemType) item.style.display = 'flex';
                else item.style.display = 'none';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 3. View Mode Logic
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const fileGrid = document.querySelector('.grid-row.files');

    if (listViewBtn && gridViewBtn && fileGrid) {
        listViewBtn.addEventListener('click', () => {
            fileGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });

        gridViewBtn.addEventListener('click', () => {
            fileGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });
    }

    // 4. Context Menu Logic
    const contextMenu = document.getElementById('fileContextMenu');

    // Hide context menu on global click
    document.addEventListener('click', () => {
        if (contextMenu) contextMenu.classList.remove('show');
    });

    // Right-click on File/Folder Cards
    document.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.file-card') || e.target.closest('.folder-card');

        if (card && contextMenu) {
            e.preventDefault();

            // Positioning
            const x = e.clientX;
            const y = e.clientY;

            // Adjust if out of bounds (basic check)
            const menuWidth = 200;
            const menuHeight = 200;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            let posX = x;
            let posY = y;

            if (x + menuWidth > winWidth) posX = x - menuWidth;
            if (y + menuHeight > winHeight) posY = y - menuHeight;

            contextMenu.style.top = `${posY}px`;
            contextMenu.style.left = `${posX}px`;
            contextMenu.classList.add('show');

            // Optional: You could store the target card ID here to perform actions
            const name = card.querySelector('.file-name, span:not(.file-meta)') ? card.querySelector('.file-name, span:not(.file-meta)').innerText : 'Unknown';
            contextMenu.dataset.targetName = name;
            contextMenu.targetElement = card; // Store reference directly

            // Update Star Action Text/Icon based on state
            const starAction = contextMenu.querySelector('.context-item[data-action="star"]');
            if (starAction) {
                const icon = starAction.querySelector('i');
                const text = starAction.querySelector('span');
                if (isStarred(name)) {
                    if (icon) icon.className = 'fa-solid fa-star';
                    if (text) text.innerText = 'Remove from Starred';
                } else {
                    if (icon) icon.className = 'fa-regular fa-star';
                    if (text) text.innerText = 'Add to Starred';
                }
            }
        }
    });

    // Handle Context Menu Actions
    const contextActions = contextMenu ? contextMenu.querySelectorAll('.context-item') : [];
    contextActions.forEach(action => {
        action.addEventListener('click', () => {
            const actionType = action.dataset.action;
            const targetName = contextMenu.dataset.targetName || "Item";
            // Get the element that was right-clicked
            const targetElement = contextMenu.targetElement;

            contextMenu.classList.remove('show');

            if (actionType === 'star') {
                toggleStar(targetName, targetElement);
            } else if (actionType === 'open-with') {
                showToast(`Opening "${targetName}" with external app...`);
            } else if (actionType === 'share') {
                showToast(`Sharing "${targetName}"...`);
            } else if (actionType === 'restore') {
                restoreItem(targetName);
                if (targetElement) targetElement.remove();
                showToast(`Restored "${targetName}"`);
                renderTrashItems();
            } else if (actionType === 'delete') {
                const isTrashPage = window.location.pathname.endsWith('trash.html');
                const isStarredPage = window.location.pathname.endsWith('starred.html');
                const isStarredItem = isStarred(targetName);

                if (targetElement) {
                    if (isTrashPage) {
                        // Trash Page: Permanent Delete
                        if (confirm(`Permanently delete "${targetName}"?`)) {
                            permanentDelete(targetName);
                            targetElement.remove();
                            showToast(`Deleted "${targetName}" forever`);
                            renderTrashItems();
                        }
                    } else if (isStarredPage || isStarredItem) {
                        // Starred Item (Any Page) or Starred Page: Permanent Delete
                        if (confirm(`This starred item will be permanently deleted from all locations. Continue for "${targetName}"?`)) {
                            // Remove from Starred
                            removeFromStarred(targetName);
                            // Add to Permanent Deleted list (to persist deletion of static files)
                            addToPermanentDeleted(targetName);
                            // Remove from DOM
                            // If on dashboard, remove straight away. 
                            // If on starred, it's just the starred view, but we are deleting the FILE too.
                            targetElement.remove();

                            // If we happen to have this file in other views (e.g. if we are on Recent page), 
                            // we can't easily remove it from there without refresh or complex DOM logic.
                            // But usually we are only viewing one instance.

                            showToast(`Permanently deleted "${targetName}"`);

                            // If on starred page, force render to ensure empty state shows up if needed
                            if (isStarredPage) renderStarredItems();
                        }
                    } else {
                        // Standard File: Move to Trash
                        moveToTrash(targetElement, targetName);
                    }
                }
            } else {
                showToast(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)}: ${targetName}`);
            }
        });
    });

    // Empty Trash Logic (Specific to Trash Page)
    const emptyTrashBtn = document.querySelector('.empty-trash-btn');
    if (emptyTrashBtn) {
        emptyTrashBtn.addEventListener('click', () => {
            const items = getTrashItems();
            if (items.length > 0) {
                if (confirm('Are you sure you want to permanently delete all items?')) {
                    emptyTrash();
                    showToast('Trash emptied');
                }
            } else {
                showToast('Trash is already empty', 'info');
            }
        });
    }

    // Close Dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown-container')) {
            if (filterDropdown) filterDropdown.classList.remove('show');
        }
        if (!e.target.closest('.new-dropdown-container')) {
            const newDropdown = document.getElementById('newDropdown'); // Re-select to be safe inside closure or rely on global scope if defined
            if (newDropdown) newDropdown.classList.remove('show');
        }
    });
});

// --- Starred Items Logic ---

// Helper to get starred items from localStorage
function getStarredItems() {
    return JSON.parse(localStorage.getItem('starredItems')) || [];
}

// Helper to save starred items
function saveStarredItems(items) {
    localStorage.setItem('starredItems', JSON.stringify(items));
}

function toggleStar(itemName, element) {
    let items = getStarredItems();
    const existingIndex = items.findIndex(i => i.name === itemName);

    if (existingIndex > -1) {
        // Remove
        items.splice(existingIndex, 1);
        showToast(`Removed "${itemName}" from Starred`);
    } else {
        // Add
        // Try to get metadata from element
        let type = 'other';
        let size = 'Unknown';
        let date = 'Just now';

        if (element) {
            const icon = element.querySelector('i');
            if (icon && icon.classList.contains('fa-folder')) type = 'folder';
            else if (icon && icon.classList.contains('fa-image')) type = 'image';
            else if (icon && icon.classList.contains('fa-file-pdf')) type = 'document';
            // ... more logic could be added

            const meta = element.querySelector('.file-meta');
            if (meta) date = meta.textContent;
        }

        items.push({
            name: itemName,
            type: type,
            date: date,
            starredAt: new Date().toISOString()
        });
        showToast(`Added "${itemName}" to Starred`);
    }

    saveStarredItems(items);

    // Update Icons globally
    markStarredItems();

    // If on starred page, refresh list?
    if (window.location.pathname.endsWith('starred.html')) {
        renderStarredItems();
    }
}

function markStarredItems() {
    // This runs on dashboard, recent, shared etc. to visually indicate starred items
    const cards = document.querySelectorAll('.file-card, .folder-card');
    const starredItems = getStarredItems();
    const starredNames = new Set(starredItems.map(i => i.name));

    cards.forEach(card => {
        const nameEl = card.querySelector('.file-name, span:not(.file-meta)');
        if (!nameEl) return;
        const name = nameEl.innerText;

        // Check if already has star icon
        let starIcon = card.querySelector('.star-badge');

        if (starredNames.has(name)) {
            if (!starIcon) {
                // Create badge
                starIcon = document.createElement('div');
                starIcon.className = 'star-badge';
                starIcon.innerHTML = '<i class="fa-solid fa-star"></i>';

                // Styling - adjust based on card type
                if (card.classList.contains('file-card')) {
                    const preview = card.querySelector('.file-preview');
                    if (preview) {
                        // Position in top-right of preview or somewhere visible
                        starIcon.style.position = 'absolute';
                        starIcon.style.top = '8px';
                        starIcon.style.right = '8px';
                        starIcon.style.color = '#fbbf24';
                        preview.style.position = 'relative'; // Ensure relative
                        preview.appendChild(starIcon);
                    }
                } else if (card.classList.contains('folder-card')) {
                    // Start icon next to folder icon?
                    // Folder card is flex row usually
                    starIcon.style.color = '#fbbf24';
                    starIcon.style.marginLeft = 'auto'; // Push to right
                    card.appendChild(starIcon);
                }
            }
        } else {
            if (starIcon) {
                starIcon.remove();
            }
        }
    });

    // Also update context menu if open? (Unlikely needed as actions close it)
}

function removeFromStarred(itemName) {
    let items = getStarredItems();
    const newItems = items.filter(i => i.name !== itemName);
    if (items.length !== newItems.length) {
        saveStarredItems(newItems);
        // showToast(`Removed "${itemName}" from Starred`); // Caller handles toast usually
    }
}

function isStarred(itemName) {
    let items = getStarredItems();
    return items.some(i => i.name === itemName);
}

function renderStarredItems() {
    const fileGrid = document.querySelector('.grid-row.files');
    if (!fileGrid) return; // Should be on starred.html

    const items = getStarredItems();

    if (items.length === 0) {
        fileGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fa-regular fa-star" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No starred items yet</p>
            </div>
        `;
        return;
    }

    fileGrid.innerHTML = '';

    items.forEach(item => {
        if (item.type === 'folder') {
            const div = document.createElement('div');
            div.className = 'folder-card';
            div.innerHTML = `
                <i class="fa-solid fa-star" style="color: #fbbf24;"></i>
                <span>${item.name}</span>
            `;
            // Attach interactions
            // document.body.appendChild(div); // No
            fileGrid.appendChild(div);
            // Context menu logic
            if (typeof bindContextMenu === 'function') bindContextMenu(div, item.name); // Need to expose this or re-bind
        } else {
            const div = document.createElement('div');
            div.className = 'file-card';

            // Icon logic
            let iconClass = 'fa-regular fa-file';
            let iconColor = '#64748b';
            // Simple inference
            if (item.name.endsWith('.pdf')) { iconClass = 'fa-regular fa-file-pdf'; iconColor = '#ef4444'; }
            else if (item.name.endsWith('.png') || item.name.endsWith('.jpg')) { iconClass = 'fa-regular fa-image'; iconColor = '#4F46E5'; }
            else if (item.name.endsWith('.xlsx')) { iconClass = 'fa-regular fa-file-excel'; iconColor = '#22c55e'; }

            div.innerHTML = `
                <div class="file-preview">
                    <i class="${iconClass}" style="color: ${iconColor};"></i>
                </div>
            <div class="file-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="file-name">${item.name}</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <i class="fa-solid fa-star" style="font-size: 0.8rem; color: #fbbf24;"></i>
                        <button class="more-actions-btn" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.2rem;">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
            fileGrid.appendChild(div);
            const moreBtn = div.querySelector('.more-actions-btn');
            if (moreBtn) {
                moreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const contextMenu = document.getElementById('fileContextMenu');
                    if (contextMenu) {
                        const rect = moreBtn.getBoundingClientRect();
                        contextMenu.style.top = `${rect.bottom}px`;
                        contextMenu.style.left = `${rect.left - 150}px`;
                        contextMenu.classList.add('show');
                        contextMenu.dataset.targetName = item.name;
                        contextMenu.targetElement = div;
                    }
                });
            }
        }
    });
}


// Auto-run on starred.html
if (window.location.pathname.endsWith('starred.html')) {
    document.addEventListener('DOMContentLoaded', renderStarredItems);
}

// --- Trash Logic ---
function getTrashItems() {
    return JSON.parse(localStorage.getItem('trashItems')) || [];
}

function saveTrashItems(items) {
    localStorage.setItem('trashItems', JSON.stringify(items));
}

function moveToTrash(element, name) {
    let items = getTrashItems();

    // Determine type
    let type = 'other';
    const icon = element.querySelector('i');

    if (element.classList.contains('folder-card')) {
        type = 'folder';
    } else {
        if (icon) {
            if (icon.classList.contains('fa-image')) type = 'image';
            else if (icon.classList.contains('fa-file-pdf')) type = 'document';
            else if (icon.classList.contains('fa-file-excel')) type = 'spreadsheet';
        }
    }

    const newItem = {
        name: name,
        type: type,
        deletedAt: new Date().toISOString()
    };

    items.push(newItem);
    saveTrashItems(items);

    // If we just remove the element, the star badge goes with it.
    // But we need to ensure it is removed from starred items in storage too.
    if (typeof removeFromStarred === 'function') removeFromStarred(name);

    element.remove();
    showToast(`Moved "${name}" to Trash`);
}

function permanentDelete(name) {
    let items = getTrashItems();
    items = items.filter(i => i.name !== name);
    saveTrashItems(items);
}

function restoreItem(name) {
    let items = getTrashItems();
    items = items.filter(i => i.name !== name);
    saveTrashItems(items);
    // In a real app, we would move it back to its original location.
    // In this static demo, removing it from trash is enough to "restore" it 
    // (it will reappear if it was a static item hidden by permanentDeleted list, etc.)
}

function emptyTrash() {
    saveTrashItems([]);
    renderTrashItems();
}

function renderTrashItems() {
    const fileGrid = document.querySelector('.grid-row.files');
    if (!fileGrid) return;

    const items = getTrashItems();
    fileGrid.innerHTML = '';

    if (items.length === 0) {
        fileGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fa-regular fa-trash-can" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Trash is empty</p>
            </div>
            `;
        return;
    }

    items.forEach(item => {
        let card;
        if (item.type === 'folder') {
            card = document.createElement('div');
            card.className = 'folder-card';
            card.innerHTML = `
                <i class="fa-solid fa-folder" style="color: #94a3b8;"></i>
                <span style="text-decoration: line-through; color: #94a3b8;">${item.name}</span>
            `;
        } else {
            card = document.createElement('div');
            card.className = 'file-card';

            let iconClass = 'fa-regular fa-file';
            let iconColor = '#94a3b8';

            if (item.type === 'image') iconClass = 'fa-regular fa-image';
            else if (item.type === 'document') iconClass = 'fa-regular fa-file-pdf';
            else if (item.type === 'spreadsheet') iconClass = 'fa-regular fa-file-excel';

            card.innerHTML = `
                <div class="file-preview">
                    <i class="${iconClass}" style="color: ${iconColor}; opacity: 0.7;"></i>
                </div>
            <div class="file-info">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="file-name" style="text-decoration: line-through; color: #94a3b8;">${item.name}</span>
                    <button class="more-actions-btn" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.2rem;">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
                <span class="file-meta">Deleted today</span>
            </div>
        `;

            const moreBtn = card.querySelector('.more-actions-btn');
            if (moreBtn) {
                moreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const contextMenu = document.getElementById('fileContextMenu');
                    if (contextMenu) {
                        const rect = moreBtn.getBoundingClientRect();
                        contextMenu.style.top = `${rect.bottom}px`;
                        contextMenu.style.left = `${rect.left - 150}px`;
                        contextMenu.classList.add('show');
                        contextMenu.dataset.targetName = item.name;
                        contextMenu.targetElement = card;
                    }
                });
            }
        }
        fileGrid.appendChild(card);
    });
}

if (window.location.pathname.endsWith('trash.html')) {
    document.addEventListener('DOMContentLoaded', renderTrashItems);
}

// Auto-run markStarredItems on all pages to show status
document.addEventListener('DOMContentLoaded', () => {
    markStarredItems();
    hidePermanentlyDeletedItems();
});

// --- Permanent Deletion Persistence (for static files) ---
function getPermanentDeleted() {
    return JSON.parse(localStorage.getItem('permanentDeleted')) || [];
}

function addToPermanentDeleted(name) {
    let items = getPermanentDeleted();
    if (!items.includes(name)) {
        items.push(name);
        localStorage.setItem('permanentDeleted', JSON.stringify(items));
    }
}

function hidePermanentlyDeletedItems() {
    const deletedItems = getPermanentDeleted();
    if (deletedItems.length === 0) return;

    const cards = document.querySelectorAll('.file-card, .folder-card');
    cards.forEach(card => {
        const nameEl = card.querySelector('.file-name, span:not(.file-meta)');
        if (nameEl && deletedItems.includes(nameEl.innerText)) {
            card.remove();
        }
    });
}
