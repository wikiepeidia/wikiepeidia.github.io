// Image error handling
function handleImageError(img, videoId) {
    // First fallback: try local images folder
    if (!img.dataset.triedLocal) {
        img.dataset.triedLocal = "true";
        img.src = "images/" + videoId + ".webp";
    } else if (!img.dataset.triedPhotoFolder) {
        // Second fallback: try photo folder
        img.dataset.triedPhotoFolder = "true";
        img.src = "photo/" + videoId + ".jpg";
    } else {
        // Third fallback: show custom message
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='210' height='118'%3E%3Crect fill='%23ff6b6b' width='210' height='118'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' dy='.3em' fill='white' font-weight='bold' font-size='14'%3ELMAO wayback machine%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' dy='.3em' fill='white' font-size='11'%3Ecouldnt save lol%3C/text%3E%3C/svg%3E";
    }
}

function handleBannerError(img) {
    // First fallback: try local photo folder
    if (!img.dataset.triedLocal) {
        img.dataset.triedLocal = "true";
        img.src = "photo/PhotoGrid_1580030426532.jpg";
    } else if (!img.dataset.triedSecondLocal) {
        // Second fallback: try another local image
        img.dataset.triedSecondLocal = "true";
        img.src = "photo/RobloxScreenShot20250121_141949984.png";
    } else {
        // Final fallback: hide banner
        img.style.display = 'none';
    }
}

function handleAvatarError(img, fallbackPath) {
    // First fallback: try specified fallback path
    if (!img.dataset.triedLocal) {
        img.dataset.triedLocal = "true";
        img.src = fallbackPath || "photo/favicon.ico";
    } else {
        // Second fallback: custom TP icon
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23065fd4' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-weight='bold'%3ETP%3C/text%3E%3C/svg%3E";
    }
}

// Section switching
function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(s => s.classList.remove('active'));

    // Remove active from all tabs
    const tabs = document.querySelectorAll('.section-tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Show selected section
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.add('active');
    }

    // Mark tab as active
    const tab = document.querySelector(`[data-section="${sectionName}"]`);
    if (tab) {
        tab.classList.add('active');
    }

    // Save preference
    localStorage.setItem('selectedSection', sectionName);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('selectedSection') || '2020';
    switchSection(saved);
});

// Video click handler
function handleVideoClick(e) {
    e.preventDefault();

    // Get the video ID from the parent card's video-id element
    const videoCard = e.target.closest('.video-card');
    const videoIdElement = videoCard.querySelector('.video-id');
    const videoId = videoIdElement ? videoIdElement.textContent.trim().replace(/^ID:\s*/, '') : '';

    // Remade videos mapping
    const remadeVideos = {
        'Us0RRukXTt8': 'https://youtu.be/zNa4fspDVIY',
        'Z4Lc9qF8_1Y': 'https://youtu.be/y8gjr5AUDLg',
        'LFajTPb4bCY': 'https://youtu.be/3U2h8a2jKrU',
        'M9_CzgOSoEs': 'https://youtu.be/GwaCnirgHP0',
        'm4bo6Ak-Ivk': 'https://youtu.be/Oq9DNc8KbOQ',
        'tye_RULula0': 'https://youtu.be/UKEDLzXpMfQ',
    };

    // Archived videos mapping
    const archivedVideos = {
        'PXGGAJ6bWb8': 'https://youtu.be/nLwKkjmJqr4',
        'L0KLThYkErQ': 'https://youtu.be/2zv-8GLCRg0'
    };

    // Wikipedia ripped videos mapping
    const wikipediaRipped = {
        'S3_eXZzbkRI': 'https://vi.wikipedia.org/wiki/T%E1%BA%ADp_tin:Indonesia_Raya_1945.ogv'
    };

    // Scratch project videos mapping
    const scratchProjects = {
        'Hlliz4ifUbw': 'https://scratch.mit.edu/projects/427351485/'
    };

    // Check if this is a Wikipedia ripped video
    if (wikipediaRipped[videoId]) {
        if (confirm('📚 This video is RIPPED of Wikipedia lmao!\n\nWould you like to watch it?')) {
            window.open(wikipediaRipped[videoId], '_blank');
        }
    } else if (scratchProjects[videoId]) {
        // Check if this is a Scratch project
        if (confirm('🎮 This video is not archived, but the project is online on Scratch!\n\nWould you like to test it?')) {
            window.open(scratchProjects[videoId], '_blank');
        }
    } else if (archivedVideos[videoId]) {
        // Check if this video is archived
        if (confirm('📺 This video IS ARCHIVED!\n\nWould you like to watch it?')) {
            window.open(archivedVideos[videoId], '_blank');
        }
    } else if (remadeVideos[videoId]) {
        // Check if this video has a remake
        if (confirm('✅ This video is REMADE!\n\nWould you like to watch it?')) {
            window.open(remadeVideos[videoId], '_blank');
        }
    } else {
        // Default message for non-remade videos
        if (confirm('🚫 This video is NOT ARCHIVED\n\nWould you like to see possible remakes in my REMAKE-OLD-VID channel?')) {
            window.open('https://www.youtube.com/@ptm2409temp', '_blank');
        }
    }
    return false;
}
