import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

interface ExportOptions {
    content: string;
    filename: string;
    title?: string;
}

export async function exportToDocx({ content, filename, title }: ExportOptions) {
    try {
        const paragraphs = content.split('\n').filter(line => line.trim());
        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs.map(para => {
                    if (para.startsWith('##')) {
                        return new Paragraph({ text: para.replace(/^##\s*/, ''), heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } });
                    } else if (para.toUpperCase() === para && para.length < 100) {
                        return new Paragraph({ children: [new TextRun({ text: para, bold: true, size: 24 })], spacing: { before: 300, after: 200 } });
                    } else {
                        return new Paragraph({ text: para, spacing: { after: 120 }, style: 'Normal' });
                    }
                })
            }]
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
        return { success: true };
    } catch (error) {
        console.error('Erro ao exportar DOCX:', error);
        throw error;
    }
}
