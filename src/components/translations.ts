export type SupportedLanguage = "de" | "en" | "ar" | "tr" | "am" | "fa" | "ru" | "uk"

export interface Translations {
  // Login Seite
  appTitle: string
  loginTitle: string
  loginSubtitle: string
  password: string
  passwordPlaceholder: string
  login: string
  checking: string
  wrongPassword: string
  securePrivate: string
  
  // Hauptanwendung
  voiceTranslator: string
  logout: string
  
  // Status
  connected: string
  disconnected: string
  recording: string
  translating: string
  error: string
  
  // Anweisungen
  pressAndSpeak: string
  speakNow: string
  translatingMessage: string
  startTranslation: string
  translated: string
  timeRemaining: string
  microphonePermissionError: string
  recordingError: string
  microphonePermissionTitle: string
  microphonePermissionDescription: string
  allowMicrophone: string
  requesting: string
  microphonePermissionHelp: string
  noMicrophoneError: string
  microphoneBusyError: string
  microphoneConstrainedError: string
  recorderNotSupportedError: string
  recordingError: string
  unknownError: string
  retryRecording: string
  
  // Backend-Integration
  audioProcessed: string
  translationReceived: string
  processingError: string
  networkError: string
  
  // Sprachen
  languages: {
    de: string
    en: string
    ar: string
    tr: string
    am: string
    fa: string
    ru: string
    uk: string
  }
}

