// User-facing strings for the high-visibility UI surfaces (auth, profile root,
// capture, language/voice screens). Dense settings copy (sync-gmail body,
// developer screen, validation errors) is intentionally not translated for the
// hackathon demo — see `app/(app)/profile/language.tsx` footnote.
import type { LanguageId } from './languages'

type Translations = Record<LanguageId, string>

export const STRINGS = {
    // ---- Common ----
    'common.save': {
        en: 'Save',
        es: 'Guardar',
        fr: 'Enregistrer',
        de: 'Speichern',
        pt: 'Salvar',
        it: 'Salva',
        ja: '保存',
        zh: '保存'
    },
    'common.cancel': {
        en: 'Cancel',
        es: 'Cancelar',
        fr: 'Annuler',
        de: 'Abbrechen',
        pt: 'Cancelar',
        it: 'Annulla',
        ja: 'キャンセル',
        zh: '取消'
    },

    // ---- Auth ----
    'auth.welcomeBack': {
        en: 'Welcome back',
        es: 'Bienvenido de nuevo',
        fr: 'Bon retour',
        de: 'Willkommen zurück',
        pt: 'Bem-vindo de volta',
        it: 'Bentornato',
        ja: 'おかえりなさい',
        zh: '欢迎回来'
    },
    'auth.createAccount': {
        en: 'Create your account',
        es: 'Crea tu cuenta',
        fr: 'Créez votre compte',
        de: 'Konto erstellen',
        pt: 'Crie sua conta',
        it: 'Crea il tuo account',
        ja: 'アカウントを作成',
        zh: '创建账户'
    },
    'auth.email': {
        en: 'Email',
        es: 'Correo electrónico',
        fr: 'E-mail',
        de: 'E-Mail',
        pt: 'E-mail',
        it: 'E-mail',
        ja: 'メールアドレス',
        zh: '邮箱'
    },
    'auth.password': {
        en: 'Password',
        es: 'Contraseña',
        fr: 'Mot de passe',
        de: 'Passwort',
        pt: 'Senha',
        it: 'Password',
        ja: 'パスワード',
        zh: '密码'
    },
    'auth.firstName': {
        en: 'First name',
        es: 'Nombre',
        fr: 'Prénom',
        de: 'Vorname',
        pt: 'Nome',
        it: 'Nome',
        ja: '名',
        zh: '名'
    },
    'auth.lastName': {
        en: 'Last name',
        es: 'Apellido',
        fr: 'Nom',
        de: 'Nachname',
        pt: 'Sobrenome',
        it: 'Cognome',
        ja: '姓',
        zh: '姓'
    },
    'auth.signIn': {
        en: 'Sign in',
        es: 'Iniciar sesión',
        fr: 'Se connecter',
        de: 'Anmelden',
        pt: 'Entrar',
        it: 'Accedi',
        ja: 'サインイン',
        zh: '登录'
    },
    'auth.signingIn': {
        en: 'Signing in…',
        es: 'Iniciando…',
        fr: 'Connexion…',
        de: 'Anmeldung…',
        pt: 'Entrando…',
        it: 'Accesso…',
        ja: 'サインイン中…',
        zh: '登录中…'
    },
    'auth.signUp': {
        en: 'Sign Up',
        es: 'Registrarse',
        fr: 'S’inscrire',
        de: 'Registrieren',
        pt: 'Cadastrar',
        it: 'Registrati',
        ja: '新規登録',
        zh: '注册'
    },
    'auth.creatingAccount': {
        en: 'Creating account…',
        es: 'Creando cuenta…',
        fr: 'Création du compte…',
        de: 'Konto wird erstellt…',
        pt: 'Criando conta…',
        it: 'Creazione account…',
        ja: 'アカウント作成中…',
        zh: '正在创建账户…'
    },
    'auth.noAccount': {
        en: 'Don’t have an account?',
        es: '¿No tienes una cuenta?',
        fr: 'Pas de compte ?',
        de: 'Noch kein Konto?',
        pt: 'Não tem uma conta?',
        it: 'Non hai un account?',
        ja: 'アカウントをお持ちでないですか？',
        zh: '还没有账户？'
    },
    'auth.hasAccount': {
        en: 'Already have an account?',
        es: '¿Ya tienes una cuenta?',
        fr: 'Vous avez déjà un compte ?',
        de: 'Bereits ein Konto?',
        pt: 'Já tem uma conta?',
        it: 'Hai già un account?',
        ja: 'すでにアカウントをお持ちですか？',
        zh: '已有账户？'
    },

    // ---- Profile sections ----
    'profile.account': {
        en: 'Account',
        es: 'Cuenta',
        fr: 'Compte',
        de: 'Konto',
        pt: 'Conta',
        it: 'Account',
        ja: 'アカウント',
        zh: '账户'
    },
    'profile.preferences': {
        en: 'Preferences',
        es: 'Preferencias',
        fr: 'Préférences',
        de: 'Einstellungen',
        pt: 'Preferências',
        it: 'Preferenze',
        ja: '設定',
        zh: '偏好'
    },
    'profile.developer': {
        en: 'Developer',
        es: 'Desarrollador',
        fr: 'Développeur',
        de: 'Entwickler',
        pt: 'Desenvolvedor',
        it: 'Sviluppatore',
        ja: '開発者',
        zh: '开发者'
    },
    'profile.session': {
        en: 'Session',
        es: 'Sesión',
        fr: 'Session',
        de: 'Sitzung',
        pt: 'Sessão',
        it: 'Sessione',
        ja: 'セッション',
        zh: '会话'
    },

    // ---- Profile rows + stack titles ----
    'profile.title': {
        en: 'Profile',
        es: 'Perfil',
        fr: 'Profil',
        de: 'Profil',
        pt: 'Perfil',
        it: 'Profilo',
        ja: 'プロフィール',
        zh: '个人资料'
    },
    'settings.personalInfo': {
        en: 'Personal Information',
        es: 'Información personal',
        fr: 'Informations personnelles',
        de: 'Persönliche Daten',
        pt: 'Informações pessoais',
        it: 'Informazioni personali',
        ja: '個人情報',
        zh: '个人信息'
    },
    'settings.notifications': {
        en: 'Notifications',
        es: 'Notificaciones',
        fr: 'Notifications',
        de: 'Benachrichtigungen',
        pt: 'Notificações',
        it: 'Notifiche',
        ja: '通知',
        zh: '通知'
    },
    'settings.language': {
        en: 'Language',
        es: 'Idioma',
        fr: 'Langue',
        de: 'Sprache',
        pt: 'Idioma',
        it: 'Lingua',
        ja: '言語',
        zh: '语言'
    },
    'settings.voice': {
        en: 'Voice',
        es: 'Voz',
        fr: 'Voix',
        de: 'Stimme',
        pt: 'Voz',
        it: 'Voce',
        ja: '音声',
        zh: '语音'
    },
    'settings.syncGmail': {
        en: 'Sync Gmail',
        es: 'Sincronizar Gmail',
        fr: 'Synchroniser Gmail',
        de: 'Gmail synchronisieren',
        pt: 'Sincronizar Gmail',
        it: 'Sincronizza Gmail',
        ja: 'Gmail を同期',
        zh: '同步 Gmail'
    },
    'settings.calendar': {
        en: 'Calendar',
        es: 'Calendario',
        fr: 'Calendrier',
        de: 'Kalender',
        pt: 'Calendário',
        it: 'Calendario',
        ja: 'カレンダー',
        zh: '日历'
    },
    'settings.exportDatabase': {
        en: 'Export database',
        es: 'Exportar base de datos',
        fr: 'Exporter la base',
        de: 'Datenbank exportieren',
        pt: 'Exportar base de dados',
        it: 'Esporta database',
        ja: 'データベースを書き出す',
        zh: '导出数据库'
    },
    'profile.signOut': {
        en: 'Sign Out',
        es: 'Cerrar sesión',
        fr: 'Se déconnecter',
        de: 'Abmelden',
        pt: 'Sair',
        it: 'Esci',
        ja: 'サインアウト',
        zh: '退出登录'
    },
    'profile.signingOut': {
        en: 'Signing out…',
        es: 'Cerrando sesión…',
        fr: 'Déconnexion…',
        de: 'Abmelden…',
        pt: 'Saindo…',
        it: 'Disconnessione…',
        ja: 'サインアウト中…',
        zh: '退出中…'
    },

    // ---- Capture ----
    'capture.statusIdle': {
        en: 'Your mind is clear.',
        es: 'Tu mente está despejada.',
        fr: 'Votre esprit est clair.',
        de: 'Dein Kopf ist frei.',
        pt: 'Sua mente está livre.',
        it: 'La tua mente è libera.',
        ja: '頭の中がすっきりしています。',
        zh: '思绪清晰。'
    },
    'capture.statusListening': {
        en: 'Listening…',
        es: 'Escuchando…',
        fr: 'À l’écoute…',
        de: 'Höre zu…',
        pt: 'Ouvindo…',
        it: 'In ascolto…',
        ja: '聞いています…',
        zh: '正在聆听…'
    },
    'capture.statusThinking': {
        en: 'Thinking…',
        es: 'Pensando…',
        fr: 'Réflexion…',
        de: 'Denke nach…',
        pt: 'Pensando…',
        it: 'Sto pensando…',
        ja: '考えています…',
        zh: '思考中…'
    },
    'capture.statusSpeaking': {
        en: 'Speaking…',
        es: 'Hablando…',
        fr: 'Je parle…',
        de: 'Spreche…',
        pt: 'Falando…',
        it: 'Sto parlando…',
        ja: '話しています…',
        zh: '正在说话…'
    },
    'capture.inputPlaceholder': {
        en: 'Type or hold the mic...',
        es: 'Escribe o mantén el micro...',
        fr: 'Écrivez ou maintenez le micro...',
        de: 'Tippen oder Mikro halten...',
        pt: 'Digite ou segure o microfone...',
        it: 'Scrivi o tieni il microfono...',
        ja: '入力するかマイクを長押し...',
        zh: '输入或按住麦克风...'
    },
    'capture.send': {
        en: 'Send message',
        es: 'Enviar mensaje',
        fr: 'Envoyer le message',
        de: 'Nachricht senden',
        pt: 'Enviar mensagem',
        it: 'Invia messaggio',
        ja: 'メッセージを送信',
        zh: '发送消息'
    },

    // ---- Voice picker ----
    'voice.intro': {
        en: 'Pick the voice the assistant uses when replying out loud. Preview uses your Language setting. Falls back to your device voice if the network is unavailable.',
        es: 'Elige la voz que el asistente usa al hablar en voz alta. La vista previa usa tu idioma. Si no hay red, vuelve a la voz del dispositivo.',
        fr: 'Choisissez la voix que l’assistant utilise à l’oral. L’aperçu suit votre langue. Sans réseau, on bascule sur la voix du téléphone.',
        de: 'Wähle die Stimme, mit der der Assistent antwortet. Die Vorschau folgt deiner Sprache. Ohne Netz übernimmt die Gerätestimme.',
        pt: 'Escolha a voz que o assistente usa ao falar. A pré-visualização segue seu idioma. Sem internet, usa a voz do aparelho.',
        it: 'Scegli la voce con cui l’assistente risponde. L’anteprima segue la tua lingua. Senza rete usa la voce del dispositivo.',
        ja: 'アシスタントが声で答えるときに使う声を選びます。プレビューは選んだ言語に従います。ネットがないと端末の音声に切り替わります。',
        zh: '选择助手朗读时使用的声音。预览将使用你设置的语言。无网络时会回退到设备声音。'
    },
    'voice.preview': {
        en: 'Preview voice',
        es: 'Probar voz',
        fr: 'Aperçu de la voix',
        de: 'Stimme anhören',
        pt: 'Ouvir voz',
        it: 'Anteprima voce',
        ja: '声をプレビュー',
        zh: '试听声音'
    },

    // ---- Language picker ----
    'language.intro': {
        en: 'The assistant replies and reads back in this language. You can still speak in English — Murmur will respond in your chosen language.',
        es: 'El asistente responde y lee en este idioma. Aún puedes hablar en inglés: Murmur responderá en tu idioma.',
        fr: 'L’assistant répond et lit dans cette langue. Vous pouvez parler en anglais : Murmur répondra dans la langue choisie.',
        de: 'Der Assistent antwortet und liest in dieser Sprache. Du kannst weiter Englisch sprechen — Murmur antwortet in deiner Sprache.',
        pt: 'O assistente responde e fala neste idioma. Você ainda pode falar em inglês — Murmur responde no idioma escolhido.',
        it: 'L’assistente risponde e legge in questa lingua. Puoi continuare a parlare in inglese — Murmur risponderà nella lingua scelta.',
        ja: 'アシスタントはこの言語で返事をし、読み上げます。英語で話しても、Murmur は選んだ言語で返事します。',
        zh: '助手将以此语言回复和朗读。你仍可以用英语说话 —— Murmur 会用你选择的语言回应。'
    },
    'language.footnote': {
        en: 'Chat replies, voice, and main navigation follow this setting. A few in-depth settings screens still display in English.',
        es: 'Las respuestas del chat, la voz y la navegación principal siguen este ajuste. Algunas pantallas avanzadas siguen en inglés.',
        fr: 'Les réponses, la voix et la navigation principale suivent ce réglage. Quelques écrans avancés restent en anglais.',
        de: 'Antworten, Stimme und Hauptnavigation folgen dieser Einstellung. Einige Detail-Screens bleiben auf Englisch.',
        pt: 'As respostas, a voz e a navegação principal seguem esta configuração. Algumas telas avançadas continuam em inglês.',
        it: 'Risposte, voce e navigazione principale seguono questa impostazione. Alcune schermate avanzate restano in inglese.',
        ja: 'チャット返信、音声、主要なナビゲーションはこの設定に従います。一部の詳細設定画面は英語のまま表示されます。',
        zh: '聊天回复、语音和主导航将跟随此设置。部分高级设置页仍以英语显示。'
    }
} as const satisfies Record<string, Translations>

export type StringKey = keyof typeof STRINGS
