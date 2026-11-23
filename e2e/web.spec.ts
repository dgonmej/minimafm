/*
 * Cada página de la web carga con datos de la API, sin errores en la consola y sin desbordar a lo
 * ancho, en móvil, tableta y escritorio, en claro y en oscuro (RAD-47).
 */
import { expect, test, type Page } from '@playwright/test';

const ANCHOS = [320, 375, 768, 1280];
const TEMAS = ['light', 'dark'] as const;

/** Un elemento publicado de cada tipo, para probar las páginas de detalle */
async function primero(request: import('@playwright/test').APIRequestContext, tipo: string) {
  const res = await request.get(`/api/${tipo}?limite=1`);
  expect(res.ok(), `La API no responde en /api/${tipo}`).toBeTruthy();
  const [fila] = await res.json();
  expect(fila, `No hay ${tipo} publicados para probar`).toBeTruthy();
  return fila.id as string;
}

/** Lo que sobresale a lo ancho (0 si nada) y el elemento responsable, para el mensaje de error */
async function desborde(page: Page) {
  return page.evaluate(() => {
    const ancho = document.documentElement.clientWidth;
    const exceso = document.documentElement.scrollWidth - ancho;
    if (exceso <= 0) return { exceso: 0, culpable: '' };
    const culpable = [...document.querySelectorAll('body *')].find((el) => el.getBoundingClientRect().right > ancho + 1);
    const describir = (el: Element) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.classList.length ? `.${[...el.classList].join('.')}` : ''}`;
    return { exceso, culpable: culpable ? describir(culpable) : '' };
  });
}

let paginas: string[] = [];
test.beforeAll(async ({ request }) => {
  const [programa, evento, noticia, legal] = await Promise.all(['programas', 'eventos', 'noticias', 'paginas'].map((t) => primero(request, t)));
  paginas = ['/', '/programas/', `/programas/${programa}/`, '/horarios/', '/noticias/', `/noticias/${noticia}/`, '/eventos/', `/eventos/${evento}/`, '/la-radio/', '/anunciate/', `/legal/${legal}/`];
});

for (const tema of TEMAS)
  for (const ancho of ANCHOS)
    test(`todas las páginas a ${ancho} px en ${tema === 'light' ? 'claro' : 'oscuro'}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema });
      await page.setViewportSize({ width: ancho, height: 800 });
      const errores: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errores.push(`${page.url()}: ${m.text()}`));
      page.on('pageerror', (e) => errores.push(`${page.url()}: ${e.message}`));

      for (const ruta of paginas) {
        const res = await page.goto(ruta);
        expect(res?.status(), ruta).toBe(200);
        await expect(page.locator('main')).toBeVisible();
        const { exceso, culpable } = await desborde(page);
        expect(exceso, `${ruta} desborda ${exceso} px por ${culpable}`).toBe(0);
      }
      expect(errores).toEqual([]);
    });

test('una dirección que no existe da la página 404', async ({ page }) => {
  const res = await page.goto('/no-existe-esta-pagina/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('main')).toBeVisible();
});

test('la comprobación de desbordes detecta uno puesto a propósito', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  expect((await desborde(page)).exceso).toBe(0);
  await page.evaluate(() => {
    const ancho = document.createElement('div');
    ancho.id = 'demasiado-ancho';
    ancho.style.width = '600px';
    ancho.style.height = '1px';
    document.querySelector('main')!.append(ancho);
  });
  const { exceso, culpable } = await desborde(page);
  expect(exceso).toBeGreaterThan(0);
  expect(culpable).toContain('demasiado-ancho');
});
