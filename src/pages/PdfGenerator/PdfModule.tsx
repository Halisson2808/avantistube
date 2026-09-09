/**
 * PdfModule.tsx — módulo Gerador de PDF, montado em /pdf/*.
 *
 * Fica isolado num componente próprio para o App carregá-lo sob demanda (lazy):
 * são ~30 páginas de ebook, pesadas demais para entrar no bundle do painel.
 */
import { Routes, Route, Navigate } from 'react-router-dom';

import PdfLayout from './PdfLayout';
import EbookUm from './EbookUm';
import EbookDois from './EbookDois';
import EbookTres from './EbookTres';
import EbookQuatro from './EbookQuatro';
import EbookCinco from './EbookCinco';
import EbookSeis from './EbookSeis';
import EbookSete from './EbookSete';
import EbookOito from './EbookOito';
import EbookNove from './EbookNove';
import EbookDez from './EbookDez';
import EbookOnze from './EbookOnze';
import EbookDoze from './EbookDoze';
import EbookTreze from './EbookTreze';
import EbookQuatorze from './EbookQuatorze';
import EbookQuince from './EbookQuince';
import EbookDezesseis from './EbookDezesseis';
import EbookDezessete from './EbookDezessete';
import EbookDezoito from './EbookDezoito';
import EbookPeleCoreana from './EbookPeleCoreana';
import EbookCaderno from './EbookCaderno';
import EbookMenopausa from './EbookMenopausa';
import EbookBarriga from './EbookBarriga';
import EbookPontos from './EbookPontos';
import EbookDormirSemCha from './EbookDormirSemCha';
import EbookSono from './EbookSono';
import EbookSonoBanho from './EbookSonoBanho';
import EbookSonoTurno from './EbookSonoTurno';
import EbookSonoErvas from './EbookSonoErvas';
import EbookSonoQuarto from './EbookSonoQuarto';
import Descricoes from './Descricoes';

export default function PdfModule() {
  return (
    <Routes>
      <Route element={<PdfLayout />}>
        <Route index element={<Navigate to="caderno" replace />} />
        <Route path="ebook-um" element={<EbookUm />} />
        <Route path="ebook-dois" element={<EbookDois />} />
        <Route path="ebook-tres" element={<EbookTres />} />
        <Route path="ebook-quatro" element={<EbookQuatro />} />
        <Route path="ebook-cinco" element={<EbookCinco />} />
        <Route path="ebook-seis" element={<EbookSeis />} />
        <Route path="ebook-sete" element={<EbookSete />} />
        <Route path="ebook-oito" element={<EbookOito />} />
        <Route path="ebook-nove" element={<EbookNove />} />
        <Route path="ebook-dez" element={<EbookDez />} />
        <Route path="ebook-onze" element={<EbookOnze />} />
        <Route path="ebook-doze" element={<EbookDoze />} />
        <Route path="ebook-treze" element={<EbookTreze />} />
        <Route path="ebook-quatorze" element={<EbookQuatorze />} />
        <Route path="ebook-quince" element={<EbookQuince />} />
        <Route path="ebook-dezesseis" element={<EbookDezesseis />} />
        <Route path="ebook-dezessete" element={<EbookDezessete />} />
        <Route path="ebook-dezoito" element={<EbookDezoito />} />
        <Route path="pele-coreana" element={<EbookPeleCoreana />} />
        <Route path="caderno" element={<EbookCaderno />} />
        <Route path="menopausa" element={<EbookMenopausa />} />
        <Route path="barriga" element={<EbookBarriga />} />
        <Route path="pontos" element={<EbookPontos />} />
        <Route path="dormir-sem-cha" element={<EbookDormirSemCha />} />
        <Route path="ebook-sono" element={<EbookSono />} />
        <Route path="sono-banho" element={<EbookSonoBanho />} />
        <Route path="sono-turno" element={<EbookSonoTurno />} />
        <Route path="sono-ervas" element={<EbookSonoErvas />} />
        <Route path="sono-quarto" element={<EbookSonoQuarto />} />
        <Route path="descricoes" element={<Descricoes />} />
        <Route path="*" element={<Navigate to="caderno" replace />} />
      </Route>
    </Routes>
  );
}
