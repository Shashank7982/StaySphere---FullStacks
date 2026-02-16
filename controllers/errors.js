exports.pageNotFound=(req,res,next)=>{
    res.render('404',{pageTitle:'page not found',currentPage:'errorPage',isLoggedIn:req.isLoggedIn,user:req.session.user});

}