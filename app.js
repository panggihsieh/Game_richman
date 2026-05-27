const colors = ["#d85050", "#3f72d8", "#168f8b", "#f3a536", "#8c5ad8", "#3f9f67"];

const builtInImages = [
  { name: "原生：台灣黑熊", scientific: "Ursus thibetanus formosanus", color: "#39434f", label: "台灣黑熊", type: "原生種", icon: "bear" },
  { name: "原生：台灣藍鵲", scientific: "Urocissa caerulea", color: "#2f73d8", label: "台灣藍鵲", type: "原生種", icon: "magpie" },
  { name: "原生：梅花鹿", scientific: "Cervus nippon taiouanus", color: "#b07042", label: "梅花鹿", type: "原生種", icon: "muntjac" },
  { name: "原生：台灣百合", scientific: "Lilium formosanum", color: "#d986b4", label: "台灣百合", type: "原生種", icon: "lily" },
  { name: "原生：櫻花鉤吻鮭", scientific: "Oncorhynchus masou formosanus", color: "#3f8fb5", label: "櫻花鉤吻鮭", type: "原生種", icon: "salmon" },
  { name: "原生：台灣獼猴", scientific: "Macaca cyclopis", color: "#8a6240", label: "台灣獼猴", type: "原生種", icon: "monkey" },
  { name: "原生：大安水蓑衣", scientific: "Hygrophila pogonocalyx", color: "#168f8b", label: "大安水蓑衣", type: "原生種", icon: "aquaticPlant" },
  { name: "原生：寬尾鳳蝶", scientific: "Agehana maraho", color: "#111827", label: "寬尾鳳蝶", type: "原生種", icon: "butterfly" },
  { name: "原生：台灣山椒魚", scientific: "Hynobius formosanus", color: "#6f7f66", label: "台灣山椒魚", type: "原生種", icon: "salamander" },
  { name: "原生：台灣一葉蘭", scientific: "Pleione formosana", color: "#9b4ca7", label: "台灣一葉蘭", type: "原生種", icon: "orchid" },
  { name: "外來：福壽螺", scientific: "Pomacea canaliculata", color: "#d99b2b", label: "福壽螺", type: "外來種", icon: "snail" },
  { name: "外來：吳郭魚", scientific: "Oreochromis niloticus", color: "#3f8fb5", label: "吳郭魚", type: "外來種", icon: "fish" },
  { name: "外來：小花蔓澤蘭", scientific: "Mikania micrantha", color: "#168f8b", label: "小花蔓澤蘭", type: "外來種", icon: "vine" },
  { name: "外來：美國螯蝦", scientific: "Procambarus clarkii", color: "#d85050", label: "美國螯蝦", type: "外來種", icon: "crayfish" },
  { name: "外來：綠鬣蜥", scientific: "Iguana iguana", color: "#3f9f67", label: "綠鬣蜥", type: "外來種", icon: "iguana" },
  { name: "外來：緬甸小雨蛙", scientific: "Microhyla fissipes", color: "#5c8b55", label: "緬甸小雨蛙", type: "外來種", icon: "frog" },
  { name: "外來：紅火蟻", scientific: "Solenopsis invicta", color: "#d85050", label: "紅火蟻", type: "外來種", icon: "ant" },
  { name: "外來：大花咸豐草", scientific: "Bidens pilosa radiata", color: "#e46a92", label: "大花咸豐草", type: "外來種", icon: "flower" },
  { name: "外來：家八哥", scientific: "Acridotheres tristis", color: "#5c6f82", label: "家八哥", type: "外來種", icon: "bird" },
  { name: "外來：琵琶鼠魚", scientific: "Hypostomus plecostomus", color: "#4f95a8", label: "琵琶鼠魚", type: "外來種", icon: "catfish" }
];

const boardPositions = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
  [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
  [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1], [6, 1]
];

let stages = builtInImages.map((item, index) => ({
  id: index,
  name: item.name,
  scientific: item.scientific,
  color: item.color,
  label: item.label,
  type: item.type,
  builtIn: makeStageImage(item),
  image: makeStageImage(item),
  boardImage: makeStageImage(item),
  customImage: ""
}));

