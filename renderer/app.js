const audio = document.querySelector('#audio');
const chooseFolder = document.querySelector('#choose-folder');
const folderStatus = document.querySelector('#folder-status');
const emptyState = document.querySelector('#empty-state');
const trackList = document.querySelector('#track-list');
const trackCount = document.querySelector('#track-count');
const nowTitle = document.querySelector('#now-title');
const nowFolder = document.querySelector('#now-folder');
const playButton = document.querySelector('#play');
const previousButton = document.querySelector('#previous');
const nextButton = document.querySelector('#next');
let tracks = [];
let currentIndex = -1;

function renderTracks() {
  trackList.replaceChildren();
  emptyState.hidden = tracks.length > 0;
  trackCount.textContent = `${tracks.length} ${tracks.length === 1 ? 'titre' : 'titres'}`;
  tracks.forEach((track, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'track';
    button.type = 'button';
    button.innerHTML = `<span class="track-index">${index + 1}</span><span class="track-name"></span>`;
    button.querySelector('.track-name').textContent = track.name;
    button.addEventListener('click', () => playTrack(index));
    item.append(button);
    trackList.append(item);
  });
}

function markCurrentTrack() {
  document.querySelectorAll('.track').forEach((element, index) => element.classList.toggle('active', index === currentIndex));
}

function playTrack(index) {
  if (!tracks[index]) return;
  currentIndex = index;
  audio.src = `file://${tracks[index].path.replaceAll('\\', '/')}`;
  audio.play().catch(() => {});
  nowTitle.textContent = tracks[index].name;
  nowFolder.textContent = tracks[index].filename;
  playButton.textContent = '⏸';
  markCurrentTrack();
}

function moveTrack(step) {
  if (!tracks.length) return;
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + step + tracks.length) % tracks.length;
  playTrack(nextIndex);
}

chooseFolder.addEventListener('click', async () => {
  const directory = await window.sonaris.selectMusicFolder();
  if (!directory) return;
  const result = await window.sonaris.scanMusicFolder(directory);
  tracks = result;
  folderStatus.textContent = `${directory} · ${tracks.length} titre${tracks.length === 1 ? '' : 's'} trouvé${tracks.length === 1 ? '' : 's'}.`;
  renderTracks();
});

playButton.addEventListener('click', () => {
  if (!tracks.length) return;
  if (currentIndex < 0) return playTrack(0);
  if (audio.paused) { audio.play(); playButton.textContent = '⏸'; } else { audio.pause(); playButton.textContent = '▶'; }
});
previousButton.addEventListener('click', () => moveTrack(-1));
nextButton.addEventListener('click', () => moveTrack(1));
audio.addEventListener('ended', () => moveTrack(1));
renderTracks();
