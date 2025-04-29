const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Subject = require('../models/Subject');


const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/users/login');
}

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.render('subjects/index', { subjects });
  } catch (err) {
    req.flash('error_msg', 'Error fetching subjects');
    res.redirect('/');
  }
});

// New subject form
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('subjects/new');
});


router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { subjectName, price, units } = req.body;
    const subject = new Subject({
      subjectName,
      price,
      units,
      image: `/uploads/${req.file.filename}`
    });
    await subject.save();
    req.flash('success_msg', 'Subject added successfully');
    res.redirect('/subjects');
  } catch (err) {
    req.flash('error_msg', 'Error creating subject');
    res.redirect('/subjects/new');
  }
});

// Show subject
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    res.render('subjects/show', { subject });
  } catch (err) {
    req.flash('error_msg', 'Subject not found');
    res.redirect('/subjects');
  }
});

// Edit subject form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    res.render('subjects/edit', { subject });
  } catch (err) {
    req.flash('error_msg', 'Subject not found');
    res.redirect('/subjects');
  }
});

// Update subject
router.post('/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { price, units } = req.body;
    const updateData = { price, units };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    await Subject.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success_msg', 'Subject updated successfully');
    res.redirect('/subjects');
  } catch (err) {
    req.flash('error_msg', 'Error updating subject');
    res.redirect(`/subjects/${req.params.id}/edit`);
  }
});

// Delete subject
router.get('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Subject deleted successfully');
    res.redirect('/subjects');
  } catch (err) {
    req.flash('error_msg', 'Error deleting subject');
    res.redirect('/subjects');
  }
});

module.exports = router; 