let players = [];
let currentTurn = 0;
let cameraPlayerId = null;
let cameraStream = null;

const board = document.querySelector("#board");
const stageEditor = document.querySelector("#stageEditor");
const playersList = document.querySelector("#playersList");
const leaderboard = document.querySelector("#leaderboard");
const playerCountInput = document.querySelector("#playerCount");
const titleInput = document.querySelector("#gameTitle");
const displayTitle = document.querySelector("#displayTitle");
const diceFace = document.querySelector("#diceFace");
const turnText = document.querySelector("#turnText");
const cameraDialog = document.querySelector("#cameraDialog");
const cameraPreview = document.querySelector("#cameraPreview");
const avatarCanvas = document.querySelector("#avatarCanvas");

function makeStageImage(stage) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <rect width="320" height="220" rx="22" fill="${stage.color}"/>
      <circle cx="263" cy="42" r="35" fill="rgba(255,255,255,.26)"/>
      <circle cx="63" cy="177" r="68" fill="rgba(255,255,255,.14)"/>
      <path d="M0 164 C58 132 112 190 176 150 S265 136 320 108 V220 H0Z" fill="rgba(255,255,255,.22)"/>
      <path d="M0 188 C58 154 116 207 180 178 S270 160 320 140 V220 H0Z" fill="rgba(23,33,43,.24)"/>
      <rect x="18" y="17" width="70" height="30" rx="15" fill="rgba(255,255,255,.24)"/>
      <text x="53" y="38" text-anchor="middle" font-family="Microsoft JhengHei, Arial, sans-serif" font-size="18" font-weight="900" fill="white">${escapeSvg(stage.type)}</text>
      <g transform="translate(160 96) scale(.333)">${iconSvg(stage.icon)}</g>
      <text x="160" y="181" text-anchor="middle" font-family="Microsoft JhengHei, Arial, sans-serif" font-size="27" font-weight="900" fill="white">${escapeSvg(stage.label)}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeUploadedStageImage(stage, imageSrc) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <defs>
        <clipPath id="uploadedImageClip">
          <rect x="80" y="42" width="160" height="110" rx="14"/>
        </clipPath>
      </defs>
      <rect width="320" height="220" rx="22" fill="${stage.color || "#3f72d8"}"/>
      <circle cx="263" cy="42" r="35" fill="rgba(255,255,255,.26)"/>
      <circle cx="63" cy="177" r="68" fill="rgba(255,255,255,.14)"/>
      <path d="M0 164 C58 132 112 190 176 150 S265 136 320 108 V220 H0Z" fill="rgba(255,255,255,.22)"/>
      <path d="M0 188 C58 154 116 207 180 178 S270 160 320 140 V220 H0Z" fill="rgba(23,33,43,.24)"/>
      <rect x="76" y="38" width="168" height="118" rx="17" fill="rgba(255,255,255,.32)"/>
      <image href="${escapeSvg(imageSrc)}" x="80" y="42" width="160" height="110" preserveAspectRatio="xMidYMid meet" clip-path="url(#uploadedImageClip)"/>
      <rect x="80" y="42" width="160" height="110" rx="14" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="5"/>
      <text x="160" y="181" text-anchor="middle" font-family="Microsoft JhengHei, Arial, sans-serif" font-size="27" font-weight="900" fill="white">${escapeSvg(stage.name)}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makePhotoStageImage(stage, imageSrc) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <defs>
        <clipPath id="photoClip">
          <rect width="320" height="220" rx="22"/>
        </clipPath>
        <linearGradient id="captionFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="rgba(23,33,43,0)"/>
          <stop offset=".58" stop-color="rgba(23,33,43,.15)"/>
          <stop offset="1" stop-color="rgba(23,33,43,.9)"/>
        </linearGradient>
      </defs>
      <rect width="320" height="220" rx="22" fill="${stage.color || "#3f72d8"}"/>
      <image href="${escapeSvg(imageSrc)}" width="320" height="220" preserveAspectRatio="xMidYMin slice" clip-path="url(#photoClip)"/>
      <rect width="320" height="220" rx="22" fill="url(#captionFade)"/>
      <rect x="18" y="17" width="70" height="30" rx="15" fill="rgba(23,33,43,.55)"/>
      <text x="53" y="38" text-anchor="middle" font-family="Microsoft JhengHei, Arial, sans-serif" font-size="18" font-weight="900" fill="white">${escapeSvg(stage.type)}</text>
      <text x="160" y="178" text-anchor="middle" font-family="Microsoft JhengHei, Arial, sans-serif" font-size="25" font-weight="900" fill="white">${escapeSvg(stage.label)}</text>
      <text x="160" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-style="italic" fill="rgba(255,255,255,.9)">${escapeSvg(stage.scientific)}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function loadStagePhotos() {
  if (!window.fetch) return;
  await Promise.all(stages.map(async (stage) => {
    try {
      const query = encodeURIComponent(stage.scientific || stage.label);
      const response = await fetch(`https://api.inaturalist.org/v1/taxa?q=${query}&per_page=1`);
      if (!response.ok) return;
      const data = await response.json();
      const photo = data.results?.[0]?.default_photo;
      const photoUrl = photo?.square_url || photo?.medium_url || photo?.url;
      if (!photoUrl || stage.customImage) return;
      stage.builtIn = photoUrl;
      stage.image = stage.builtIn;
      stage.boardImage = stage.builtIn;
    } catch {
      // Offline classrooms still get the local SVG icon cards.
    }
  }));
  renderAll();
}

