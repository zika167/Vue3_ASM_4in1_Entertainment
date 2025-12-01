# 📋 BÁO CÁO ĐỀ XUẤT REFACTOR - COMPONENT-BASED ARCHITECTURE

**Ngày phân tích:** 01/12/2025  
**Phân tích bởi:** Senior Vue.js Developer  
**Phương pháp:** Component-based với Props & Emits (One-way binding)

---

## 1. 📊 PHÂN TÍCH HIỆN TRẠNG

### 🔴 Vấn đề phát hiện:

#### A. **FavoritesPage.vue** (~250 dòng)
**Vấn đề:**
- ❌ **Lặp code video card** - Logic render video card giống HomePage nhưng viết lại
- ❌ **Logic phức tạp** - Xử lý favorite, share, dropdown actions trộn lẫn trong 1 component
- ❌ **Khó maintain** - Thay đổi UI video card phải sửa ở nhiều nơi
- ❌ **Không tái sử dụng** - Video actions (like, share, menu) viết riêng cho từng page

#### B. **VideoDetailPage.vue** (~320 dòng)
**Vấn đề:**
- ❌ **Related videos section** - Logic render video list lặp lại
- ❌ **Action buttons** - Like, favorite, share buttons viết inline, không reusable
- ❌ **Channel info** - Có thể tách thành component riêng
- ❌ **Video player** - Nên tách ra để dễ customize và test

#### C. **AccountPage.vue** (~200 dòng)
**Vấn đề:**
- ❌ **Form fields lặp lại** - Mỗi input có cấu trúc giống nhau (label + icon + input)
- ❌ **Info cards** - 3 cards có structure giống nhau, chỉ khác data
- ❌ **Validation logic** - Trộn lẫn trong component, khó test

#### D. **HomePage.vue** (~120 dòng)
**Vấn đề:**
- ✅ **Tốt** - Đã dùng VideoCard component
- ⚠️ **Có thể cải thiện** - Page header có thể tách thành component

---

## 2. 🎯 KẾ HOẠCH TÁCH COMPONENT

### 📦 COMPONENT MỚI CẦN TẠO

| # | Component | File Path | Mục đích |
|---|-----------|-----------|----------|
| 1 | `VideoCardWithActions` | `components/video/VideoCardWithActions.vue` | Video card có actions (like, share, menu) |
| 2 | `VideoActionButtons` | `components/video/VideoActionButtons.vue` | Nhóm nút actions (like, favorite, share) |
| 3 | `VideoPlayer` | `components/video/VideoPlayer.vue` | Video player với play button |
| 4 | `ChannelInfo` | `components/video/ChannelInfo.vue` | Thông tin kênh + nút subscribe |
| 5 | `RelatedVideoList` | `components/video/RelatedVideoList.vue` | Danh sách video liên quan |
| 6 | `FormField` | `components/form/FormField.vue` | Input field với label + icon |
| 7 | `InfoCard` | `components/ui/InfoCard.vue` | Card hiển thị thông tin |
| 8 | `PageBanner` | `components/ui/PageBanner.vue` | Banner header cho pages |

---

## 3. 📋 CHI TIẾT TỪNG COMPONENT

### 🎬 Component 1: VideoCardWithActions

**File:** `src/components/video/VideoCardWithActions.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `video` | Object | ✅ | - | Thông tin video |
| `showActions` | Boolean | ❌ | `true` | Hiển thị action buttons |
| `showMenu` | Boolean | ❌ | `true` | Hiển thị dropdown menu |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `toggle-favorite` | `videoId: number` | Khi click nút favorite |
| `share` | `video: Object` | Khi click nút share |
| `add-to-playlist` | `video: Object` | Khi click thêm vào playlist |
| `remove` | `videoId: number` | Khi click xóa |

**Sử dụng:**
```vue
<VideoCardWithActions
  :video="video"
  :show-actions="true"
  :show-menu="true"
  @toggle-favorite="handleFavorite"
  @share="handleShare"
  @remove="handleRemove"
/>
```

---

### 🎬 Component 2: VideoActionButtons

**File:** `src/components/video/VideoActionButtons.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `videoId` | Number | ✅ | - | ID video |
| `likes` | Number | ❌ | `0` | Số lượt thích |
| `isLiked` | Boolean | ❌ | `false` | Đã thích chưa |
| `isFavorite` | Boolean | ❌ | `false` | Đã yêu thích chưa |
| `showDownload` | Boolean | ❌ | `false` | Hiển thị nút download |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `like` | `videoId: number` | Khi click like |
| `favorite` | `videoId: number` | Khi click favorite |
| `share` | `videoId: number` | Khi click share |
| `download` | `videoId: number` | Khi click download |

