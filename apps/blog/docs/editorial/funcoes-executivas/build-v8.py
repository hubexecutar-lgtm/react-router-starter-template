"""Gera funcoes-executivas-v8.html a partir da v7 (revisão de acessibilidade + UX copy).

Uso: python3 build-v8.py  (lê funcoes-executivas-v7.html na mesma pasta)
Achados e decisões: REVISAO-A11Y-UXCOPY.md.
"""
import html
import re
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE / "funcoes-executivas-v7.html"
OUT = HERE / "funcoes-executivas-v8.html"

# Mesmo host do hub de rotas (apps/blog/app/data/routes.ts → DEFAULT_BASE_URL).
BASE = "https://react-router-starter-template.hub-executar.workers.dev"
STORE = {
    "workbook": ("Workbook", f"{BASE}/loja/workbooks/", "Ver workbooks"),
    "prompt": ("Prompt", f"{BASE}/loja/prompts/", "Ver prompts"),
    "html": ("Ferramenta HTML", f"{BASE}/loja/html/", "Ver ferramentas HTML"),
}

# Índice da visão (v7, data-open) → slug, nome, (workbook, prompt, ferramenta HTML).
# Cada frase retoma um dos três passos do próprio artigo.
FUNCS = {
    1: ("controle-inibitorio", "Controle inibitório", (
        "Registre seus três gatilhos e a pausa que vai usar com cada um.",
        "Peça à IA um plano para afastar cada gatilho do campo de visão.",
        "Conte, ao longo do ciclo, quantas pausas funcionaram.")),
    2: ("atencao-executiva", "Atenção executiva", (
        "Planeje o bloco com um alvo único, início e fim.",
        "Peça à IA para listar o que costuma competir com o seu alvo.",
        "Marque cada desvio do bloco e volte ao alvo.")),
    3: ("regulacao-emocional", "Regulação emocional", (
        "Nomeie a emoção, o gatilho e o menor passo para retomar.",
        "Peça à IA para transformar a crítica recebida em próximo passo.",
        "Programe a pausa curta e o lembrete de retomada.")),
    4: ("memoria-de-trabalho", "Memória de trabalho", (
        "Liste o que a tarefa pede para guardar e o que pede para manipular.",
        "Peça à IA para transformar instruções soltas em uma lista numerada.",
        "Mantenha a lista e o objetivo à vista enquanto trabalha.")),
    5: ("flexibilidade-cognitiva", "Flexibilidade cognitiva", (
        "Registre o que mudou e duas formas de atacar o problema.",
        "Peça à IA outras perspectivas sobre o pedido novo.",
        "Teste uma abordagem por um ciclo curto e decida se troca.")),
    6: ("resolucao-de-problemas", "Resolução de problemas", (
        "Escreva o obstáculo, o que já tentou e duas alternativas.",
        "Peça à IA alternativas diferentes das que você já tentou.",
        "Registre cada tentativa e o resultado, para não repetir o que falhou.")),
    7: ("autorregulacao", "Autorregulação", (
        "Defina limites diários de carga, com sono, pausa e movimento.",
        "Peça à IA para ajustar o ritmo da semana a partir do seu registro.",
        "Anote ao fim de cada dia se o ritmo subiu, caiu ou quebrou.")),
    8: ("manutencao-do-objetivo", "Manutenção do objetivo", (
        "Escreva a meta final, a etapa atual e os pontos de consulta.",
        "Peça à IA para resumir a meta em uma frase curta e visível.",
        "Deixe a meta na tela e registre cada desvio.")),
    9: ("iniciacao", "Iniciação", (
        "Escreva a meta, o menor primeiro passo e o seu plano “se… então…”.",
        "Peça à IA para transformar a meta em um plano “se… então…”, com hora e lugar.",
        "Anote, a cada dia do ciclo, se o começo aconteceu.")),
    10: ("planejamento", "Planejamento", (
        "Liste as etapas, estime cada uma por casos passados e some uma margem.",
        "Peça à IA o que costuma atrasar projetos parecidos com o seu.",
        "Compare o previsto com o realizado em cada etapa.")),
    11: ("priorizacao", "Priorização", (
        "Liste as tarefas do dia com prazo e retorno esperado.",
        "Peça à IA para ordenar a lista pelo retorno e apontar o que delegar.",
        "Proteja o bloco da primeira tarefa e revise a ordem ao fim.")),
    12: ("organizacao", "Organização", (
        "Defina um lugar para cada material e nomes padrão para os arquivos.",
        "Peça à IA uma convenção de nomes para os seus arquivos.",
        "Meça o tempo de busca antes e depois do ciclo.")),
    13: ("gestao-do-tempo", "Gestão do tempo", (
        "Distribua as partes na agenda e marque pontos de controle.",
        "Peça à IA para estimar quanto tempo cada parte exige.",
        "Confira o saldo de tempo até o prazo em cada ponto de controle.")),
    14: ("monitoramento", "Monitoramento", (
        "Defina a meta em números e o ritmo esperado por dia.",
        "Peça à IA para comparar o seu registro com o ritmo esperado.",
        "Registre o progresso nos horários de checagem.")),
    15: ("tomada-de-decisao", "Tomada de decisão", (
        "Escreva a decisão, as opções, três critérios e os riscos.",
        "Peça à IA para confrontar suas opções com os critérios.",
        "Registre o motivo da escolha e a data de revisão.")),
    16: ("metacognicao", "Metacognição", (
        "Preveja a nota e escreva a estratégia antes de estudar.",
        "Peça à IA um teste sem consulta sobre o que você estudou.",
        "Compare a nota prevista com o resultado e decida se troca de estratégia.")),
}
# Ordem de leitura = ordem da tabela "As 16 funções".
ORDER = [1, 4, 5, 2, 9, 10, 11, 12, 13, 14, 3, 15, 6, 8, 7, 16]

