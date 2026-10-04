/* Service worker do Prisma (RC-PWA-PRISMA-ADR-001 §8). Escopo: /prisma/.
 * Guarda a casca do app (HTML, JS, CSS, ícones) para abrir offline depois do primeiro acesso.
 * Só trata requisições GET de mesma origem: o formulário nunca gera requisição, então nenhum
 * conteúdo pessoal passa por aqui nem é guardado em cache. */
const VERSION = "rc-prisma-v1";
const SHELL = [
  "/prisma/",
  "/prisma/manifest.webmanifest",
  "/favicon/android-chrome-192x192.png",
  "/favicon/android-chrome-512x512.png",
  "/favicon/maskable-icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("rc-prisma-") && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// A página entrega os arquivos que já carregou (JS/CSS com hash), que o worker ainda não tinha visto.
self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;
  const same = event.data.urls.filter((u) => {
    try {
      return new URL(u).origin === self.location.origin;
    } catch {
      return false;
    }
  });
  event.waitUntil(caches.open(VERSION).then((cache) => Promise.all(same.map((u) => cache.add(u).catch(() => undefined)))));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Documento do Prisma: rede primeiro (versão nova), cache quando offline.
  if (req.mode === "navigate" && url.pathname.startsWith("/prisma/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("/prisma/", copy));
          return res;
        })
        .catch(() => caches.match("/prisma/").then((hit) => hit || Response.error())),
    );
    return;
  }

  // Arquivos estáticos do app: cache primeiro; o que não estiver guardado vai à rede e fica guardado.
  if (/^\/(assets|favicon|images|prisma)\//.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