function iconSvg(icon) {
  const common = `fill="none" stroke="white" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"`;
  const filled = `fill="white"`;
  const dark = `fill="rgba(23,33,43,.28)"`;
  const icons = {
    bear: `<ellipse cx="0" cy="14" rx="72" ry="50" ${filled}/><circle cx="-48" cy="-34" r="22" ${filled}/><circle cx="48" cy="-34" r="22" ${filled}/><circle cx="0" cy="-18" r="48" ${filled}/><path d="M-34-2 H34 L18 30 H-18Z" fill="rgba(23,33,43,.32)"/><path ${common} d="M-72 55 H72 M-32 56 V78 M32 56 V78"/>`,
    magpie: `<path ${filled} d="M-74 5 C-24-58 62-41 70 26 C33 43-18 44-74 5Z"/><path d="M-12 34 78 73 24 19Z" ${filled}/><circle cx="35" cy="-16" r="10" ${dark}/><path d="M66-7 96-19 70 12Z" fill="#ffd166"/><path ${common} d="M-50 16 C-85 31-91 55-112 69"/>`,
    monkey: `<circle cx="0" cy="-2" r="57" ${filled}/><circle cx="-58" cy="-5" r="25" ${filled}/><circle cx="58" cy="-5" r="25" ${filled}/><ellipse cx="0" cy="18" rx="38" ry="30" ${dark}/><circle cx="-18" cy="-15" r="7" ${dark}/><circle cx="18" cy="-15" r="7" ${dark}/><path ${common} d="M-70 60 C-30 100 62 88 74 38"/>`,
    muntjac: `<ellipse cx="6" cy="30" rx="68" ry="38" ${filled}/><circle cx="-56" cy="-3" r="30" ${filled}/><path ${common} d="M-68-25 L-83-62 M-48-27 L-31-61 M-41 59 V84 M35 59 V84"/><circle cx="-66" cy="-10" r="6" ${dark}/>`,
    pangolin: `<path ${filled} d="M-80 24 C-28-54 70-37 83 25 C42 76-34 76-80 24Z"/><path d="M-55 20 0-31 55 18 M-36 45 21-17 74 27 M-75 26 -24-24 33 48" ${common}/><path ${common} d="M70 23 C103 33 108 62 76 77"/>`,
    salmon: `<path ${filled} d="M-82 0 C-35-45 42-45 82 0 C42 45-35 45-82 0Z"/><path d="M82 0 117-31 117 31Z" ${filled}/><circle cx="-45" cy="-10" r="8" ${dark}/><path ${common} d="M-5-34 15 0 -5 34"/>`,
    lily: `<circle cx="0" cy="15" r="13" fill="#ffd166"/><path ${filled} d="M0 8 C-30-42-20-79 0-95 C20-79 30-42 0 8ZM-8 16 C-69-10-82-48-71-73 C-43-70-18-39-8 16ZM8 16 C69-10 82-48 71-73 C43-70 18-39 8 16Z"/><path ${common} d="M0 24 V88"/>`,
    cypress: `<path ${filled} d="M0-92 38-35H20L58 18H32L75 78H-75L-32 18H-58L-20-35H-38Z"/><rect x="-12" y="30" width="24" height="58" rx="8" ${dark}/>`,
    iguana: `<path ${filled} d="M-80 18 C-36-38 48-33 78 14 C30 54-34 57-80 18Z"/><path ${common} d="M-60 30 L-84 66 M-15 42 L-30 78 M30 40 L46 75 M77 14 C112 17 119 45 92 58"/><path d="M-32-29 -20-55 -7-29 6-58 18-29 31-53 43-25" ${filled}/><circle cx="49" cy="-2" r="7" ${dark}/>`,
    ant: `<circle cx="-50" cy="0" r="25" ${filled}/><circle cx="-7" cy="0" r="28" ${filled}/><circle cx="42" cy="0" r="34" ${filled}/><path ${common} d="M-22-21 -50-61 M-22 21 -50 61 M10-24 7-68 M10 24 7 68 M55-25 82-64 M55 25 82 64 M-63-20 -91-45 M-63 20 -91 45"/>`,
    snail: `<circle cx="-20" cy="4" r="51" ${filled}/><circle cx="-20" cy="4" r="24" ${dark}/><path ${common} d="M18 51 H82 C98 51 105 37 99 24 C92 10 74 11 62 20 M59 19 L75-32 M85 20 L105-22"/><circle cx="77" cy="-36" r="7" ${filled}/><circle cx="108" cy="-26" r="7" ${filled}/>`,
    vine: `<path ${common} d="M-83 72 C-47 20 -36-35 5-51 C41-65 70-38 77 1"/><ellipse cx="-45" cy="5" rx="31" ry="17" transform="rotate(-34 -45 5)" ${filled}/><ellipse cx="12" cy="-48" rx="34" ry="18" transform="rotate(-20 12 -48)" ${filled}/><ellipse cx="54" cy="-16" rx="30" ry="17" transform="rotate(42 54 -16)" ${filled}/><circle cx="-13" cy="-10" r="12" fill="#ffd166"/>`,
    hyacinth: `<path ${common} d="M0 20 V82 M-70 82 H70"/><g ${filled}><ellipse cx="0" cy="-35" rx="18" ry="34"/><ellipse cx="-31" cy="-16" rx="18" ry="32" transform="rotate(-42 -31 -16)"/><ellipse cx="31" cy="-16" rx="18" ry="32" transform="rotate(42 31 -16)"/><ellipse cx="-20" cy="18" rx="16" ry="27" transform="rotate(32 -20 18)"/><ellipse cx="20" cy="18" rx="16" ry="27" transform="rotate(-32 20 18)"/></g><circle cx="0" cy="-8" r="13" fill="#ffd166"/>`,
    aquaticPlant: `<path ${common} d="M0 80 V-36 M-70 80 H70"/><path ${filled} d="M0-34 C-26-61-26-89 0-99 C26-89 26-61 0-34ZM-8 8 C-57-8-78-39-68-66 C-36-66-13-38-8 8ZM8 8 C57-8 78-39 68-66 C36-66 13-38 8 8Z"/><circle cx="0" cy="-15" r="10" fill="#ffd166"/>`,
    butterfly: `<path ${filled} d="M-10-4 C-65-77-112-48-90 10 C-73 54-33 48-10-4ZM10-4 C65-77 112-48 90 10 C73 54 33 48 10-4Z"/><ellipse cx="0" cy="16" rx="13" ry="52" ${filled}/><path ${common} d="M-6-33 C-20-61-42-75-62-82 M6-33 C20-61 42-75 62-82"/>`,
    salamander: `<path ${filled} d="M-78 22 C-29-44 46-43 79 11 C42 49-32 60-78 22Z"/><path ${common} d="M-50 34 L-75 67 M-7 45 L-14 81 M35 37 L57 70 M76 10 C111 14 115 45 84 61"/><circle cx="44" cy="-5" r="7" ${dark}/>`,
    orchid: `<path ${common} d="M0 24 V86"/><path ${filled} d="M0 15 C-36-29-26-70 0-86 C26-70 36-29 0 15ZM-9 17 C-68 10-84-24-73-52 C-39-54-14-29-9 17ZM9 17 C68 10 84-24 73-52 C39-54 14-29 9 17Z"/><circle cx="0" cy="3" r="14" fill="#ffd166"/>`,
    fish: `<path ${filled} d="M-83 0 C-38-45 43-45 83 0 C43 45-38 45-83 0Z"/><path d="M83 0 118-34 118 34Z" ${filled}/><circle cx="-43" cy="-10" r="8" ${dark}/><path ${common} d="M-10-32 12 0 -10 32"/>`,
    crayfish: `<ellipse cx="0" cy="18" rx="34" ry="58" ${filled}/><path ${common} d="M-22-28 -58-62 M22-28 58-62 M-46-55 C-83-85-103-47-70-28 M46-55 C83-85 103-47 70-28 M-24 59 L-47 84 M0 65 V92 M24 59 L47 84"/><circle cx="-14" cy="-36" r="6" ${dark}/><circle cx="14" cy="-36" r="6" ${dark}/>`,
    frog: `<ellipse cx="0" cy="22" rx="63" ry="45" ${filled}/><circle cx="-35" cy="-26" r="24" ${filled}/><circle cx="35" cy="-26" r="24" ${filled}/><circle cx="-35" cy="-31" r="8" ${dark}/><circle cx="35" cy="-31" r="8" ${dark}/><path ${common} d="M-55 42 L-88 68 M55 42 L88 68 M-20 42 C-7 51 7 51 20 42"/>`,
    bird: `<path ${filled} d="M-70 8 C-18-57 62-34 76 25 C32 49-25 52-70 8Z"/><path d="M-16 28 77 76 28 20Z" ${filled}/><circle cx="38" cy="-9" r="8" ${dark}/><path d="M67 0 96-11 70 18Z" fill="#ffd166"/>`,
    catfish: `<path ${filled} d="M-80 6 C-35-40 43-39 82 2 C41 47-38 46-80 6Z"/><path d="M82 2 116-27 116 31Z" ${filled}/><circle cx="-45" cy="-6" r="7" ${dark}/><path ${common} d="M-62 8 H-112 M-60 18 H-105 M-34 34 L-50 66 M-3 36 L5 72"/>`,
    leucaena: `<path ${common} d="M0 84 V-74 M0-45 C-45-42-67-22-82 10 M0-18 C48-18 72 6 86 37 M0 22 C-38 23-58 43-70 72"/><g ${filled}><circle cx="-70" cy="4" r="16"/><circle cx="-49" cy="-16" r="16"/><circle cx="-27" cy="-30" r="16"/><circle cx="50" cy="19" r="16"/><circle cx="72" cy="42" r="16"/><circle cx="-56" cy="71" r="14"/></g>`,
    lantana: `<path ${common} d="M0 22 V86"/><g ${filled}><circle cx="-32" cy="-15" r="23"/><circle cx="0" cy="-38" r="23"/><circle cx="32" cy="-15" r="23"/><circle cx="-20" cy="20" r="23"/><circle cx="20" cy="20" r="23"/></g><circle cx="0" cy="-4" r="17" fill="#ffd166"/>`,
    ibis: `<path ${filled} d="M-60 25 C-35-48 58-50 73 22 C31 54-18 58-60 25Z"/><path ${common} d="M50-18 C83-56 120-52 123-20 C99-16 82-5 74 23 M-28 48 L-49 82 M25 47 L45 82"/><circle cx="74" cy="-24" r="7" ${dark}/>`,
    flag: `<path ${common} d="M-45 75 V-70"/><path ${filled} d="M-35-70 H60 L42-35 60 0 H-35Z"/><path ${common} d="M-66 75 H26"/>`
  };
  return icons[icon] || icons.flag;
}