CSS_EXTRA = """
[hidden]{display:none!important}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:fixed;left:16px;top:-80px;z-index:20;background:var(--ink);color:#fff;padding:12px 16px;border-radius:8px;font-weight:600;text-decoration:none}.skip:focus{top:calc(8px + env(safe-area-inset-top,0px))}
html{scroll-padding-bottom:calc(var(--bar) + 16px)}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
a.mark,.links a,.bar a{text-decoration:none}
.links a{color:var(--ink)}.links a:hover{color:var(--brand);text-decoration:underline;text-underline-offset:4px}
.links a,.mark{min-height:44px;display:flex;align-items:center}
.nav:focus-within,.bar:focus-within{transform:none}
.bar{grid-template-columns:repeat(4,1fr)}
.bar a{color:var(--muted);font-size:12px;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.bar a:hover{color:var(--ink)}
a.btn{display:inline-flex;align-items:center;text-decoration:none}
.media .tag{font-size:clamp(1.8rem,4.5vw,2.9rem);line-height:1.05;letter-spacing:-.025em;font-weight:700;margin:12px 0 0}
.media small{color:var(--brand-hover)}
.meta .back{display:inline-flex;align-items:center;min-height:44px}
.article h1:focus,.target:focus{outline:none}
caption{text-align:left;font-weight:600;font-size:15px;padding:0 0 12px}
.scroll:focus-visible{outline:2px solid var(--brand);outline-offset:3px}
@media(max-width:620px){td:first-child{white-space:normal}}
.tools{list-style:none;padding:0;margin:0 0 1.5em;display:grid;gap:12px}
.article .tools li{background:var(--soft);border-radius:2px;padding:20px 24px;margin:0}
.tools small{display:block;font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--brand-hover)}
.article .tools p{margin:8px 0 12px;font-size:17px}
.tools a,.more{color:var(--brand);font-weight:600;text-underline-offset:4px;display:inline-flex;align-items:center;min-height:44px}
.next{border-top:1px solid var(--line);margin-top:2.5em;padding-top:1.5em}
.next small{display:block;font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.next a{font-size:clamp(1.2rem,2.4vw,1.5rem);font-weight:700;color:var(--ink);text-underline-offset:5px;display:inline-flex;align-items:center;min-height:44px}
.next a:hover{color:var(--brand)}
.store-band{padding:var(--section) var(--gutter);background:var(--soft)}
.store-band .grid-in>p{max-width:60ch;margin:0 auto 40px;text-align:center;font-size:clamp(1.05rem,1.6vw,1.2rem);line-height:1.5;color:#4B5563}
.store-cards{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.store-cards li{background:var(--paper);border-radius:2px;padding:24px}
.store-cards small{font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--brand-hover)}
.store-cards h3{font-size:20px;line-height:1.2;margin:12px 0 8px;letter-spacing:-.02em}.store-cards p{font-size:15px;line-height:1.5;color:#4B5563;margin:0 0 8px}
.store-band .btns{margin-top:40px}
@media(max-width:899px){.store-cards{grid-template-columns:1fr}}
footer nav ul{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-wrap:wrap;gap:4px 24px}
footer a{color:var(--ink);text-underline-offset:4px;display:inline-flex;align-items:center;min-height:44px}
"""

