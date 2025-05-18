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

async function generatePdfWithCorrectPageBreaksa(containerId) {
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
        console.log(heightRemaining)
        pdf.addPage();

        const contentAlreadyDisplayed = currentPageIndex * contentHeightPerPage;
        const yOffsetOnPdfPage = -contentAlreadyDisplayed + margin;

        pdf.addImage(imgData, 'PNG', margin, yOffsetOnPdfPage, imgWidth, imgHeight);

        heightRemaining -= contentHeightPerPage;
        currentPageIndex++;
    }

    return pdf;
}

async function generatePdfWithCorrectPageBreaks(containerId) {
    const input = document.getElementById(containerId);

    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 10; // Margin for all sides
    const availablePdfWidth = pdfWidth - (2 * margin);
    const availablePdfHeight = pdfHeight - (2 * margin);

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
    let currentYPosition = margin; // Ensuring a proper top margin

    pdf.addImage(imgData, 'PNG', margin, currentYPosition, imgWidth, imgHeight);

    heightRemaining -= availablePdfHeight;
    currentYPosition += availablePdfHeight;

    while (heightRemaining > 0) {
        pdf.addPage();

        const contentAlreadyDisplayed = imgHeight - heightRemaining;
        const yOffsetOnPdfPage = margin - contentAlreadyDisplayed; // Ensuring correct positioning

        pdf.addImage(imgData, 'PNG', margin, yOffsetOnPdfPage, imgWidth, imgHeight);

        heightRemaining -= availablePdfHeight;
        currentYPosition += availablePdfHeight;
    }

    return pdf;
}


function pdfDW() {
    var doc = new jspdf.jsPDF("p", "pt", "letter");
    var source = document.querySelector("#invoicePreview");
    var margins = {
        top: 40,
        bottom: 60,
        left: 40,
        width: 522
    };

    doc.html(source, {
        x: margins.left,
        y: margins.top,
        html2canvas: { scale: 2 },
        width: margins.width,
        callback: function (doc) {
            doc.save("Test.pdf");
        }
    });
}
async function pdfDW1() {
    const doc = new jspdf.jsPDF("p", "pt", "letter");
    const source = document.querySelector("#invoicePreview"); // The HTML element to convert

    // Use html2canvas to capture the element
    const canvas = await html2canvas(source, {
        scale: 2,  // Higher resolution
        useCORS: true, // Ensure external styles/images load properly
        logging: false
    });

    // Convert the canvas to an image
    const imgData = canvas.toDataURL("image/png");

    // Calculate the image dimensions
    const imgWidth = doc.internal.pageSize.getWidth() - 40; // Adjusting for margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    // Add the image to the PDF
    doc.addImage(imgData, "PNG", 20, 40, imgWidth, imgHeight);

    // Save the PDF
    doc.save("Test.pdf");
}

async function pdfDW2() {
    const doc = new jspdf.jsPDF("p", "px", "letter");
    const source = document.querySelector("#invoicePreview");

    // Capture HTML as canvas
    const canvas = await html2canvas(source, {
        scale: 4,
        useCORS: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Use actual canvas dimensions for scaling
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scaleFactor = (pageWidth - 2 * margin) / imgWidth; // Maintain aspect ratio
    const scaledHeight = imgHeight * scaleFactor;

    let yOffset = margin;
    let heightRemaining = scaledHeight;
    let sliceStart = 0;

    while (heightRemaining > 0) {
        let sliceHeight = Math.min(heightRemaining, pageHeight - 2 * margin);
        
        // Extract only the portion needed for the current page
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = sliceHeight / scaleFactor; // Convert scaled height back to original scale
        const ctx = croppedCanvas.getContext("2d");

        ctx.drawImage(canvas, 0, sliceStart, canvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height);

        const croppedImgData = croppedCanvas.toDataURL("image/png");

        doc.addImage(croppedImgData, "PNG", margin, yOffset, pageWidth - 2 * margin, sliceHeight);

        heightRemaining -= sliceHeight;
        sliceStart += croppedCanvas.height;

        if (heightRemaining > 0) {
            doc.addPage();
            yOffset = margin; // Reset position for next page
        }
    }

    return doc;
}

async function pdfDW3() {
    const doc = new jspdf.jsPDF("p", "mm", "a4");
    const source = document.querySelector("#invoicePreview");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    const canvas = await html2canvas(source, {
        scale: 4,
        useCORS: true,
        ignoreElements: (element) => {
            return element.classList.contains("no-print");
        }
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleFactor = (pageWidth - 2 * margin) / imgWidth;
    const scaledHeight = imgHeight * scaleFactor;

    // Find page break positions in pixels relative to the canvas
    const pageBreaks = Array.from(source.querySelectorAll(".page-break")).map(el => {
        const rect = el.getBoundingClientRect();
        const containerRect = source.getBoundingClientRect();
        const offsetY = (rect.top - containerRect.top) * 4; // scale = 4
        return offsetY;
    });

    // Add the end of document as a final break point
    pageBreaks.push(imgHeight);

    let previousBreak = 0;

    for (let i = 0; i < pageBreaks.length; i++) {
        const breakY = pageBreaks[i];
        const sliceHeight = breakY - previousBreak;

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = sliceHeight;

        const ctx = croppedCanvas.getContext("2d");
        ctx.drawImage(
            canvas,
            0, previousBreak,
            canvas.width, sliceHeight,
            0, 0,
            canvas.width, sliceHeight
        );

        const croppedImgData = croppedCanvas.toDataURL("image/png");
        const scaledSliceHeight = sliceHeight * scaleFactor;

        doc.addImage(croppedImgData, "PNG", margin, margin, pageWidth - 2 * margin, scaledSliceHeight);

        if (i < pageBreaks.length - 1) {
            doc.addPage();
        }

        previousBreak = breakY;
    }

    return doc;
}

async function pdfDW4() {
    const doc = new jspdf.jsPDF("p", "px", "letter");
    const source = document.querySelector("#invoicePreview");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    const scale = 4;
    const canvas = await html2canvas(source, {
        scale,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains("no-print")
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleFactor = (pageWidth - 2 * margin) / imgWidth;

    // --- Manual page breaks from .page-break ---
    const manualBreaks = Array.from(source.querySelectorAll(".page-break")).map(el => {
        const rect = el.getBoundingClientRect();
        const parentRect = source.getBoundingClientRect();
        return (rect.top - parentRect.top) * scale;
    });

    // --- Automatic page breaks every N pixels (based on scaled height) ---
    const scaledPageHeight = (pageHeight - 2 * margin) / scaleFactor;
    const automaticBreaks = [];
    for (let y = scaledPageHeight; y < imgHeight; y += scaledPageHeight) {
        automaticBreaks.push(Math.floor(y));
    }

    // --- Combine and deduplicate breakpoints ---
    const allBreaks = Array.from(new Set([...manualBreaks, ...automaticBreaks])).sort((a, b) => a - b);
    allBreaks.push(imgHeight); // Final bottom boundary

    let previousY = 0;

    for (let i = 0; i < allBreaks.length; i++) {
        const breakY = allBreaks[i];
        const sliceHeight = breakY - previousY;

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = sliceHeight;

        const ctx = croppedCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, previousY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const imgData = croppedCanvas.toDataURL("image/png");
        const scaledHeight = sliceHeight * scaleFactor;

        doc.addImage(imgData, "PNG", margin, margin, pageWidth - 2 * margin, scaledHeight);

        if (i < allBreaks.length - 1) doc.addPage();

        previousY = breakY;
    }

    return doc;
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
    //const pdf = await generateExactPdf(elem);
    const pdf = await pdfDW4();

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