**Sử dụng:**
```vue
<VideoActionButtons
  :video-id="video.id"
  :likes="video.likes"
  :is-liked="video.isLiked"
  :is-favorite="video.isFavorite"
  :show-download="true"
  @like="handleLike"
  @favorite="handleFavorite"
  @share="handleShare"
/>
```

---

### 🎬 Component 3: VideoPlayer

**File:** `src/components/video/VideoPlayer.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `thumbnail` | String | ✅ | - | URL thumbnail |
| `title` | String | ✅ | - | Tiêu đề video |
| `autoplay` | Boolean | ❌ | `false` | Tự động phát |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `play` | - | Khi click nút play |

**Sử dụng:**
```vue
<VideoPlayer
  :thumbnail="video.thumbnail"
  :title="video.title"
  @play="handlePlay"
/>
```

---

### 🎬 Component 4: ChannelInfo

**File:** `src/components/video/ChannelInfo.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `channelName` | String | ✅ | - | Tên kênh |
| `channelAvatar` | String | ✅ | - | Avatar kênh |
| `subscribers` | String | ❌ | `'0'` | Số subscribers |
| `isSubscribed` | Boolean | ❌ | `false` | Đã subscribe chưa |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `subscribe` | - | Khi click nút subscribe |

**Sử dụng:**
```vue
<ChannelInfo
  :channel-name="video.channelName"
  :channel-avatar="video.channelAvatar"
  subscribers="1.2M"
  :is-subscribed="false"
  @subscribe="handleSubscribe"
/>
```

---

### 🎬 Component 5: RelatedVideoList

**File:** `src/components/video/RelatedVideoList.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `videos` | Array | ✅ | - | Danh sách video |
| `loading` | Boolean | ❌ | `false` | Trạng thái loading |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `video-click` | `videoId: number` | Khi click vào video |

**Sử dụng:**
```vue
<RelatedVideoList
  :videos="relatedVideos"
  :loading="loading"
  @video-click="goToVideo"
/>
```

---

### 📝 Component 6: FormField

**File:** `src/components/form/FormField.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `label` | String | ✅ | - | Label của field |
| `icon` | String | ❌ | `''` | Bootstrap icon class |
| `type` | String | ❌ | `'text'` | Input type |
| `modelValue` | String | ✅ | - | Giá trị (v-model) |
| `placeholder` | String | ❌ | `''` | Placeholder |
| `required` | Boolean | ❌ | `false` | Bắt buộc |
| `readonly` | Boolean | ❌ | `false` | Chỉ đọc |
| `helpText` | String | ❌ | `''` | Text hướng dẫn |

**Emits:**
| Event | Payload | Mô tả |
|-------|---------|-------|
| `update:modelValue` | `value: string` | Khi input thay đổi |

**Sử dụng:**
```vue
<FormField
  label="Họ và tên"
  icon="bi-person-fill"
  v-model="formData.fullname"
  :required="true"
/>
```

---

### 📋 Component 7: InfoCard

**File:** `src/components/ui/InfoCard.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `title` | String | ✅ | - | Tiêu đề card |
| `icon` | String | ❌ | `''` | Icon cho header |
| `headerColor` | String | ❌ | `'primary'` | Màu header |

**Slots:**
| Slot | Mô tả |
|------|-------|
| `default` | Nội dung card body |

**Sử dụng:**
```vue
<InfoCard
  title="Thông Tin Khác"
  icon="bi-info-circle"
  header-color="info"
>
  <ul>
    <li>Ngày tham gia: 01/01/2024</li>
  </ul>
</InfoCard>
```

---

### 🎨 Component 8: PageBanner

**File:** `src/components/ui/PageBanner.vue`

**Props:**
| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `title` | String | ✅ | - | Tiêu đề |
| `subtitle` | String | ❌ | `''` | Phụ đề |
| `icon` | String | ❌ | `''` | Icon |
| `gradient` | String | ❌ | `'dark'` | Theme gradient |

**Sử dụng:**
```vue
<PageBanner
  title="Chào mừng đến với 4IN1"
  subtitle="Nền tảng chia sẻ video hàng đầu"
  icon="bi-film"
  gradient="dark"
