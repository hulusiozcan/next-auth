# NextAuth + Auth0 + Next.js Demo



NextAuth.js ve Auth0 kullanarak OAuth kimlik doğrulama ile JWT tabanlı oturum yönetimi sunan, Next.js App Router tabanlı bir örnek proje.



## Özellikler



- Auth0 OAuth entegrasyonu

- JWT tabanlı session yönetimi

- Rol bazlı yetkilendirme (admin, user)

- Middleware ile korunan sayfalar (dashboard, admin)

- TailwindCSS ve shadcn/ui ile modern arayüz



---



## Kurulum



1.  **Projeyi klonlayın:**

```bash

git clone https://github.com/hulusiozcan/next-auth.git

cd next-auth

```



2.  **Bağımlılıkları yükleyin:**

```bash

npm install

# veya

yarn install

```



3.  **Ortam değişkenlerini ayarlayın:**

-  `.env.example` dosyasını kopyalayın:

```bash

cp .env.example .env.local

```

-  `.env.local` dosyasındaki gerekli alanları doldurun (Auth0 ayarları için aşağıya bakınız).



---



## Auth0 Yapılandırması



1.  **Auth0 hesabı oluşturun ve uygulama ekleyin:**

-  [auth0.com](https://auth0.com) adresinden hesap oluşturun.

- Applications bölümünden yeni bir Regular Web Application oluşturun.



2.  **Aşağıdaki ayarları uygulamanıza tanımlayın:**

-  **Allowed Callback URLs:**

```

http://localhost:3000/api/auth/callback/auth0

```

-  **Allowed Logout URLs:**

```

http://localhost:3000

```

-  **Allowed Web Origins:**

```

http://localhost:3000

```



3.  **Aldığınız bilgileri `.env.local` dosyanıza ekleyin:**

-  `AUTH0_DOMAIN`

-  `AUTH0_CLIENT_ID`

-  `AUTH0_CLIENT_SECRET`

-  `AUTH0_SECRET` (güçlü bir secret üretin, örnek: `openssl rand -hex 32`)

-  `APP_BASE_URL` → `http://localhost:3000` (veya kendi adresiniz)



---



## Projeyi Başlatma



```bash

npm  run  dev

# veya

yarn  dev

```



Uygulamaya [http://localhost:3000](http://localhost:3000) adresinden erişebilirsiniz.



---



## Teknik Notlar



-  **12Factor:** Yapılandırmalar environment değişkenlerinde tutulur, kod tabanı statelesstir, bağımlılıklar package manager ile yönetilir.

-  **SOLID:** Kodda component/fonksiyon bazlı ayrım ve tek sorumluluk prensibi uygulanmıştır.

-  **JWT:** Auth0’dan dönen id_token içindeki rol, session’a eklenir.

-  **Rol bazlı yetkilendirme:**

-  `/admin`: Sadece admin rolüne sahip kullanıcılar erişebilir.

-  `/dashboard`: Giriş yapmış tüm kullanıcılar erişebilir.



---