function createPlayers(count) {
  const oldPlayers = players;
  players = Array.from({ length: count }, (_, index) => {
    const existing = oldPlayers[index];
    return existing || {
      id: crypto.randomUUID(),
      name: `玩家 ${index + 1}`,
      score: 0,
      position: 0,
      avatar: "",
      color: colors[index % colors.length]
    };
  });
  currentTurn = Math.min(currentTurn, players.length - 1);
  renderAll();
}

function renderAll() {
  renderBoard();
  renderPlayers();
  renderLeaderboard();
  renderStageEditor();
  updateTurnText();
}

function renderBoard() {
  board.innerHTML = "";
  stages.forEach((stage, index) => {
    const tile = document.createElement("article");
    tile.className = `tile${index === 0 ? " start" : ""}${players.some((player) => player.position === index) ? " active" : ""}`;
    const position = boardPositions[index];
    if (position) {
      tile.style.gridRow = position[0];
      tile.style.gridColumn = position[1];
    }

    const img = document.createElement("img");
    img.src = stage.boardImage || stage.image;
    img.alt = stage.name;

    const tokens = document.createElement("div");
    tokens.className = "tokens";
    players
      .filter((player) => player.position === index)
      .forEach((player, tokenIndex) => {
        const token = document.createElement("span");
        token.className = "token";
        token.style.background = player.color;
        token.textContent = player.name.trim().charAt(0) || tokenIndex + 1;
        tokens.append(token);
      });

    const name = document.createElement("div");
    name.className = "tile-name";
    name.textContent = `${index + 1}. ${stage.name}`;

    tile.append(img, tokens, name);
    board.append(tile);
  });
}

