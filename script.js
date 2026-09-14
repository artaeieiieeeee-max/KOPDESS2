import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ==========================================
// GOOGLE APPS SCRIPT
// ==========================================

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxRaMREmVVQjFs-c04DY_S4DJ3KK6sYyVFGLRRMbrlhdFD94TxkZQhtw5LOJ3bat2Wmkw/exec";


// ==========================================
// DATA GAME
// ==========================================

let username = "";
let whatsapp = "";

let score = 0;
let timeLeft = 60;

let gameRunning = false;

let timerInterval;


// ==========================================
// THREE.JS
// ==========================================

let scene;
let camera;
let renderer;

let player;

let coins = [];

let keys = {};


// ==========================================
// DOM
// ==========================================

const menu = document.getElementById("menu");
const gameUI = document.getElementById("gameUI");
const gameOver = document.getElementById("gameOver");

const leaderboard = document.getElementById("leaderboard");

const usernameInput =
document.getElementById("username");

const waInput =
document.getElementById("wa");

const scoreText =
document.getElementById("score");

const timerText =
document.getElementById("timer");

const playerName =
document.getElementById("playerName");


// ==========================================
// START BUTTON
// ==========================================

document
.getElementById("startBtn")
.addEventListener("click", startGame);


function startGame() {

  username =
    usernameInput.value.trim();

  whatsapp =
    waInput.value.trim();


  if (!username) {

    alert("Masukkan username!");

    return;
  }


  if (!whatsapp) {

    alert("Masukkan nomor WhatsApp!");

    return;
  }


  score = 0;

  timeLeft = 60;

  scoreText.textContent = score;

  timerText.textContent = timeLeft;

  playerName.textContent = username;


  menu.classList.add("hidden");

  gameOver.classList.add("hidden");

  gameUI.classList.remove("hidden");


  initGame();

  startTimer();

}


// ==========================================
// INIT GAME
// ==========================================

function initGame() {

  scene =
    new THREE.Scene();


  scene.background =
    new THREE.Color(0x87ceeb);


  // CAMERA

  camera =
    new THREE.PerspectiveCamera(
      60,
      window.innerWidth /
      window.innerHeight,
      0.1,
      500
    );


  camera.position.set(
    0,
    12,
    15
  );


  // RENDERER

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    });


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  renderer.shadowMap.enabled = true;


  document.body.appendChild(
    renderer.domElement
  );


  // LIGHT

  const ambient =
    new THREE.HemisphereLight(
      0xffffff,
      0x444444,
      2
    );


  scene.add(ambient);


  const sun =
    new THREE.DirectionalLight(
      0xffffff,
      2
    );


  sun.position.set(
    10,
    20,
    10
  );


  sun.castShadow = true;


  scene.add(sun);


  // ======================================
  // TANAH
  // ======================================

  const groundGeometry =
    new THREE.PlaneGeometry(
      100,
      100
    );


  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x4d9b50
    });


  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );


  ground.rotation.x =
    -Math.PI / 2;


  ground.receiveShadow = true;


  scene.add(ground);


  // ======================================
  // JALAN
  // ======================================

  const roadGeometry =
    new THREE.BoxGeometry(
      100,
      0.05,
      8
    );


  const roadMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x555555
    });


  const road =
    new THREE.Mesh(
      roadGeometry,
      roadMaterial
    );


  road.position.y =
    0.03;


  scene.add(road);


  // ======================================
  // GEDUNG KOPDES
  // ======================================

  createBuilding(
    0,
    2,
    -18
  );


  createBuilding(
    -20,
    2,
    -5
  );


  createBuilding(
    20,
    2,
    -5
  );


  // ======================================
  // PLAYER
  // ======================================

  createPlayer();


  // ======================================
  // COINS
  // ======================================

  createCoins(15);


  // ======================================
  // RESIZE
  // ======================================

  window.addEventListener(
    "resize",
    resize
  );


  animate();
}


// ==========================================
// BUILDING
// ==========================================