/>
```

---

## 4. 📊 ĐÁNH GIÁ HIỆU QUẢ (ƯỚC TÍNH)

### 📉 Giảm Code tại File Cha

| File | Trước Refactor | Sau Refactor | Giảm | % Giảm |
|------|----------------|--------------|------|--------|
| **FavoritesPage.vue** | ~250 dòng | ~120 dòng | -130 dòng | **-52%** |
| **VideoDetailPage.vue** | ~320 dòng | ~180 dòng | -140 dòng | **-44%** |
| **AccountPage.vue** | ~200 dòng | ~110 dòng | -90 dòng | **-45%** |
| **HomePage.vue** | ~120 dòng | ~90 dòng | -30 dòng | **-25%** |
| **TỔNG** | **~890 dòng** | **~500 dòng** | **-390 dòng** | **-44%** |

### 📈 Tăng Components (Đầu tư ban đầu)

| Component | Ước tính dòng code |
|-----------|-------------------|
| VideoCardWithActions | ~120 dòng |
| VideoActionButtons | ~80 dòng |
| VideoPlayer | ~60 dòng |
| ChannelInfo | ~50 dòng |
| RelatedVideoList | ~70 dòng |
| FormField | ~50 dòng |
| InfoCard | ~40 dòng |
| PageBanner | ~40 dòng |
| **TỔNG** | **~510 dòng** |

### 💡 Phân tích:
- **Giảm 390 dòng** ở các file cha
- **Thêm 510 dòng** cho components mới
- **Tổng tăng:** +120 dòng (~13%)

**Nhưng:**
- ✅ Code **dễ đọc hơn** (mỗi component < 150 dòng)
- ✅ **Tái sử dụng** được ở nhiều nơi
- ✅ **Dễ test** (test từng component riêng)
- ✅ **Dễ maintain** (sửa 1 chỗ, apply toàn bộ)

---

## 5. 🎯 LỢI ÍCH CLEAN CODE

### ✅ **Single Responsibility Principle (SRP)**
```
Trước: FavoritesPage làm 5 việc
  - Render video list
  - Handle favorite logic
  - Handle share logic
  - Handle dropdown menu
  - Handle sorting

Sau: Mỗi component làm 1 việc
  - VideoCardWithActions: Chỉ render video card
  - VideoActionButtons: Chỉ handle actions
  - Parent: Chỉ orchestrate logic
```

### ✅ **DRY (Don't Repeat Yourself)**
```
Trước: Video card logic lặp ở 3 nơi
  - HomePage
  - FavoritesPage
  - VideoDetailPage (related videos)

Sau: Dùng chung 1 component
  - VideoCardWithActions (reusable)
```

### ✅ **Separation of Concerns**
```
Trước: UI + Logic + Data trộn lẫn

Sau: Tách rõ ràng
  - Component: UI presentation
  - Props: Data flow (one-way)
  - Emits: Event handling
  - Parent: Business logic
```

### ✅ **Testability**
```
Trước: Test cả page (phức tạp)

Sau: Test từng component nhỏ
  - Test VideoActionButtons riêng
  - Test FormField riêng
  - Mock props dễ dàng
```

### ✅ **Maintainability**
```
Trước: Sửa UI video card → Sửa 3 files

Sau: Sửa UI video card → Sửa 1 component
  → Auto apply toàn bộ
```

### ✅ **Scalability**
```
Trước: Thêm feature mới → Code càng dài

Sau: Thêm feature mới → Compose components
  - Dễ thêm props mới
  - Dễ thêm emits mới
  - Không ảnh hưởng code cũ
```

---

## 6. 🔄 LUỒNG DỮ LIỆU (ONE-WAY BINDING)

### Ví dụ: FavoritesPage

```
┌─────────────────────────────────────┐
│      FavoritesPage (Parent)         │
│  - Quản lý state (videos, loading)  │
│  - Business logic (API calls)       │
└──────────────┬──────────────────────┘
               │ Props ↓
               │ (video, showActions)
               │
┌──────────────▼──────────────────────┐
│    VideoCardWithActions (Child)     │
│  - Chỉ render UI                    │
│  - Không có business logic          │
└──────────────┬──────────────────────┘
               │ Emits ↑
               │ (toggle-favorite, share)
               │
