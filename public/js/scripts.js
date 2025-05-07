const generatePDF = (elem) => {
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        console.error('html2canvas or jsPDF is not loaded');
        return;
    }
    
    if((typeof elem !== HTMLElement) && !(typeof elem == 'string' && document.getElementById(elem))) {
        console.error('Invalid element passed to generatePDF');
        return;
    }
    const container = document.getElementById(elem);

    html2canvas(container, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        const pdfBlobUrl = pdf.output('bloburl');

        window.open(pdfBlobUrl, '_blank');
    });
}