function createBuilding(
  x,
  y,
  z
) {

  const buildingGeometry =
    new THREE.BoxGeometry(
      7,
      4,
      6
    );


  const buildingMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xf4f4f4
    });


  const building =
    new THREE.Mesh(
      buildingGeometry,
      buildingMaterial
    );


  building.position.set(
    x,
    y,
    z
  );


  building.castShadow = true;


  scene.add(building);


  // ATAP

  const roofGeometry =
    new THREE.ConeGeometry(
      5.5,
      2,
      4
    );


  const roofMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xb22222
    });


  const roof =
    new THREE.Mesh(
      roofGeometry,
      roofMaterial
    );


  roof.position.set(
    x,
    5,
    z
  );


  roof.rotation.y =
    Math.PI / 4;


  scene.add(roof);


  // TULISAN

  // Tiang depan sederhana

}


// ==========================================
// PLAYER
// ==========================================

function createPlayer() {

  const bodyGeometry =
    new THREE.BoxGeometry(
      1,
      1.5,
      1
    );


  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x1565c0
    });


  player =
    new THREE.Mesh(
      bodyGeometry,
      bodyMaterial
    );


  player.position.set(
    0,
    0.75,
    5
  );


  player.castShadow = true;


  scene.add(player);

}


// ==========================================
// COINS
// ==========================================

function createCoins(amount) {

  coins = [];


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const geometry =
      new THREE.CylinderGeometry(
        0.45,
        0.45,
        0.15,
        24
      );


    const material =
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.7,
        roughness: 0.25
      });


    const coin =
      new THREE.Mesh(
        geometry,
        material
      );


    coin.rotation.x =
      Math.PI / 2;


    coin.position.set(
      THREE.MathUtils.randFloat(
        -35,
        35
      ),
      0.6,
      THREE.MathUtils.randFloat(
        -30,
        20
      )
    );


    scene.add(coin);

    coins.push(coin);

  }

}


// ==========================================
// KEYBOARD
// ==========================================

window.addEventListener(
  "keydown",
  function(event) {

    keys[event.key.toLowerCase()] =
      true;

  }
);


window.addEventListener(
  "keyup",
  function(event) {

    keys[event.key.toLowerCase()] =
      false;

  }
);


// ==========================================
// MOBILE CONTROL
// ==========================================

function mobileKey(
  key
) {

  keys[key] = true;


  setTimeout(
    () => {
      keys[key] = false;
    },
    150
  );

}


document
.getElementById("up")
.addEventListener(
  "touchstart",
  () => mobileKey("w")
);


document
.getElementById("down")
.addEventListener(
  "touchstart",
  () => mobileKey("s")
);


document
.getElementById("left")
.addEventListener(
  "touchstart",
  () => mobileKey("a")
);


document
.getElementById("right")
.addEventListener(
  "touchstart",
  () => mobileKey("d")
);


// ==========================================
// UPDATE PLAYER
// ==========================================

function updatePlayer() {

  if (!player)
    return;


  const speed = 0.18;


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    player.position.z -= speed;

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    player.position.z += speed;

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    player.position.x -= speed;

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    player.position.x += speed;

  }


  // Batas arena

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -45,
      45
    );


  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -40,
      30
    );


  // Kamera mengikuti player

  camera.position.x =
    player.position.x;


  camera.position.z =
    player.position.z + 15;


  camera.lookAt(
    player.position.x,
    0,
    player.position.z
  );

}


// ==========================================
// COIN COLLISION
// ==========================================

function checkCoins() {

  for (
    let i = coins.length - 1;
    i >= 0;
    i--
  ) {

    const coin =
      coins[i];


    const distance =
      player.position.distanceTo(
        coin.position
      );


    if (distance < 1.3) {

      score += 10;


      scoreText.textContent =
        score;


      scene.remove(
        coin
      );


      coins.splice(
        i,
        1
      );


      showMessage(
        "+10 ⭐"
      );

    }

  }


  // Kalau semua koin habis

  if (
    coins.length === 0
  ) {

    createCoins(15);

  }

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
  text
) {

  const message =
    document.getElementById(
      "message"
    );


  message.textContent =
    text;


  setTimeout(
    () => {

      message.textContent =
        "";

    },
    700
  );

}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

  clearInterval(
    timerInterval
  );


  gameRunning = true;


  timerInterval =
    setInterval(
      () => {

        timeLeft--;


        timerText.textContent =
          timeLeft;


        if (
          timeLeft <= 0
        ) {

          endGame();

        }

      },
      1000
    );

}


