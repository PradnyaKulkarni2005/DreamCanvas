import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Props = {
  targetId: string;
};

export default function DownloadPDFButton({ targetId }: Props) {
  const handleDownload = async () => {
    const source = document.getElementById(targetId);
    if (!source) {
      alert('Target element not found');
      return;
    }

    // Clone the target to avoid messing with real DOM
    const cloned = source.cloneNode(true) as HTMLElement;

    // Remove animation and transitions to get a clean snapshot
    cloned.querySelectorAll('*').forEach((el) => {
      (el as HTMLElement).style.animation = 'none';
      (el as HTMLElement).style.transition = 'none';
    });

    // Apply high contrast and fixed layout to ensure visibility
    cloned.style.backgroundColor = '#0d1117';
    cloned.style.color = '#ffffff';
    cloned.style.padding = '20px';
    cloned.style.width = '800px'; // fix width for PDF
    cloned.style.maxWidth = 'none';
    cloned.style.overflow = 'visible';

    // Position offscreen so it's not visible
    cloned.style.position = 'fixed';
    cloned.style.top = '-10000px';
    document.body.appendChild(cloned);

    // Wait a short time to let DOM render completely
    await new Promise((res) => setTimeout(res, 200));

    // Render canvas from the cloned element
    const canvas = await html2canvas(cloned, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0d1117',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
      position += pageHeight;
      if (position < imgHeight) pdf.addPage();
    }

    pdf.save('roadmap.pdf');

    document.body.removeChild(cloned);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
    >
      Download as PDF
    </button>
  );
}
