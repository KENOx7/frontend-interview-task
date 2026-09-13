# ⚖️ Frontend Interview Task — Qərar Dəftəri (Decision Notebook)
> İstifadəçilərə müxtəlif seçimləri qeyd etmək, müsbət/mənfi cəhətləri təhlil etmək və ən optimal qərarı vermək imkanı yaradan müasir, yerli (local-first) və tam responsiv veb tətbiqi.

---

## 📌 Layihə haqqında

**frontend-interview-task (Qərar Dəftəri)** — fərdlərin və ya komandaların seçim qarşısında qaldıqları zaman qərar qəbul etmə prosesini addım-addım strukturlaşdıran və asanlaşdıran veb tətbiqidir. 

İstifadəçi həll etmək istədiyi mövzunu və ya sualı daxil edir, mümkün variantları siyahıya əlavə edir, hər bir variant üzrə üstünlük və çatışmazlıqları (müsbət və mənfi cəhətləri) və ulduz reytinqini qeyd edir, sonda isə yekun qalib seçimini təsdiqləyir. Tətbiq tamamilə brauzer daxilində (local-first) işləyir və məlumatların dərhal yadda saxlanılmasını təmin edir.

---

## 🚀 İstifadə edilən texnologiyalar

Layihə müasir frontend standartlarına uyğun, təmiz kod arxitekturası və yüksək performanslı alətlərlə inşa edilmişdir:

- **React 19 (`react`, `react-dom`)** — Komponent əsaslı interfeys və vəziyyət idarəetməsi (Hooks & `useReducer`).
- **Vite 8 (`vite`, `@vitejs/plugin-react`)** — İldırım sürətli Hot Module Replacement (HMR) və müasir layihə yığma mühiti.
- **Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)** — Bütün komponentlərdə utiliti sinifləri və CSS dəyişənləri (CSS variables) ilə inteqrasiya olunmuş müasir dizayn sistemi.
- **Lucide React (`lucide-react`)** — Bütün naviqasiya və interaktiv fəaliyyətlər üçün yüngül, təmiz SVG ikonlar.

---

## ✨ Əsas funksiyalar

- **Yeni qərar yaratmaq:** Mövzu və ya sual daxil edərək dərhal yeni qərar lövhəsi yaratmaq.
- **Qərara seçimlər (options) əlavə etmək:** Təkrar və ya boş seçim adlarının daxil edilməsinin qarşısını alan avtomatik yoxlama.
- **Qalib seçimi təyin etmək:** Klikləyərək qərarı seçmək və ya seçimi geri qaytarmaq (toggle/deselect) imkanı.
- **Nəticəni vizual bannerlə təqdim etmək:** Qərar seçildikdə dinamik nəticə kartı və konfeti animasiyası işə düşür.
- **Dərin təhlil paneli (Pros/Cons və 1–5 Ulduz Qiymətləndirmə):** Hər seçim üçün xal vermək, müsbət və mənfi cəhətləri ayrıca qeyd etmək.
- **Sıralamanı dəyişmək (Reorder):** Seçimləri həm masaüstündə sürükləyib-buraxmaqla (Drag-and-Drop), həm də yuxarı/aşağı ox düymələri ilə sıralamaq.
- **Təhlükəsiz silmə (Confirm-before-delete):** Təsadüfi itkilərin qarşısını almaq üçün iki mərhələli təsdiq («Sil» → «Əminsiniz?»).
- **Qərar başlığını redaktə etmək (Inline Edit):** Mövcud qərarın adını birbaşa başlıq üzərinə klikləyərək operativ redaktə etmək.
- **Qərarlar paneli (Sidebar):** Bütün aktiv və tamamlanmış qərarlar arasında rahat keçid. Uzun başlıqlar kəsilmir, kursor üzərinə gəldikdə yumşaq şəkildə sürüşərək oxunur (marquee stream).
- **Hazır şablonlar (Templates):** Tez başlamaq üçün əvvəlcədən hazırlanmış mövzular (nahar seçimi, həftəsonu səyahəti, öyrəniləcək texnologiya).
- **İşıqlı və Qaranlıq rejim (Light/Dark mode):** CSS dəyişənləri üzərində qurulmuş kontrastlı tema dəstəyi və ilk girişdə interaktiv seçim pəncərəsi.
- **Mobil uyğunluq (Responsive Design):** Mobil ekranlar üçün açılıb-bağlanan yan siyirmə menyu (drawer), mətni qoruyan `overflow-wrap: break-word` və xüsusi mobil tərtibat.

---

## 💻 Layihənin quraşdırılması və işə salınması

Layihəni lokal mühitinizdə işə salmaq üçün addımlar:

1. **Repozitoriyanı klonlayın:**
   ```bash
   git clone <repo-url>
   ```

2. **Layihə qovluğuna daxil olun:**
   ```bash
   cd frontend-interview-task
   ```

