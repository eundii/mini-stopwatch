// TODO: 이 곳에 정답 코드를 작성해주세요.
import Stopwatch from './stopwatch.js';

const stopwatch = new Stopwatch;

let isRunning = false;
let interval;

const $timer = document.getElementById("timer");
const $startStopBtn = document.getElementById("start-stop-btn");
const $startStopBtnLabel = document.getElementById("start-stop-btn-label");
const $lapResetBtn = document.getElementById("lap-reset-btn");
const $lapResetBtnLabel = document.getElementById("lap-reset-btn-label");
const $laps = document.getElementById("laps");

const $minLap, $maxLap;

const formatString = (num) => (num < 10 ? `0${num}` : num);
const formatTime = (centisecond) => {
  let formattedString = '';
  // 분:초.밀리초
  const min = parseInt(centisecond / 6000);
  const sec = parseInt((centisecond - 6000 * min) / 100);
  const centisec = centisecond % 100;
  formattedString= `${formatString(min)}:${formatString(sec)}.${formatString(centisec)}`;
  return formattedString;
}
const updateTime = (time) => {
  $timer.innerText = formatTime(time);
}
const onClickStratStopBtn = () => {
  if(isRunning) {
    onClickStopBtn();  
  } else {
    onClickStratBtn();
  }
  isRunning = !isRunning;
  toggleBtnStyle()
}
const onClickLapResetBtn = () => {
  if(isRunning) {
    onClickLapBtn();  
  } else {
    onClickResetBtn();
  }
}
const toggleBtnStyle = () => {
  $startStopBtn.classList.toggle('bg-green-600');
  $startStopBtn.classList.toggle('bg-red-600');
}
const onClickStratBtn = () => {
  stopwatch.start();
  interval = setInterval(() => {
    updateTime(stopwatch.centisecond)
  }, 10)
  // 시작/중단 스타일
  $startStopBtnLabel.innerText = "중단";
  // 랩 스타일
  $lapResetBtnLabel.innerText = "랩";
}

const onClickStopBtn = () => {
  stopwatch.pause();
  clearInterval(interval);
  // 시작/중단 스타일
  $startStopBtnLabel.innerText = "시작";
  // 랩 스타일
  $lapResetBtnLabel.innerText = "리셋";
}
const colorMinMax = () => {
  $minLap.classList.add('text-green-600');
  $maxLap.classList.add('text-red-600');
}
const onClickLapBtn = () => {
  const [lapCount, lapTime] = stopwatch.createLap();
  const $lap = document.createElement('li');

  // data attribute
  $lap.setAttribute('data-time', lapTime);

  $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-');
  $lap.innerHTML = `
    <span>랩 ${lapCount}</span>
    <span>${formatTime(lapTime)}</span>
  `;
  $laps.prepend($lap);

  // 처음 Lap
  if($minLap === undefined) {
    $minLap = $lap;
    return;
  }
  // 두번째 Lap
  if($maxLap === undefined) {
    if(laptime < $minLap.dataset.time) {
      $maxLap = $minLap;
      $minLap = $lap;
    } else {
      $maxLap = $lap;
    }
    colorMinMax();
    return;
  }
  // lap이 3개 이상
  if(lapTime < $minLap.dataset.time) {
    $minLap.classList.remove('text-green-600');
    $minLap = $lap;
  } else if (lapTime > $maxLap.dataset.time) {
    $maxLap.classList.remove('text-red-600')
    $maxLap = $lap;
  }

  colorMinMax();
}
const onClickResetBtn = () => {
  stopwatch.reset();
  updateTime(0);
  $laps.innerHTML = '';
  $minLap = undefined;
  $maxLap = undefined;
}

const onKeyDown = (e) => {
  switch(e.code) {
    case 'KeyL':
      onClickLapResetBtn();
      break;
    case 'KeyS':
      onClickStratStopBtn();
        break;
  }
}

$startStopBtn.addEventListener('click', onClickStratStopBtn);
$lapResetBtn.addEventListener('click', onClickLapResetBtn);

document.addEventListener('keydown', onKeyDown);