SCRIPT = """<script>
(function(){
  var views=[].slice.call(document.querySelectorAll('.view')),home=views[0],base=document.title,current=home;
  function focusEl(el){if(!el)return;if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}
  function route(fromUser){
    var id=decodeURIComponent(location.hash.slice(1)),t=id?document.getElementById(id):null;
    var view=t?(t.classList.contains('view')?t:t.closest('.view')):home;
    if(t&&!view)return; // alvo fora das visões (ex.: #conteudo): deixa o navegador agir
    if(!view)view=home;
    views.forEach(function(v){v.hidden=v!==view;});
    current=view;
    if(view===home){
      document.title=base;
      if(t&&t!==home){t.scrollIntoView({behavior:fromUser?'auto':'instant'});if(fromUser)focusEl(t.querySelector('h2')||t);}
      else if(fromUser){window.scrollTo(0,0);focusEl(home.querySelector('h1'));}
    }else{
      var h=view.querySelector('h1');
      document.title=h.textContent+' — Risco Cognitivo';
      window.scrollTo(0,0);
      if(fromUser)focusEl(h);
    }
  }
  window.addEventListener('hashchange',function(){route(true);});
  route(false);
  var nav=document.querySelector('.nav'),bar=document.querySelector('.bar'),last=window.scrollY,tick=false;
  window.addEventListener('scroll',function(){
    if(tick)return;tick=true;
    requestAnimationFrame(function(){
      var y=window.scrollY,down=y>last&&y>80;
      nav.classList.toggle('hide',down);bar.classList.toggle('hide',down);
      last=y;tick=false;
    });
  },{passive:true});
})();
</script>"""


def tools_section(name: str, jobs: tuple) -> str:
    items = []
    for key, job in zip(("workbook", "prompt", "html"), jobs):
        label, href, cta = STORE[key]
        items.append(
            f'<li><small>{label}</small><p>{job}</p>'
            f'<a href="{href}">{cta}<span class="sr-only"> para {name.lower()} na Loja</span>&nbsp;›</a></li>'
        )
    return (
        '<h2>Ferramentas para aplicar</h2>'
        '<p>Leve os três passos para o seu dia com uma ferramenta da Loja:</p>'
        f'<ul class="tools">{"".join(items)}</ul>'
    )


def next_nav(idx: int) -> str:
    pos = ORDER.index(idx)
    if pos + 1 < len(ORDER):
        slug, name, _ = FUNCS[ORDER[pos + 1]]
        return (f'<nav class="next" aria-label="Próxima leitura"><small>Próxima função</small>'
                f'<a href="#{slug}">{name}&nbsp;›</a></nav>')
    return ('<nav class="next" aria-label="Próxima leitura"><small>Fim do guia</small>'
            f'<a href="{BASE}/loja/">Ver todas as ferramentas na Loja&nbsp;›</a></nav>')


def source_links(block: str) -> str:
    """'Abrir' → 'Ler a fonte' com o título da fonte para leitor de tela (WCAG 2.4.4)."""
    def li(m):
        text, href = m.group(1), m.group(2)
        title = text.split(" — ")[0].strip()
        return (f'<li>{text}<a href="{href}">Ler a fonte'
                f'<span class="sr-only">: {title} (site externo, em inglês)</span></a></li>')
    return re.sub(r'<li>([^<]*?)<a href="([^"]+)">Abrir</a></li>', li, block)