3. **Asılılıqları quraşdırın:**
   ```bash
   npm install
   ```

4. **İnkişaf (development) serverini başladın:**
   ```bash
   npm run dev
   ```
   Brauzerdə `http://localhost:5173` ünvanına daxil olun.

5. **İstehsal (production build) yığımı yoxlamaq üçün:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📂 Layihənin qovluq strukturu

```text
frontend-interview-task/
├── public/                  # Statik fayllar
├── src/
│   ├── components/          # Təmiz Tailwind ilə yazılmış UI komponentləri
│   │   ├── DecisionDetail.jsx   # Qərarın əsas iş sahəsi və seçimlərin siyahısı
│   │   ├── EmptyState.jsx       # Ana səhifə, statistika və hazır şablonlar
│   │   ├── OptionItem.jsx       # Tək bir variant (reytinq, pros/cons, dnd)
│   │   ├── Sidebar.jsx          # Yan naviqasiya paneli və qərar siyahısı
│   │   └── ThemePromptModal.jsx # İlkin tema seçim modalı
│   ├── context/
│   │   └── ThemeContext.jsx # Qlobal Dark/Light tema vəziyyəti və localStorage sinxronu
│   ├── hooks/
│   │   └── useDecisions.js  # Qərarlar üçün mərkəzləşdirilmiş useReducer və CRUD məntiqi
│   ├── utils/
│   │   ├── confetti.js      # Qərar qalibiyyəti üçün konfeti effekti
│   │   └── dateUtils.js     # Tarix və saat formatlaşdırma köməkçisi
│   ├── App.jsx              # Əsas layout və responsive konteyner
│   ├── index.css            # Tailwind CSS v4, tema dəyişənləri və əsas animasiyalar
│   └── main.jsx             # Giriş nöqtəsi (React root)
├── index.html               # Tətbiqin HTML şablonu və SEO teqləri
├── package.json             # Layihə adı və asılılıqlar
└── vite.config.js           # Vite və Tailwind konfiqurasiyası
```

---

## 🧠 Qəbul edilən texniki qərarlar və əsaslandırmalar

### 1. Eyni seçimə təkrar klikləmə məntiqi (Idempotency / Toggle Edge Case)
İstifadəçi artıq seçilmiş qalib variantın üzərinə təkrar kliklədikdə tətbiq onu **ləğv edir (deselect / toggle off)** — yəni `selectedOptionId` yenidən `null` vəziyyətinə gətirilir.

- **Niyə bu yanaşma seçildi?**
  1. İstifadəçi fikrini dəyişdikdə və ya təsadüfən kliklədikdə, seçimi silib yenidən yaratmaq məcburiyyətində qalmamalıdır.
  2. Qərarın nəticə banneri dərhal gizlənir və qərar yenidən "Gözləyir" statusuna keçir. Bu, istifadəçiyə dərhal aydın vizual əks-əlaqə (visual feedback) verir.
  3. Qalibiyyət hesablamasının və konfeti animasiyasının əsassız yerə təkrar işə düşməsinin qarşısı alınır, vəziyyət (state) tam nəzarətdə saxlanılır.

### 2. Məlumatların saxlanılması (Local Storage Persistence)
Tətbiq tamamilə brauzerin `localStorage` yaddaşı üzərində avtomatik sinxronlaşır:
- Bütün qərarlar, onların daxili seçimləri, xalları, müsbət/mənfi cəhətləri və aktiv seçim ID-si vahid `qerar_taxtasi_v1` açarı altında JSON formatında saxlanılır.
- Vəziyyət (state) hər dəfə dəyişdikdə `useReducer` aksiyaları vasitəsilə `localStorage`-ə yazılır.
- Seçilmiş vizual tema (`light` və ya `dark`) isə `qerar_theme` açarı ilə saxlanılır və səhifə yeniləndikdə qorunur.

### 3. Vəziyyət idarəetməsi (`useReducer` + Custom Hook)
Xarici ağır kitabxanalara (Redux, Zustand) ehtiyac duyulmadan, bütün mürəkkəb CRUD əməliyyatları React-in doğma `useReducer` aləti ilə `useDecisions.js` daxilində mərkəzləşdirilmişdir. Bütün vəziyyət dəyişiklikləri saf və aydın aksiyalarla (`CREATE_DECISION`, `SELECT_OPTION`, `ADD_OPTION`, `REORDER_OPTIONS` və s.) idarə olunur.

### 4. Mobil Optimallaşdırma və Mətn Qorunması
Kiçik ekranlarda uzun sözlərin və cümlələrin bloklardan daşmasının qarşısını almaq üçün `break-words`, `overflow-wrap: anywhere` və `min-w-0` siniflərindən istifadə edilmişdir. Mobil cihazlarda toxunmanı dəstəkləməyən artıq elementlər gizlədilərək istifadəçi üçün mətn sahəsi maksimum genişləndirilmişdir.
