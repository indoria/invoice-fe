const renderPDF = async (elem) => {
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
        
        return pdf;
    });
}

async function generateExactPdf(containerId) {
    const input = document.getElementById(containerId);

    // Calculate PDF page dimensions in mm
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const margin = 10; // 10mm margin on all sides
    const availablePdfWidth = pdfWidth - (2 * margin); // 190 mm
    const availablePdfHeight = pdfHeight - (2 * margin); // 277 mm

    const htmlContentWidthInPixels = input.offsetWidth; // Get the actual rendered width of your HTML container in pixels

    const targetDPI = 300;
    const targetHtmlPixelWidthForPrint = (availablePdfWidth / 25.4) * targetDPI; // Convert mm to inches, then inches to pixels at target DPI

    const scaleFactor = targetHtmlPixelWidthForPrint / htmlContentWidthInPixels;
    // const scaleFactor = 2; // Simpler to start with a fixed scale for quality.

    const canvas = await html2canvas(input, {
        scale: scaleFactor,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        removeContainer: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');

    const imgWidth = availablePdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = margin;

    // If the entire content fits on one page
    if (imgHeight < availablePdfHeight) {
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        heightLeft -= availablePdfHeight;

        while (heightLeft > 0) {
            position = -(availablePdfHeight * (pdf.internal.pages.length -1)) + yPosition;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= availablePdfHeight;
        }
    }

    return pdf;
}

// How to use it:
// Assuming you have an HTML div with id="myHtmlContainer"
// <div id="myHtmlContainer" style="width: 794px;">...</div>
// Call: generateExactPdf('myHtmlContainer');

async function generatePdfWithCorrectPageBreaks(containerId) {
    const input = document.getElementById(containerId);

    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const availablePdfWidth = pdfWidth - (2 * margin);
    const contentHeightPerPage = pdfHeight - (2 * margin);

    const initialHtmlWidth = input.offsetWidth;
    const calculatedScale = 2;

    const canvas = await html2canvas(input, {
        scale: calculatedScale,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        removeContainer: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = availablePdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightRemaining = imgHeight;
    let currentPageIndex = 0;

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    heightRemaining -= contentHeightPerPage;
    currentPageIndex++;

    while (heightRemaining > 0) {
        pdf.addPage();

        const contentAlreadyDisplayed = currentPageIndex * contentHeightPerPage;
        const yOffsetOnPdfPage = -contentAlreadyDisplayed + margin;

        pdf.addImage(imgData, 'PNG', margin, yOffsetOnPdfPage, imgWidth, imgHeight);

        heightRemaining -= contentHeightPerPage;
        currentPageIndex++;
    }

    return pdf;
}


async function generatePDF(elem = "invoicePreview", output = "preview") {
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        console.error('html2canvas or jsPDF is not loaded');
        return;
    }
    
    if((typeof elem !== HTMLElement) && !(typeof elem == 'string' && document.getElementById(elem))) {
        console.error('Invalid element passed to generatePDF');
        return;
    }

    if(!output in ["preview", "download"]) {
        output = "preview";
    }

    //const pdf = await generatePdfWithCorrectPageBreaks(elem);
    const pdf = await generateExactPdf(elem);

    let invoiceName = document.getElementById("invoiceNumberPreview").textContent;
    if (!invoiceName || !invoiceName.trim()) {
        const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit"
        }).replace(/\//g, "-");
    
        invoiceName = `invoice-${formattedDate}`;
    }
    
    if(output === "preview") {
        const pdfBlobUrl = pdf.output('bloburl');
        window.open(pdfBlobUrl, '_blank');
    } else {
        pdf.save(`${invoiceName}.pdf`);
    }
}