def main() -> None:
    s = SRC.read_text(encoding="utf-8")

    # --- CSS: remove a visão "fora da tela" (continuava no foco e na árvore de acessibilidade).
    s = s.replace(".view:not(.on){position:absolute;left:-99999px;top:0;width:100%;height:0;overflow:hidden}", "")
    s = s.replace("</style>", CSS_EXTRA + "</style>", 1)

    # --- Cabeçalho: links reais, landmark rotulado, skip link.
    s = s.replace("<body>\n<nav class=\"nav\">",
                  '<body>\n<a class="skip" href="#conteudo">Pular para o conteúdo</a>\n'
                  '<nav class="nav" aria-label="Principal">', 1)
    s = s.replace('<button class="mark" data-go=".hero"><i>RC</i>Risco Cognitivo</button>',
                  '<a class="mark" href="#inicio"><i aria-hidden="true">RC</i>Risco Cognitivo</a>')
    s = s.replace("""      <button data-go=".article">Artigo</button>
      <button data-go=".grid-wrap">Camadas</button>
      <button data-go=".fn">Funções</button>""",
                  f"""      <a href="#reportagem">Reportagem</a>
      <a href="#camadas">Camadas</a>
      <a href="#funcoes">Funções</a>
      <a href="{BASE}/loja/">Loja</a>""")

    # --- Visão inicial.
    s = s.replace('<main><div class="view on">', '<main id="conteudo" tabindex="-1"><div class="view" id="inicio">', 1)
    s = s.replace("<p>Guia em 16 reportagens sobre os processos mentais que dirigem a ação, do freio de impulsos à metacognição.</p>",
                  "<p>Guia em 16 reportagens sobre os processos mentais que dirigem a ação, do freio de impulsos à metacognição. Cada uma termina com ferramentas para aplicar o que você leu.</p>")
    s = s.replace("""      <button class="btn p" data-go=".article">Ler a reportagem</button>
      <button class="btn o" data-go=".fn">Ver as 16 funções</button>""",
                  """      <a class="btn p" href="#reportagem">Ler a reportagem</a>
      <a class="btn o" href="#funcoes">Ver as 16 funções</a>""")
    # Frase de efeito não é título de seção: sai da hierarquia de headings.
    s = s.replace('<section class="media-wrap">', '<section class="media-wrap" aria-label="Cadeia da execução">')
    s = s.replace("<small>Objetivo → Prioridade → Plano → Ação → Ajuste → Conclusão</small><h2>Clareza primeiro. Estrutura para executar.</h2>",
                  "<small>Objetivo → Prioridade → Plano → Ação → Ajuste → Conclusão</small><p class=\"tag\">Clareza primeiro. Estrutura para executar.</p>")
    s = s.replace('<section class="shell article-shell">', '<section class="shell article-shell" id="reportagem" aria-label="Reportagem">')
    s = s.replace("e agrupe as dimensões em quatro camadas — controle, memória e representação, direção, execução e adaptação — e escolha uma para ajustar.",
                  "e agrupe as dimensões em quatro camadas (controle; memória e representação; direção; execução e adaptação) e escolha uma para ajustar.")
    s = s.replace("O ganho é observável, não garantido.</p>\n<h2>Ressalvas</h2>\n<div class=\"cell m\"><p>As 12 dimensões",
                  "O ganho é observável, não garantido.</p>\n"
                  "<p><a class=\"more\" href=\"#funcoes\">Escolha a função por onde começar&nbsp;›</a></p>\n"
                  "<h2>Ressalvas</h2>\n<div class=\"cell m\"><p>As 12 dimensões", 1)
    s = s.replace('<section class="grid-wrap">', '<section class="grid-wrap" id="camadas">')
    s = s.replace("<h2>Quatro camadas</h2><span></span>", '<h2>Quatro camadas</h2><span aria-hidden="true"></span>')
    s = s.replace('<section class="shell fn">', '<section class="shell fn" id="funcoes">')
    s = s.replace('<article class="article" style="max-width:var(--wide)">', '<div class="article" style="max-width:var(--wide)">')
    s = s.replace("""      <p><strong>Artigos prontos (16 de 16):</strong> clique no nome de cada função para abrir o artigo.</p>
      <p>A cadeia operacional de 12 dimensões: Inibir""",
                  """      <p>Escolha uma função para ler a reportagem. Cada uma termina com três passos e ferramentas da Loja para aplicá-los.</p>
      <p>O guia cobre 16 funções. A cadeia operacional do EXECUTAR as resume em 12 dimensões: Inibir""")
    s = s.replace('<div class="scroll"><table>\n        <tr><th>Função</th><th>O que faz</th><th>Exemplo</th></tr>',
                  '<div class="scroll" role="region" aria-labelledby="cap-funcoes" tabindex="0"><table>\n'
                  '        <caption id="cap-funcoes">As 16 funções executivas, o que cada uma faz e um exemplo</caption>\n'
                  '        <thead><tr><th scope="col">Função</th><th scope="col">O que faz</th><th scope="col">Exemplo</th></tr></thead><tbody>')
    s = s.replace("      </table></div>\n    </article>\n  </section>",
                  "      </tbody></table></div>\n    </div>\n  </section>\n" + store_band(), 1)
    for idx, (slug, name, _) in FUNCS.items():
        s = s.replace(f'<button class="lnk" data-open="{idx}">{name}</button>', f'<a href="#{slug}">{name}</a>')

    # --- Artigos.
    parts = s.split('<div class="view"><section class="shell"><div class="meta"><button class="back" data-home>← Todas as funções</button>')
    head, views = parts[0], parts[1:]
    out = [head]
    for idx, v in enumerate(views, 1):
        slug, name, jobs = FUNCS[idx]
        v = v.replace("<h1>", '<h1 tabindex="-1">', 1)
        v = v.replace("Os estudos não trazem uma receita única. Uma forma de traduzir os achados em prática, a partir deste material, é seguir três passos:",
                      "Os estudos não trazem receita única. Uma forma de levar os achados à prática são estes três passos:")
        v = v.replace("<h2>Ressalvas</h2>", tools_section(name, jobs) + "\n<h2>Ressalvas</h2>", 1)
        v = source_links(v)
        v = v.replace("</article></section></div>", next_nav(idx) + "\n</article></section></div>", 1)
        out.append(f'<div class="view" id="{slug}"><section class="shell"><div class="meta">'
                   f'<a class="back" href="#funcoes">← Todas as funções</a>' + v)
    s = "".join(out)
    s = source_links(s)  # fontes da reportagem principal

    # --- Rodapé-diretório e barra inferior.
    s = s.replace("<footer><p>Risco Cognitivo · Conhecimento que vira estrutura.</p></footer>",
                  f"""<footer><p>Risco Cognitivo · Conhecimento que vira estrutura.</p>
<nav aria-label="Rodapé" style="max-width:var(--wide);margin:auto"><ul>
  <li><a href="#funcoes">As 16 funções</a></li>
  <li><a href="{BASE}/loja/">Loja de ferramentas</a></li>
  <li><a href="{BASE}/temas/">Temas</a></li>
  <li><a href="{BASE}/">Blog Risco Cognitivo</a></li>
</ul></nav></footer>""")
    s = re.sub(r'<nav class="bar">.*?</nav>',
               f"""<nav class="bar" aria-label="Atalhos">
  <a href="#inicio"><b aria-hidden="true">⌂</b>Início</a>
  <a href="#camadas"><b aria-hidden="true">◆</b>Camadas</a>
  <a href="#funcoes"><b aria-hidden="true">▤</b>Funções</a>
  <a href="{BASE}/loja/"><b aria-hidden="true">◇</b>Loja</a>
</nav>""", s, count=1, flags=re.S)
    s = re.sub(r"<script>.*?</script>", lambda _: SCRIPT, s, count=1, flags=re.S)

    leftovers = [x for x in ("data-go", "data-open", "data-home", "Abrir</a>", "<button") if x in s]
    assert not leftovers, f"sobras da v7: {leftovers}"
    OUT.write_text(s, encoding="utf-8")
    print(f"ok: {OUT.name} ({len(s)} bytes)")


