
// File Details Modal Functions
function setupFilePreviewModal() {
    const modal = document.getElementById('fileDetailModal');
    const closeBtn = document.getElementById('closeDetailModal');
    const fileCards = document.querySelectorAll('.file-card');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Attach to existing cards
        fileCards.forEach(card => {
            const fileName = card.querySelector('.file-name').textContent;
            const meta = card.querySelector('.file-meta') ? card.querySelector('.file-meta').textContent : "Unknown";

            // Infer type from icon or name
            let type = "Document";
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
