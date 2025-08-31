// Элементы DOM
const audioPlayer = new Audio();
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playIcon = document.getElementById('play-icon');
const coverImage = document.getElementById('cover-image');
const albumCover = document.querySelector('.album-cover');
const volumeProgress = document.getElementById('volume-progress');
const volumeSlider = document.querySelector('.volume-slider');

// Настройка трека
const track = {
    title: "айсберг",
    artist: "tewiq, тёмный принц",
    audioFile: "music/song1.mp3",
    coverImage: "covers/cover1.jpg"
};

// Инициализация
function initPlayer() {
    // Устанавливаем трек
    audioPlayer.src = track.audioFile;
    audioPlayer.volume = 0.7;
    coverImage.src = track.coverImage;
    coverImage.alt = `Обложка: ${track.title} - ${track.artist}`;
    
    // Обновляем информацию
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;
    
    // События аудио
    audioPlayer.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audioPlayer.duration);
        updateVolumeDisplay();
    });
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', function() {
        playIcon.className = 'fas fa-play';
        albumCover.classList.remove('playing');
    });
    
    // Клик по прогресс бару
    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        const progressBar = this;
        const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        audioPlayer.currentTime = clickPosition * audioPlayer.duration;
        updateProgress();
    });
    
    // Клик по обложке
    albumCover.addEventListener('click', togglePlay);
    
    // Контроль громкости
    volumeSlider.addEventListener('click', function(e) {
        const slider = this;
        const clickPosition = (e.pageX - slider.getBoundingClientRect().left) / slider.offsetWidth;
        audioPlayer.volume = Math.max(0, Math.min(1, clickPosition));
        updateVolumeDisplay();
    });
}

// Форматирование времени
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Обновление прогресс бара
function updateProgress() {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Обновление отображения громкости
function updateVolumeDisplay() {
    volumeProgress.style.width = (audioPlayer.volume * 100) + '%';
}

// Воспроизведение/пауза
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play().catch(e => {
            console.log('Автовоспроизведение заблокировано');
        });
        playIcon.className = 'fas fa-pause';
        albumCover.classList.add('playing');
    } else {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
        albumCover.classList.remove('playing');
    }
}

// Перемотка на +/- секунд
function seek(seconds) {
    audioPlayer.currentTime += seconds;
    updateProgress();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPlayer();
});

// Глобальные функции для кнопок
window.togglePlay = togglePlay;
window.seek = seek;