function renderPlayers() {
  playersList.innerHTML = "";
  players.forEach((player, index) => {
    const card = document.createElement("article");
    card.className = "player-card";
    card.innerHTML = `
      <div class="player-top">
        <div class="avatar" style="background:${player.color}">
          ${player.avatar ? `<img src="${player.avatar}" alt="${escapeHtml(player.name)}">` : `<span>${index + 1}</span>`}
        </div>
        <input type="text" value="${escapeHtml(player.name)}" aria-label="玩家姓名">
      </div>
      <div class="score-row">
        <button type="button" data-score="-1" aria-label="扣分">-</button>
        <input type="number" value="${player.score}" aria-label="分數">
        <button type="button" data-score="1" aria-label="加分">+</button>
      </div>
      <div class="player-actions">
        <button type="button" data-upload>上傳頭像</button>
        <button type="button" data-camera>Webcam</button>
      </div>
      <input class="hidden-file" type="file" accept="image/*">
    `;

    const nameInput = card.querySelector(".player-top input");
    const scoreInput = card.querySelector(".score-row input");
    const fileInput = card.querySelector(".hidden-file");

    nameInput.addEventListener("input", () => {
      player.name = nameInput.value;
      renderBoard();
      renderLeaderboard();
      updateTurnText();
    });
    scoreInput.addEventListener("input", () => {
      player.score = Number(scoreInput.value) || 0;
      renderLeaderboard();
    });
    card.querySelectorAll("[data-score]").forEach((button) => {
      button.addEventListener("click", () => {
        player.score += Number(button.dataset.score);
        renderPlayers();
        renderLeaderboard();
      });
    });
    card.querySelector("[data-upload]").addEventListener("click", () => fileInput.click());
    card.querySelector("[data-camera]").addEventListener("click", () => openCamera(player.id));
    fileInput.addEventListener("change", () => readImage(fileInput.files[0], (src) => {
      player.avatar = src;
      renderPlayers();
      renderLeaderboard();
    }));

    playersList.append(card);
  });
}