┌──────────────▼──────────────────────┐
│      FavoritesPage (Parent)         │
│  - Handle events                    │
│  - Update state                     │
│  - Call API                         │
└─────────────────────────────────────┘
```

**Lợi ích:**
- ✅ Data flow rõ ràng (top-down)
- ✅ Events flow ngược lại (bottom-up)
- ✅ Child components không biết về parent
- ✅ Dễ debug (theo dõi props/emits)

---

## 7. 📝 PRIORITY REFACTOR

### 🔥 **Priority 1 (Cao nhất)** - Làm ngay
1. **VideoCardWithActions** - Dùng ở 3 pages
2. **VideoActionButtons** - Dùng ở 2 pages
3. **FormField** - Dùng ở AccountPage (nhiều fields)

### ⚡ **Priority 2 (Trung bình)** - Làm sau
4. **VideoPlayer** - Chỉ dùng ở VideoDetailPage
5. **ChannelInfo** - Chỉ dùng ở VideoDetailPage
6. **RelatedVideoList** - Chỉ dùng ở VideoDetailPage

### 💡 **Priority 3 (Thấp)** - Optional
7. **InfoCard** - Dùng ở AccountPage
8. **PageBanner** - Dùng ở HomePage

---

## 8. ⚠️ RỦI RO & GIẢI PHÁP

### ⚠️ Rủi ro 1: **Over-engineering**
**Vấn đề:** Tạo quá nhiều components nhỏ, code phức tạp hơn

**Giải pháp:**
- ✅ Chỉ tách khi component được dùng ≥ 2 lần
- ✅ Hoặc khi component cha > 200 dòng
- ✅ Theo priority list (làm Priority 1 trước)

### ⚠️ Rủi ro 2: **Props drilling**
**Vấn đề:** Truyền props qua nhiều levels

**Giải pháp:**
- ✅ Dùng `provide/inject` nếu cần
- ✅ Hoặc dùng composables (đã có sẵn)
- ✅ Không cần Pinia (theo phân tích trước)

### ⚠️ Rủi ro 3: **Breaking changes**
**Vấn đề:** Refactor làm hỏng features cũ

**Giải pháp:**
- ✅ Refactor từng page một
- ✅ Test kỹ sau mỗi refactor
- ✅ Giữ nguyên API/behavior

---

## 9. ✅ CHECKLIST TRƯỚC KHI REFACTOR

- [ ] Đọc kỹ báo cáo này
- [ ] Hiểu rõ Props/Emits pattern
- [ ] Backup code hiện tại
- [ ] Chuẩn bị test cases
- [ ] Thống nhất với team về naming conventions
- [ ] Quyết định priority (làm component nào trước)

---

## 10. 🎯 KẾT LUẬN & KHUYẾN NGHỊ

### ✅ **NÊN REFACTOR** vì:
1. **Giảm 44% code** tại các file cha
2. **Tăng tính tái sử dụng** (1 component → nhiều nơi)
3. **Dễ maintain** (sửa 1 chỗ, apply toàn bộ)
4. **Dễ test** (test từng component nhỏ)
5. **Clean Code** (SRP, DRY, Separation of Concerns)
6. **Scalable** (dễ thêm features mới)

### 📋 **ROADMAP ĐỀ XUẤT:**

**Phase 1 (1-2 ngày):**
- Tạo VideoCardWithActions
- Tạo VideoActionButtons
- Refactor FavoritesPage

**Phase 2 (1 ngày):**
- Tạo FormField
- Refactor AccountPage

**Phase 3 (1-2 ngày):**
- Tạo VideoPlayer, ChannelInfo, RelatedVideoList
- Refactor VideoDetailPage

**Phase 4 (Optional):**
- Tạo InfoCard, PageBanner
- Polish & optimize

---

## 📞 NEXT STEPS

**Chờ phản hồi từ bạn:**
- ✅ **"Đồng ý"** hoặc **"OK"** → Tôi sẽ bắt đầu viết code
- 🔄 **"Sửa lại"** → Cho tôi biết cần điều chỉnh gì
- ❌ **"Không refactor"** → Giữ nguyên code hiện tại

---

**Prepared by:** Senior Vue.js Developer  
**Date:** 01/12/2025  
**Status:** ⏳ **WAITING FOR APPROVAL**
