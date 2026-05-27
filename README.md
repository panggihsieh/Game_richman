# 台灣原生種生物大冒險

## 注意事項

### 圖片顯示與裁切

本專案的棋盤格圖片曾出現動物頭部或主要部位被切掉的問題，主要原因有兩個：

1. iNaturalist 的 `square_url` 是已經被平台裁切過的正方形縮圖，原始照片中的頭部可能在取得圖片時就已經被切掉。
2. CSS 若使用 `object-fit: cover`，圖片會為了填滿棋盤格而再次裁切，寬圖或主體偏左、偏右的照片特別容易被切到。

目前避免方式：

- 外部照片優先使用 `medium_url`，保留較完整的原圖比例。
- 棋盤格與右側預覽使用 `object-fit: contain`，讓圖片完整顯示。
- 玩家頭像可以保留 `object-fit: cover`，因為頭像本來就是圓形裁切用途。
- 若未來要調整棋盤圖片樣式，不要把 `.tile img` 改回 `object-fit: cover`，除非已經確認所有圖片來源都是安全置中的縮圖。

相關位置：

- `app.js`: `loadStagePhotos()` 中的圖片來源選擇。
- `styles.css`: `.tile img`、`.stage-preview img`、`.avatar img` 的 `object-fit` 設定。