function renderLeaderboard() {
  leaderboard.innerHTML = "";
  [...players]
    .sort((a, b) => b.score - a.score)
    .forEach((player) => {
      const pill = document.createElement("div");
      pill.className = "leader-pill";
      pill.innerHTML = `<span class="token" style="background:${player.color}">${escapeHtml(player.name.trim().charAt(0) || "?")}</span><strong>${escapeHtml(player.name)}</strong><span>${player.score} 分</span>`;
      leaderboard.append(pill);
    });
}

function renderStageEditor() {
  stageEditor.innerHTML = "";
  stages.forEach((stage) => {
    const card = document.createElement("article");
    card.className = "stage-card";
    card.innerHTML = `
      <div class="stage-preview"><img src="${stage.image}" alt="${escapeHtml(stage.name)}"></div>
      <input class="stage-title" type="text" value="${escapeHtml(stage.name)}" aria-label="關卡名稱">
      <div class="image-actions">
        <button type="button" data-built-in>內建圖片</button>
        <button type="button" data-upload>上傳置換</button>
      </div>
      <input class="hidden-file" type="file" accept="image/*">
    `;

    const title = card.querySelector(".stage-title");
    const file = card.querySelector(".hidden-file");
    title.addEventListener("input", () => {
      stage.name = title.value;
      if (stage.customImage) {
        stage.image = makeUploadedStageImage(stage, stage.customImage);
        stage.boardImage = stage.image;
      }
      renderBoard();
    });
    card.querySelector("[data-built-in]").addEventListener("click", () => {
      stage.customImage = "";
      stage.image = stage.builtIn;
      stage.boardImage = stage.builtIn;
      renderAll();
    });
    card.querySelector("[data-upload]").addEventListener("click", () => file.click());
    file.addEventListener("change", () => readImage(file.files[0], (src) => {
      stage.customImage = src;
      stage.image = makeUploadedStageImage(stage, src);
      stage.boardImage = stage.image;
      renderAll();
    }));

    stageEditor.append(card);
  });
}

