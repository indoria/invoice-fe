import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('pages/home', { title: 'Bizkit : Tools for Businesses' });
});

router.get('/plan-and-milestones', (req, res) => {
    res.render('pages/plan-and-milestones', { title: 'Express' });
});

router.get('/pricing', (req, res) => {
    res.render('pages/pricing', { title: 'Pricing' });
});

router.get('/contact-us', (req, res) => {
    res.render('pages/contact-us', { title: 'Contact Us' });
});

router.get('/invoices', (req, res) => {
    res.render('invoice/index', { title: 'Express' });
});

router.get('/layout', (req, res) => {
    res.render('layout', { title: 'Express' });
});

router.get('/pdf-1', (req, res) => {
    res.render('js-pdf-1', { title: 'jsPDF' });
});

router.get('/pdf-2', (req, res) => {
    res.render('js-pdf-2', { title: 'jsPDF + html2canvas' });
});

router.get('/pdf-3', (req, res) => {
    res.render('js-pdf-3', { title: 'jsPDF + html2canvas' });
});

export default router;
