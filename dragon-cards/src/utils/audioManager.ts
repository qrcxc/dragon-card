const sfx = {
  flip: new Audio('/sounds/flip card.mp3'),
  win: new Audio('/sounds/point+.mp3'),
  lose: new Audio('/sounds/lose.mp3'),
  touch: new Audio('/sounds/touch.mp3'),
  opening: new Audio('/sounds/sound when opening cards.mp3'),
};

// Створюємо об'єкт музики один раз
const bgMusic = new Audio('/sounds/back sound.mp3');
bgMusic.loop = true; // ЗАЦИКЛЕННЯ
bgMusic.volume = 0.2;

Object.values(sfx).forEach(audio => { audio.volume = 0.4; });

export const playSFX = (name: keyof typeof sfx, isMuted: boolean) => {
  if (isMuted) return;
  const sound = sfx[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
};

// ФУНКЦІЯ ДЛЯ ПОСТІЙНОЇ МУЗИКИ
export const manageBGMusic = (isMuted: boolean) => {
  if (isMuted) {
    bgMusic.pause();
  } else {
    // Вмикаємо, якщо не грає
    bgMusic.play().catch(() => {
      console.log("Очікування кліку для запуску музики...");
    });
  }
};