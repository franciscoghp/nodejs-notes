const { Router } = require('express');
const router = Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth') 

router.get( '/notes/add', isAuthenticated, ( req, res ) => {
    res.render('notes/add')
});

router.get( '/notes', isAuthenticated, async ( req, res ) => {
    const notes = await Note.find().lean().sort({date: 'desc'})
    res.render('notes/all-notes', { notes } )
});

router.get( '/notes/edit/:id', isAuthenticated, async ( req, res ) => {
    const { id } = req.params

    const note = await Note.findById(id).lean()
    res.render('notes/edit-note', { note } )
});

router.post( '/notes/add', isAuthenticated, async ( req, res ) => {
    const { title , description } = req.body
    let errors = []
    if(!title) errors.push({text: 'Please, write a Title!!'})
    if(!description) errors.push({text: 'Please, write a Description!!'})
    if (errors.length > 0) {
        res.render('notes/add', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ title , description });
        await newNote.save()
        req.flash('success_msg', 'Note created successfully!!')
        res.redirect('/notes') 
    }

});

router.put( '/notes/edit/:id', isAuthenticated , async ( req, res ) => {
    const { title , description } = req.body
    const { id } = req.params
    await Note.findByIdAndUpdate(id, { title , description })
    req.flash('success_msg', 'Note updated successfully!!')
    res.redirect('/notes') 
});

router.delete( '/notes/delete/:id', isAuthenticated,  async ( req, res ) => {
    const { id } = req.params
    await Note.findByIdAndRemove(id)
    req.flash('success_msg', 'Note removed successfully!!')
    res.redirect('/notes') 
});

module.exports = router