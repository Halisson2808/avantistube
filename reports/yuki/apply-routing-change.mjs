import fs from 'node:fs';
import path from 'node:path';
const root='C:/Users/Usuário/Downloads/Workspace Produtos/Ofertas/avo-yuki/Site';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const quiz=read('site/index.html');
if(!quiz.includes("track('quiz_started'"))throw new Error('Root is no longer the expected quiz; review before applying.');
const redirect=read('site/pages/acesso/index.html');
if(!redirect.includes('https://pay.cakto.com.br/q77dais_1083732'))throw new Error('Unexpected checkout');
const movedQuiz=quiz.replace('https://yukinakamura.vercel.app/"','https://yukinakamura.vercel.app/quiz/"').replace('  <meta name="theme-color"', '  <link rel="canonical" href="https://yukinakamura.vercel.app/quiz/">\n  <meta name="theme-color"');
const home=redirect.replaceAll('https://yukinakamura.vercel.app/acesso/','https://yukinakamura.vercel.app/').replace("rota: '/acesso'","rota: '/'");
const readme=read('README.md').replace('| site/index.html | Página inicial do site (/) |','| site/index.html | Entrada direta para o checkout da Cakto (/) |').replace('Os nomes das pastas de campanha refletem as URLs existentes. A organização do código mudou sem alterar essas URLs.','A rota / encaminha diretamente para o checkout do Caderno da Avó Yuki, preservando os parâmetros de origem e o registro de redirecionamento no Studio. Não exibe quiz nem página de vendas.\n\nA avaliação fica em /quiz/. As páginas de vendas continuam em /oferta/ e /page2/, a VSL em /vsl/ e a oferta de sono em /sono/. As rotas /acesso/ e /go/ continuam disponíveis para encaminhar ao checkout. O aplicativo permanece em /app/.');
for(const [p,content] of [['site/pages/quiz/index.html',movedQuiz],['site/index.html',home],['README.md',readme]]){fs.writeFileSync(path.join(root,p),content);console.log('Updated '+p);}
