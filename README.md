# 台灣原生種生物大冒險

## 注意事項

### 圖片顯示與裁切

本專案的棋盤圖片曾出現兩種顯示問題：

1. 動物頭部或主要部位被切掉。
2. 每一關卡片中間出現大塊空白。

主要原因：

- iNaturalist 的 `square_url` 是平台預先裁切過的正方形縮圖，原始照片中的頭部可能已經被切掉。
- 棋盤格高度會隨版面被撐開，如果 `.tile img` 直接使用 `height: 100%` 搭配 `object-fit: contain`，圖片會完整保留但上下或左右出現空白。
- 若只使用 `object-fit: cover` 且沒有固定圖片框比例，雖然可以填滿，但可能再次裁切主體。

目前避免方式：

- 外部照片優先使用 `medium_url`，不要優先使用 `square_url`。
- 棋盤每一關的圖片區固定為 `aspect-ratio: 16 / 9`，與右側關卡圖片預覽一致。
- `.tile` 不要讓圖片列使用 `1fr` 撐滿整個棋盤格；目前使用 `grid-template-rows: auto auto` 並讓卡片靠上排列。
- `.tile img` 使用 `object-fit: cover` 填滿固定的 16:9 圖片區，避免卡片內出現空白。
- 右側預覽仍可使用 `object-fit: contain`，方便檢查完整圖片。
- 玩家頭像可以保留 `object-fit: cover`，因為頭像本來就是圓形裁切用途。

相關位置：

- `app.js`: `loadStagePhotos()` 中的圖片來源選擇。
- `styles.css`: `.tile`、`.tile img`、`.stage-preview img`、`.avatar img` 的版面與 `object-fit` 設定。

### 本機圖片資產

- 生物圖片已下載到 `assets/stages/`，GitHub Pages 會優先使用這些本機圖片。
- `scripts/download-stage-images.mjs` 可重新從 iNaturalist 下載 20 張關卡圖片。
- 若要替換圖片，請保持 `assets/stages/` 內的檔名不變，或同步更新 `app.js` 的 `localStageImages` 清單。
