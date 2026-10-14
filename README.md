# Genora — tanıtım sitesi

Genora için hazırlanmış tek sayfalık, Türkçe tanıtım sitesi. Saf HTML, CSS ve
vanilla JavaScript ile yazıldı; sunucu, derleme adımı veya paket kurulumu gerektirmez.
Tüm dosya yolları görelidir; site hem alan adının kökünde hem de GitHub Pages'in
`/genora/` gibi bir alt yolunda çalışır.

## Dosyalar

| Dosya | Açıklama |
| --- | --- |
| `index.html` | Sayfanın tüm içeriği (menü, ana alan, Hakkımızda, Yaklaşımımız, Süreç, Okuma önerisi, SSS, İletişim, alt bölüm) |
| `styles.css` | Tasarım: renkler, yazı tipleri, mobil/tablet/masaüstü düzeni, animasyonlar |
| `script.js` | İletişim ayarları, mobil menü, SSS akordeonu, kaydırma animasyonları |
| `favicon.svg` | Sekme simgesi |
| `fonts/` | Fraunces yazı tipi (SIL Open Font License — `fonts/OFL.txt`) |
| `assets/akintiya-karsi.pdf` | İndirilebilir “Akıntıya Karşı” kitabı |
| `.nojekyll` | GitHub Pages'in dosyaları Jekyll ile işlemesini engeller |

## İletişim bilgilerini düzenleme

Tüm iletişim bilgileri tek bir yerden yönetilir: `script.js` dosyasının en üstündeki
`GENORA_CONTACT` alanı.

```js
const GENORA_CONTACT = {
  email: "alp.soner@bilgiedu.net",
  phone: "",
  whatsapp: "",
  address: "",
  mapUrl: "",
  hours: "",
  instagram: "",
  linkedin: ""
};
```

- Boş bırakılan (`""`) alanlar sitede hiç görünmez; boş bir buton ya da çalışmayan bağlantı oluşmaz.
- Tüm alanlar boşsa İletişim bölümünde yalnızca “İletişim bilgilerimiz çok yakında burada yer alacak.” notu görünür.
- Sitede iletişim formu yoktur; e-posta butonu ziyaretçinin kendi e-posta uygulamasını açar.
- `instagram`, `linkedin` ve `mapUrl` alanları yalnızca `https://` ile başlayan tam bağlantıları kabul eder.

## Metinleri ve PDF'i düzenleme

- Metinler doğrudan `index.html` içindedir; her bölüm bir yorum satırıyla işaretlenmiştir (`<!-- SSS -->` gibi).
- SSS'ye yeni soru eklemek için mevcut bir `accordion-item` bloğunu kopyalayın ve `id` / `aria-controls` / `aria-labelledby` değerlerini benzersiz yapın (`sss-7`, `sss-7-btn`).
- Kitabı güncellemek için `assets/akintiya-karsi.pdf` dosyasını aynı adla değiştirin; sayfa sayısı ve boyut bilgisini `index.html` içindeki “Okuma önerisi” bölümünden güncelleyin.
- Renkler `styles.css` başındaki `:root` alanında değişken olarak tanımlıdır.

## Yerelde önizleme

`index.html` dosyasını tarayıcıda açmanız yeterlidir. Alternatif olarak klasörde
`python3 -m http.server` çalıştırıp `http://localhost:8000` adresini açabilirsiniz.

## GitHub Pages ile yayın

1. Depoda **Settings → Pages** sayfasını açın.
2. **Build and deployment → Source** olarak **Deploy from a branch** seçin.
3. **Branch** olarak `main`, klasör olarak `/ (root)` seçip **Save**'e basın.
4. Bir iki dakika içinde site `https://<kullanıcı-adı>.github.io/genora/` adresinde yayına girer.

Sonraki her `main` güncellemesi otomatik olarak yeniden yayınlanır.

## İçerik ilkeleri

Sitedeki metinler genel bilgilendirme düzeyindedir: tıbbi tanı, ilaç önerisi, kesin
sonuç vaadi, başarı yüzdesi, müşteri yorumu, sertifika veya klinik araştırma iddiası
içermez. Yeni içerik eklerken bu ilkeyi korumanız önerilir. Sitede çerez, analiz,
reklam aracı veya üçüncü taraf kaynak yoktur; gizli anahtar ya da erişim bilgisi barındırmaz.
