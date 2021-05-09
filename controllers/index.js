const {Item, Section} = require('../models');
const router = require('express').Router();

//api routes
const apiRoutes = require('./api');
router.use('/api', apiRoutes);

// authorization routes
const auth = require("./auth");
router.use(auth);

// render page routes
// Renders login/signup page
router.get('/', function (req, res) {

    // if req.session.user does not exist, logged_in is falsy
    res.render('homepage', {logged_in: req.session.user});
});

// Renders all items of the user's selected section
router.get('/section/:id', async (req,res) => {

    // redirect to homepage if user not logged in
    if(!req.session.user) {
        res.redirect("/");
    } else {

        // get all sections associated with user
        const sectionData = await Section.findAll({
            where: {
                user_id: req.session.user.id  // production
            },
            include: [{ model: Item }],
        });

        // map out simplified array of all sections and associated items 
        const sections = sectionData.map(items => items.get({plain:true}));

        // get section according to url params
        const requestedSection = sections.find(section => section.id == req.params.id);

        // save all section names and id#s in an array
        const sectionInfo = sections.map(function (section) {
            return {
                    name: section.name,
                      id: section.id
                    }
        });
        res.render("section", {requestedSection, sectionInfo, logged_in: req.session.user.id});
    };   
});

router.get('/kitchen2', async (req,res) => {
    if(!req.session.user) {
        res.redirect("/");
    } else {
        const sectionData = await Section.findAll({
            where: {
                user_id: req.session.user.id  // production
            },
            include: [{ model: Item }],
        });
        const items = sectionData.map(items => items.get({plain:true}));
        res.render('kitchen2', {items: items, logged_in:true});
    };   
});

// Renders user's shopping list
router.get('/shopping', async (req,res) => {

    // redirect to homepage if user not logged in
    if(!req.session.user) {
        res.redirect("/");
    } else {

        // select all sections associated with this user id
        const sectionData = await Section.findAll({
            where: {
                user_id: req.session.user.id
            },
            include: [{ model: Item }],
        });

        // map to new array to parse out required info from metadata
        const items = sectionData.map(items => items.get({plain:true}));

        // if req.session.user does not exist, logged_in is falsy
        res.render('shopping', {items: items, logged_in: req.session.user});
    };   
});

// Renders all user's sections to page
router.get('/summary', async (req,res) => {

    // redirect to homepage if user not logged in
    if(!req.session.user) {
        res.redirect("/");
    } else {

        // select all sections associated with this user id
        const sectionData = await Section.findAll({
            where: {
                user_id: req.session.user.id
            },
            include: [{ model: Item }],
        });

        // map to new array to parse out required info from metadata
        const items = sectionData.map(items => items.get({plain:true}));

        // if req.session.user does not exist, logged_in is falsy
        res.render('summary', {items: items, logged_in: req.session.user});
    };   
});

module.exports = router;