const translations: Record<SupportedLanguage, Translations> = {
  de: {
    appTitle: "Sprach-Übersetzer",
    loginTitle: "Sprach-Übersetzer",
    loginSubtitle: "Geben Sie das Systempasswort ein, um fortzufahren",
    password: "Passwort",
    passwordPlaceholder: "Systempasswort eingeben",
    login: "Anmelden",
    checking: "Überprüfe...",
    wrongPassword: "Falsches Passwort. Bitte versuchen Sie es erneut.",
    securePrivate: "Sicher und privat • Keine Daten werden gespeichert",
    
    voiceTranslator: "Sprach-Übersetzer",
    logout: "Abmelden",
    
    connected: "Verbunden",
    disconnected: "Nicht verbunden",
    recording: "Aufnahme läuft...",
    translating: "Übersetze...",
    error: "Fehler aufgetreten",
    
    pressAndSpeak: "Drücken Sie das Mikrofon und sprechen Sie (max. 30s)",
    speakNow: "Sprechen Sie jetzt...",
    translatingMessage: "Ihre Nachricht wird übersetzt...",
    startTranslation: "Drücken Sie das Mikrofon, um mit der Übersetzung zu beginnen",
    translated: "Übersetzt",
    timeRemaining: "Verbleibende Zeit:",
    microphonePermissionError: "Mikrofonberechtigung verweigert. Bitte erlauben Sie den Zugriff auf das Mikrofon.",
    recordingError: "Aufnahmefehler. Bitte versuchen Sie es erneut.",
    microphonePermissionTitle: "Mikrofonzugriff erforderlich",
    microphonePermissionDescription: "Diese App benötigt Zugriff auf Ihr Mikrofon, um Sprache aufzunehmen und zu übersetzen.",
    allowMicrophone: "Mikrofon erlauben",
    requesting: "Anfrage läuft...",
    microphonePermissionHelp: "Klicken Sie auf \"Erlauben\" wenn Ihr Browser nach Mikrofonberechtigung fragt.",
    noMicrophoneError: "Kein Mikrofon gefunden. Stellen Sie sicher, dass ein Mikrofon angeschlossen ist.",
    microphoneBusyError: "Das Mikrofon wird bereits von einer anderen Anwendung verwendet.",
    microphoneConstrainedError: "Mikrofon-Einstellungen werden nicht unterstützt. Versuchen Sie es mit einem anderen Mikrofon.",
    recorderNotSupportedError: "Audio-Aufnahme wird von diesem Browser nicht unterstützt.",
    recordingError: "Aufnahmefehler. Bitte versuchen Sie es erneut.",
    unknownError: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    retryRecording: "Erneut versuchen",
    
    audioProcessed: "Audio verarbeitet",
    translationReceived: "Übersetzung empfangen",
    processingError: "Fehler beim Verarbeiten der Spracheingabe",
    networkError: "Netzwerkfehler - Server nicht erreichbar",
    
    languages: {
      de: "Deutsch",
      en: "English",
      ar: "العربية",
      tr: "Türkçe",
      am: "አማርኛ",
      fa: "فارسی",
      ru: "Русский",
      uk: "Українська"
    }
  },
  
  en: {
    appTitle: "Voice Translator",
    loginTitle: "Voice Translator",
    loginSubtitle: "Enter the system password to continue",
    password: "Password",
    passwordPlaceholder: "Enter system password",
    login: "Login",
    checking: "Checking...",
    wrongPassword: "Wrong password. Please try again.",
    securePrivate: "Secure and private • No data is stored",
    
    voiceTranslator: "Voice Translator",
    logout: "Logout",
    
    connected: "Connected",
    disconnected: "Disconnected",
    recording: "Recording...",
    translating: "Translating...",
    error: "Error occurred",
    
    pressAndSpeak: "Press the microphone and speak (max. 30s)",
    speakNow: "Speak now...",
    translatingMessage: "Your message is being translated...",
    startTranslation: "Press the microphone to start translation",
    translated: "Translated",
    timeRemaining: "Time remaining:",
    microphonePermissionError: "Microphone permission denied. Please allow microphone access.",
    recordingError: "Recording error. Please try again.",
    microphonePermissionTitle: "Microphone access required",
    microphonePermissionDescription: "This app needs access to your microphone to record and translate speech.",
    allowMicrophone: "Allow microphone",
    requesting: "Requesting...",
    microphonePermissionHelp: "Click \"Allow\" when your browser asks for microphone permission.",
    noMicrophoneError: "No microphone found. Make sure a microphone is connected.",
    microphoneBusyError: "The microphone is already being used by another application.",
    microphoneConstrainedError: "Microphone settings are not supported. Try with a different microphone.",
    recorderNotSupportedError: "Audio recording is not supported by this browser.",
    recordingError: "Recording error. Please try again.",
    unknownError: "An unknown error occurred. Please try again.",
    retryRecording: "Try again",
    
    audioProcessed: "Audio processed",
    translationReceived: "Translation received",
    processingError: "Error processing speech input",
    networkError: "Network error - Server not reachable",
    
    languages: {
      de: "German",
      en: "English",
      ar: "Arabic",
      tr: "Turkish",
      am: "Amharic",
      fa: "Persian",
      ru: "Russian",
      uk: "Ukrainian"
    }
  },

  ar: {
    appTitle: "مترجم صوتي",
    loginTitle: "مترجم صوتي",
    loginSubtitle: "أدخل كلمة مرور النظام للمتابعة",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة مرور النظام",
    login: "تسجيل الدخول",
    checking: "جاري التحقق...",
    wrongPassword: "كلمة مرور خاطئة. حاول مرة أخرى.",
    securePrivate: "آمن وخاص • لا يتم حفظ البيانات",
    
    voiceTranslator: "مترجم صوتي",
    logout: "تسجيل الخروج",
    
    connected: "متصل",
    disconnected: "غير متصل",
    recording: "جاري التسجيل...",
    translating: "جاري الترجمة...",
    error: "حدث خطأ",
    
    pressAndSpeak: "اضغط على الميكروفون وتحدث (حد أقصى 30 ثانية)",
    speakNow: "تحدث الآن...",
    translatingMessage: "جاري ترجمة رسالتك...",
    startTranslation: "اضغط على الميكروفون لبدء الترجمة",
    translated: "مترجم",
    timeRemaining: "الوقت المتبقي:",
    microphonePermissionError: "تم رفض إذن الميكروفون. يرجى السماح بالوصول إلى الميكروفون.",
    recordingError: "خطأ في التسجيل. حاول مرة أخرى.",
    microphonePermissionTitle: "مطلوب الوصول إلى الميكروفون",
    microphonePermissionDescription: "يحتاج هذا التطبيق إلى الوصول إلى الميكروفون لتسجيل وترجمة الكلام.",
    allowMicrophone: "السماح للميكروفون",
    requesting: "جاري الطلب...",
    microphonePermissionHelp: "انقر على \"السماح\" عندما يطلب المتصفح إذن الميكروفون.",
    noMicrophoneError: "لم يتم العثور على ميكروفون. تأكد من توصيل ميكروفون.",
    microphoneBusyError: "الميكروفون مستخدم بالفعل من قبل تطبيق آخر.",
    microphoneConstrainedError: "إعدادات الميكروفون غير مدعومة. جرب ميكروفوناً آخر.",
    recorderNotSupportedError: "تسجيل الصوت غير مدعوم في هذا المتصفح.",
    recordingError: "خطأ في التسجيل. حاول مرة أخرى.",
    unknownError: "حدث خطأ غير معروف. حاول مرة أخرى.",
    retryRecording: "حاول مرة أخرى",
    
    audioProcessed: "تم معالجة الصوت",
    translationReceived: "تم استلام الترجمة",
    processingError: "خطأ في معالجة الإدخال الصوتي",
    networkError: "خطأ في الشبكة - الخادم غير متاح",
    
    languages: {
      de: "الألمانية",
      en: "الإنجليزية",
      ar: "العربية",
      tr: "التركية",
      am: "الأمهرية",
      fa: "الفارسية",
      ru: "الروسية",
      uk: "الأوكرانية"
    }
  },

  tr: {
    appTitle: "Sesli Çevirmen",
    loginTitle: "Sesli Çevirmen",
    loginSubtitle: "Devam etmek için sistem şifresini girin",
    password: "Şifre",
    passwordPlaceholder: "Sistem şifresini girin",
    login: "Giriş Yap",
    checking: "Kontrol ediliyor...",
    wrongPassword: "Yanlış şifre. Lütfen tekrar deneyin.",
    securePrivate: "Güvenli ve özel • Veri saklanmaz",
    
    voiceTranslator: "Sesli Çevirmen",
    logout: "Çıkış Yap",
    
    connected: "Bağlandı",
    disconnected: "Bağlantı kesildi",
    recording: "Kayıt yapılıyor...",
    translating: "Çevriliyor...",
    error: "Hata oluştu",
    
    pressAndSpeak: "Mikrofona basın ve konuşun (en fazla 30s)",
    speakNow: "Şimdi konuşun...",
    translatingMessage: "Mesajınız çevriliyor...",
    startTranslation: "Çeviriyi başlatmak için mikrofona basın",
    translated: "Çevrildi",
    timeRemaining: "Kalan süre:",
    microphonePermissionError: "Mikrofon izni reddedildi. Lütfen mikrofon erişimine izin verin.",
    recordingError: "Kayıt hatası. Lütfen tekrar deneyin.",
    microphonePermissionTitle: "Mikrofon erişimi gerekli",
    microphonePermissionDescription: "Bu uygulama konuşmayı kaydetmek ve çevirmek için mikrofonunuza erişime ihtiyaç duyar.",
    allowMicrophone: "Mikrofona izin ver",
    requesting: "İstekte bulunuluyor...",
    microphonePermissionHelp: "Tarayıcınız mikrofon izni istediğinde \"İzin Ver\"e tıklayın.",
    noMicrophoneError: "Mikrofon bulunamadı. Bir mikrofonun bağlı olduğundan emin olun.",
    microphoneBusyError: "Mikrofon başka bir uygulama tarafından kullanılıyor.",
    microphoneConstrainedError: "Mikrofon ayarları desteklenmiyor. Farklı bir mikrofon deneyin.",
    recorderNotSupportedError: "Ses kaydı bu tarayıcı tarafından desteklenmiyor.",
    recordingError: "Kayıt hatası. Lütfen tekrar deneyin.",
    unknownError: "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.",
    retryRecording: "Tekrar dene",
    
    audioProcessed: "Ses işlendi",
    translationReceived: "Çeviri alındı",
    processingError: "Ses girişi işlenirken hata",
    networkError: "Ağ hatası - Sunucuya ulaşılamıyor",
    
    languages: {
      de: "Almanca",
      en: "İngilizce",
      ar: "Arapça",
      tr: "Türkçe",
      am: "Amharca",
      fa: "Farsça",
      ru: "Rusça",
      uk: "Ukraynaca"
    }
  },

  am: {
    appTitle: "የድምጽ ተርጓሚ",
    loginTitle: "የድምጽ ተርጓሚ",
    loginSubtitle: "ለመቀጠል የስርዓት የይለፍ ቃል ያስገቡ",
    password: "የይለፍ ቃል",
    passwordPlaceholder: "የስርዓት የይለፍ ቃል ያስገቡ",
    login: "ግባ",
    checking: "እየተረጋገጠ...",
    wrongPassword: "ስህተት የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።",
    securePrivate: "ደህንነቱ የተጠበቀ እና የግል • ምንም መረጃ አይቀመጥም",
    
    voiceTranslator: "የድምጽ ተርጓሚ",
    logout: "ውጣ",
    
    connected: "ተገናኝቷል",
    disconnected: "ተቋርጧል",
    recording: "እየቀረጸ...",
    translating: "እየተረጎመ...",
    error: "ስህተት ተከስቷል",
    
    pressAndSpeak: "ማይክሮፎኑን ተጭነው ይናገሩ (ከፍተኛ 30ሰ)",
    speakNow: "አሁን ይናገሩ...",
    translatingMessage: "መልእክትዎ እየተረጎመ ነው...",
    startTranslation: "ትርጉምን ለመጀመር ማይክሮፎኑን ይጫኑ",
    translated: "ተተርጎሟል",
    timeRemaining: "የቀረ ጊዜ:",
    microphonePermissionError: "የማይክሮፎን ፈቃድ ተከልክሏል። እባክዎ የማይክሮፎን መዳረሻን ይፍቀዱ።",
    recordingError: "የቀረጻ ስህተት። እባክዎ እንደገና ይሞክሩ።",
    microphonePermissionTitle: "የማይክሮፎን መዳረሻ ያስፈልጋል",
    microphonePermissionDescription: "ይህ መተግበሪያ ንግግርን ለመቅረጽ እና ለመተርጎም የእርስዎን ማይክሮፎን መዳረሻ ያስፈልገዋል።",
    allowMicrophone: "ማይክሮፎንን ፍቀድ",
    requesting: "እየጠየቀ...",
    microphonePermissionHelp: "አሳሽዎ የማይክሮፎን ፈቃድ ሲጠይቅ \"ፍቀድ\" ይጫኑ።",
    noMicrophoneError: "ማይክሮፎን አልተገኘም። ማይክሮፎን መያያዙን ያረጋግጡ።",
    microphoneBusyError: "ማይክሮፎኑ በሌላ መተግበሪያ ጥቅም ላይ ይውላል።",
    microphoneConstrainedError: "የማይክሮፎን ቅንብሮች አይደገፉም። ሌላ ማይክሮፎን ይሞክሩ።",
    recorderNotSupportedError: "የድምፅ ቀረጻ በዚህ ዳሰሳ ክፍል አይደገፍም።",
    recordingError: "የቀረጻ ስህተት። እባክዎ እንደገና ይሞክሩ።",
    unknownError: "ያልታወቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
    retryRecording: "እንደገና ሞክር",
    
    audioProcessed: "ድምጽ ተሰራ",
    translationReceived: "ትርጉም ተቀበለ",
    processingError: "የድምጽ ግብአት ሲሰራ ስህተት",
    networkError: "የኔትወርክ ስህተት - አገልጋይ ሊደረስበት አይችልም",
    
    languages: {
      de: "ጀርመንኛ",
      en: "እንግሊዝኛ",
      ar: "ዓረብኛ",
      tr: "ቱርክኛ",
      am: "አማርኛ",
      fa: "ፋርስኛ",
      ru: "ሩስኛ",
      uk: "ዩክሬንኛ"
    }
  },

  fa: {
    appTitle: "مترجم صوتی",
    loginTitle: "مترجم صوتی",
    loginSubtitle: "برای ادامه رمز عبور سیستم را وارد کنید",
    password: "رمز عبور",
    passwordPlaceholder: "رمز عبور سیستم را وارد کنید",
    login: "ورود",
    checking: "در حال بررسی...",
    wrongPassword: "رمز عبور اشتباه. لطفا دوباره تلاش کنید.",
    securePrivate: "امن و خصوصی • هیچ داده‌ای ذخیره نمی‌شود",
    
    voiceTranslator: "مترجم صوتی",
    logout: "خروج",
    
    connected: "متصل",
    disconnected: "قطع شده",
    recording: "در حال ضبط...",
    translating: "در حال ترجمه...",
    error: "خطا رخ داده",
    
    pressAndSpeak: "میکروفون را فشار دهید و صحبت کنید (حداکثر ۳۰ ثانیه)",
    speakNow: "الان صحبت کنید...",
    translatingMessage: "پیام شما در حال ترجمه است...",
    startTranslation: "برای شروع ترجمه میکروفون را فشار دهید",
    translated: "ترجمه شده",
    timeRemaining: "زمان باقی‌مانده:",
    microphonePermissionError: "دسترسی میکروفون رد شد. لطفا دسترسی میکروفون را مجاز کنید.",
    recordingError: "خطا در ضبط. لطفا دوباره تلاش کنید.",
    microphonePermissionTitle: "دسترسی میکروفون مورد نیاز است",
    microphonePermissionDescription: "این برنامه برای ضبط و ترجمه گفتار به دسترسی میکروفون شما نیاز دارد.",
    allowMicrophone: "اجازه میکروفون",
    requesting: "در حال درخواست...",
    microphonePermissionHelp: "وقتی مرورگر شما اجازه میکروفون می‌خواهد روی \"اجازه\" کلیک کنید.",
    noMicrophoneError: "میکروفون یافت نشد. مطمئن شوید میکروفون متصل است.",
    microphoneBusyError: "میکروفون توسط برنامه دیگری استفاده می‌شود.",
    microphoneConstrainedError: "تنظیمات میکروفون پشتیبانی نمی‌شود. میکروفون دیگری امتحان کنید.",
    recorderNotSupportedError: "ضبط صدا توسط این مرورگر پشتیبانی نمی‌شود.",
    recordingError: "خطا در ضبط. لطفا دوباره تلاش کنید.",
    unknownError: "خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.",
    retryRecording: "دوباره تلاش کن",
    
    audioProcessed: "صدا پردازش شد",
    translationReceived: "ترجمه دریافت شد",
    processingError: "خطا در پردازش ورودی صوتی",
    networkError: "خطای شبکه - سرور در دسترس نیست",
    
    languages: {
      de: "آلمانی",
      en: "انگلیسی",
      ar: "عربی",
      tr: "ترکی",
      am: "امهری",
      fa: "فارسی",
      ru: "روسی",
      uk: "اوکراینی"
    }
  },
  
  ru: {
    appTitle: "Голосовой Переводчик",
    loginTitle: "Голосовой Переводчик",
    loginSubtitle: "Введите системный пароль для продолжения",
    password: "Пароль",
    passwordPlaceholder: "Введите системный пароль",
    login: "Войти",
    checking: "Проверка...",
    wrongPassword: "Неверный пароль. Попробуйте снова.",
    securePrivate: "Безопасно и приватно • Данные не сохраняются",
    
    voiceTranslator: "Голосовой Переводчик",
    logout: "Выйти",
    
    connected: "Подключено",
    disconnected: "Отключено",
    recording: "Запись...",
    translating: "Перевод...",
    error: "Произошла ошибка",
    
    pressAndSpeak: "Нажмите микрофон и говорите (макс. 30с)",
    speakNow: "Говорите сейчас...",
    translatingMessage: "Ваше сообщение переводится...",
    startTranslation: "Нажмите микрофон, чтобы начать перевод",
    translated: "Переведено",
    timeRemaining: "Оставшееся время:",
    microphonePermissionError: "Доступ к микрофону запрещен. Пожалуйста, разрешите доступ к микрофону.",
    recordingError: "Ошибка записи. Пожалуйста, попробуйте снова.",
    microphonePermissionTitle: "Требуется доступ к микрофону",
    microphonePermissionDescription: "Этому приложению нужен доступ к вашему микрофону для записи и перевода речи.",
    allowMicrophone: "Разрешить микрофон",
    requesting: "Запрос...",
    microphonePermissionHelp: "Нажмите \"Разрешить\", когда браузер запросит разрешение на микрофон.",
    noMicrophoneError: "Микрофон не найден. Убедитесь, что микрофон подключен.",
    microphoneBusyError: "Микрофон уже используется другим приложением.",
    microphoneConstrainedError: "Настройки микрофона не поддерживаются. Попробуйте другой микрофон.",
    recorderNotSupportedError: "Запись звука не поддерживается этим браузером.",
    recordingError: "Ошибка записи. Пожалуйста, попробуйте снова.",
    unknownError: "Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.",
    retryRecording: "Попробовать снова",
    
    audioProcessed: "Аудио обработано",
    translationReceived: "Перевод получен",
    processingError: "Ошибка обработки речевого ввода",
    networkError: "Сетевая ошибка - Сервер недоступен",
    
    languages: {
      de: "Немецкий",
      en: "Английский",
      ar: "Арабский",
      tr: "Турецкий",
      am: "Амхарский",
      fa: "Персидский",
      ru: "Русский",
      uk: "Украинский"
    }
  },

  uk: {
    appTitle: "Голосовий Перекладач",
    loginTitle: "Голосовий Перекладач",
    loginSubtitle: "Введіть системний пароль для продовження",
    password: "Пароль",
    passwordPlaceholder: "Введіть системний пароль",
    login: "Увійти",
    checking: "Перевірка...",
    wrongPassword: "Неправильний пароль. Спробуйте ще раз.",
    securePrivate: "Безпечно і приватно • Дані не зберігаються",
    
    voiceTranslator: "Голосовий Перекладач",
    logout: "Вийти",
    
    connected: "Підключено",
    disconnected: "Відключено",
    recording: "Запис...",
    translating: "Переклад...",
    error: "Сталася помилка",
    
    pressAndSpeak: "Натисніть мікрофон і говоріть (макс. 30с)",
    speakNow: "Говоріть зараз...",
    translatingMessage: "Ваше повідомлення перекладається...",
    startTranslation: "Натисніть мікрофон, щоб почати переклад",
    translated: "Перекладено",
    timeRemaining: "Час, що залишився:",
    microphonePermissionError: "Доступ до мікрофона заборонено. Будь ласка, дозвольте доступ до мікрофона.",
    recordingError: "Помилка запису. Будь ласка, спробуйте ще раз.",
    microphonePermissionTitle: "Потрібен доступ до мікрофона",
    microphonePermissionDescription: "Цій програмі потрібен доступ до вашого мікрофона для запису та перекладу мовлення.",
    allowMicrophone: "Дозволити мікрофон",
    requesting: "Запит...",
    microphonePermissionHelp: "Натисніть \"Дозволити\", коли браузер запросить дозвіл на мікрофон.",
    noMicrophoneError: "Мікрофон не знайдено. Переконайтеся, що мікрофон підключено.",
    microphoneBusyError: "Мікрофон вже використовується іншою програмою.",
    microphoneConstrainedError: "Налаштування мікрофона не підтримуються. Спробуйте інший мікрофон.",
    recorderNotSupportedError: "Запис звуку не підтримується цим браузером.",
    recordingError: "Помилка запису. Будь ласка, спробуйте ще раз.",
    unknownError: "Сталася невідома помилка. Будь ласка, спробуйте ще раз.",
    retryRecording: "Спробувати ще раз",
    
    audioProcessed: "Аудіо оброблено",
    translationReceived: "Переклад отримано",
    processingError: "Помилка обробки мовного вводу",
    networkError: "Мережева помилка - Сервер недоступний",
    
    languages: {
      de: "Німецька",
      en: "Англійська",
      ar: "Арабська",
      tr: "Турецька",
      am: "Амхарська",
      fa: "Перська",
      ru: "Російська",
      uk: "Українська"
    }
  }
}

export function getTranslation(language: SupportedLanguage): Translations {
  return translations[language] || translations.de
}