def store_band() -> str:
    cards = [
        ("Workbooks", "Para registrar", "Cadernos para registrar os três passos por um ciclo e comparar antes e depois.", "workbook"),
        ("Prompts", "Para conduzir com IA", "Instruções prontas para preparar cada passo com ajuda da IA.", "prompt"),
        ("Ferramentas HTML", "Para acompanhar", "Ferramentas interativas que rodam no navegador, sem instalar nada.", "html"),
    ]
    lis = "".join(
        f'<li><small>{kicker}</small><h3>{title}</h3><p>{text}</p>'
        f'<a class="more" href="{STORE[key][1]}">{STORE[key][2]}&nbsp;›</a></li>'
        for title, kicker, text, key in cards
    )
    return f"""
  <section class="store-band" id="loja" aria-labelledby="loja-titulo">
    <div class="grid-in">
      <h2 id="loja-titulo">Da leitura à prática</h2><span aria-hidden="true"></span>
      <p>Cada reportagem termina com três passos. Na Loja, você encontra ferramentas para aplicá-los no seu dia.</p>
      <ul class="store-cards">{lis}</ul>
      <div class="btns"><a class="btn p" href="{BASE}/loja/">Visitar a Loja</a></div>
    </div>
  </section>"""


if __name__ == "__main__":
    main()