// ==========================================
// END GAME
// ==========================================

function endGame() {

  if (!gameRunning)
    return;


  gameRunning = false;


  clearInterval(
    timerInterval
  );


  gameUI.classList.add(
    "hidden"
  );


  gameOver.classList.remove(
    "hidden"
  );


  document.getElementById(
    "finalName"
  ).textContent =
    username;


  document.getElementById(
    "finalScore"
  ).textContent =
    score;


  saveScore();

}


// ==========================================
// SIMPAN SCORE
// ==========================================

async function saveScore() {

  if (
    GOOGLE_SCRIPT_URL.includes(
      "GANTI_DENGAN"
    )
  ) {

    console.log(
      "URL Google Apps Script belum dipasang."
    );

    return;

  }


  const data = {

    action: "save",

    username:
      username,

    whatsapp:
      whatsapp,

    score:
      score,

    time:
      60 - timeLeft,

    date:
      new Date().toISOString()

  };


  try {

    await fetch(
      GOOGLE_SCRIPT_URL,
      {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(data)

      }
    );


    console.log(
      "Score berhasil dikirim."
    );


  } catch (error) {

    console.error(
      "Gagal menyimpan score:",
      error
    );

  }

}


// ==========================================
// LEADERBOARD
// ==========================================

document
.getElementById(
  "leaderboardBtn"
)
.addEventListener(
  "click",
  showLeaderboard
);


document
.getElementById(
  "resultLeaderboard"
)
.addEventListener(
  "click",
  showLeaderboard
);


async function showLeaderboard() {

  menu.classList.add(
    "hidden"
  );

  gameOver.classList.add(
    "hidden"
  );

  leaderboard.classList.remove(
    "hidden"
  );


  const list =
    document.getElementById(
      "leaderboardList"
    );


  list.innerHTML =
    "⏳ Memuat leaderboard...";


  try {

    const response =
      await fetch(
        GOOGLE_SCRIPT_URL +
        "?action=leaderboard"
      );


    const data =
      await response.json();


    if (
      !data ||
      data.length === 0
    ) {

      list.innerHTML =
        "Belum ada data.";

      return;

    }


    list.innerHTML =
      "";


    data
      .slice(0, 10)
      .forEach(
        (player, index) => {

          const row =
            document.createElement(
              "div"
            );


          row.className =
            "rank";


          row.innerHTML = `
            <span>
              #${index + 1}
              ${escapeHTML(player.username)}
            </span>

            <strong>
              ${player.score} ⭐
            </strong>
          `;


          list.appendChild(
            row
          );

        }
      );


  } catch (error) {

    console.error(error);


    list.innerHTML =
      "❌ Gagal mengambil leaderboard.";

  }

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(
  text
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    text;


  return div.innerHTML;

}


// ==========================================
// BACK
// ==========================================

document
.getElementById("backBtn")
.addEventListener(
  "click",
  () => {

    leaderboard.classList.add(
      "hidden"
    );

    menu.classList.remove(
      "hidden"
    );

  }
);


// ==========================================
// MAIN LAGI
// ==========================================

document
.getElementById("againBtn")
.addEventListener(
  "click",
  () => {

    gameOver.classList.add(
      "hidden"
    );

    gameUI.classList.remove(
      "hidden"
    );

    score = 0;

    timeLeft = 60;

    scoreText.textContent =
      score;

    timerText.textContent =
      timeLeft;


    if (renderer) {

      renderer.domElement.remove();

    }


    initGame();

    startTimer();

  }
);


// ==========================================
// RESIZE
// ==========================================

function resize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;


  camera.updateProjectionMatrix();


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

}


// ==========================================
// ANIMATION
// ==========================================

function animate() {

  requestAnimationFrame(
    animate
  );


  if (
    gameRunning
  ) {

    updatePlayer();

    checkCoins();


    coins.forEach(
      coin => {

        coin.rotation.z +=
          0.05;

        coin.rotation.y +=
          0.03;

      }
    );

  }


  renderer.render(
    scene,
    camera
  );

}