function readImage(file, callback) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function rollDice() {
  if (!players.length) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  const player = players[currentTurn];
  diceFace.textContent = roll;
  player.position = (player.position + roll) % stages.length;
  player.score += roll;
  currentTurn = (currentTurn + 1) % players.length;
  renderAll();
}

async function openCamera(playerId) {
  cameraPlayerId = playerId;
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraPreview.srcObject = cameraStream;
    cameraDialog.showModal();
  } catch {
    alert("無法開啟 Webcam，請確認瀏覽器權限或改用上傳頭像。");
  }
}

function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }
  cameraStream = null;
  cameraDialog.close();
}

function captureAvatar() {
  const player = players.find((item) => item.id === cameraPlayerId);
  if (!player) return;
  const context = avatarCanvas.getContext("2d");
  drawCenteredHeadshot(context, cameraPreview, avatarCanvas.width, avatarCanvas.height);
  player.avatar = avatarCanvas.toDataURL("image/png");
  closeCamera();
  renderPlayers();
  renderLeaderboard();
}

function drawCenteredHeadshot(context, source, width, height) {
  const sourceWidth = source.videoWidth || source.width;
  const sourceHeight = source.videoHeight || source.height;
  if (!sourceWidth || !sourceHeight) return;

  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const sourceX = Math.max(0, (sourceWidth - cropWidth) / 2);
  const sourceY = Math.max(0, (sourceHeight - cropHeight) * 0.32);

  context.clearRect(0, 0, width, height);
  context.drawImage(source, sourceX, sourceY, cropWidth, cropHeight, 0, 0, width, height);
}

function updateTurnText() {
  const player = players[currentTurn];
  turnText.textContent = player ? `輪到 ${player.name || "未命名玩家"} 擲骰` : "尚未建立玩家";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeSvg(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

titleInput.addEventListener("input", () => {
  displayTitle.textContent = titleInput.value || "線上大富翁";
  document.title = titleInput.value || "線上大富翁";
});

document.querySelector("#rollDice").addEventListener("click", rollDice);
document.querySelector("#closeCamera").addEventListener("click", closeCamera);
document.querySelector("#captureAvatar").addEventListener("click", captureAvatar);

createPlayers(4);
loadStagePhotos();
