// CORE MODULES
const mongoose=require('mongoose');
const path = require('path');
const fs=require('fs');
// LOCAL MODULES
const Favourites = require('../models/favourites');
const Home=require('../models/home')
const rootDir=require('../utils/pathUtils');

exports.getAddHome=(req,res,next)=>{
    res.render('host/editHome',{pageTitle:'register here',currentPage:'addHome',editing:false,isLoggedIn:req.isLoggedIn,user:req.session.user}) ;
};

exports.postAddHome=(req,res,next)=>{
    const {houseName,location,price,rating,description}=req.body;
    if(!req.files['photo']||!req.files['rulesPdf']){
        console.log("no file uploaded");
        return res.redirect('/host/addHome');
    }
    const photoPath=req.files.photo ? req.files.photo[0].path : null;
    const rulesPdfPath=req.files.rulesPdf ? req.files.rulesPdf[0].path : null;
    const photo=path.join('/',photoPath);
    const rulesPdf=path.join('/',rulesPdfPath);
    const home=new Home({houseName,price,location,rating,photo,description,rulesPdf});
    home.save()
    .then(()=>{
        res.redirect('/host/hostHomeList');
    })
    .catch((err)=>{
        console.log("cant add home",err)
    });    
};

exports.getEditHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    const editing=req.query.editing==='true';
    Home.findById(homeId).then(home=>{
        if(!home){
            res.redirect('/host/hostHomeList')
        }
        else{
            res.render('host/editHome',{home:home,pageTitle:'edit home here',currentPage:'hostHomes',editing:editing,isLoggedIn:req.isLoggedIn,user:req.session.user}) ;
        }       
    })
};

exports.postEditHome=async (req,res,next)=>{
    const {houseName,location,price,rating,description,id}=req.body;
    Home.findById(id).then((home)=>{
        if(!home){
            console.log("home not found");
            return Promise.resolve();
        }
        home.houseName=houseName;
        home.price=price;
        home.location=location;
        home.rating=rating;   
        home.description=description;
        
        // Handle photo upload - only if a new photo is uploaded
        if(req.files && req.files.photo && req.files.photo[0]){
            // if new file is uploaded, then delete the old file
            const oldPath=path.join(rootDir,home.photo.replace('/uploads/', 'uploads/'));
            fs.unlink(oldPath,err=>{
                if(err){
                    console.log("error while deleting file",err);
                }
            })
            // if new file is uploaded, then update the photo path
            home.photo = '/uploads/images/' + req.files.photo[0].filename;
        }
        
        // Handle rulesPdf upload - only if a new PDF is uploaded
        if(req.files && req.files.rulesPdf && req.files.rulesPdf[0]){
            // if new file is uploaded, then delete the old file
            const oldPath=path.join(rootDir,home.rulesPdf.replace('/uploads/', 'uploads/'));
            fs.unlink(oldPath,err=>{
                if(err){
                    console.log("error while deleting file",err);
                }
            })
            // if new file is uploaded, then update the rulesPdf path
            home.rulesPdf = '/uploads/pdfs/' + req.files.rulesPdf[0].filename;
        }
        
        return home.save();
    }).then(()=>{
        console.log("Home updated");
    }).catch((err)=>{
        console.log("error while updating home",err);
    }).finally(()=>{
        res.redirect('/host/hostHomeList')
    })
};

exports.getHostHomes=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('host/hostHomeList',{registeredHomes:registeredHomes,pageTitle:'host homes list',currentPage:'hostHomes',isLoggedIn:req.isLoggedIn,user:req.session.user});
    });    
};

exports.postDeleteHome=async (req,res,next)=>{
    const homeId=req.params.homeId;
    const home=await Home.findById(homeId);
    const oldPath=path.join(rootDir,home.photo.replace('/uploads/', 'uploads/'));
            fs.unlink(oldPath,err=>{
                if(err){
                    console.log("error while deleting file",err);
                }
            })
    Home.findOneAndDelete({_id:homeId})
    .then(()=>{    
            console.log("Home deleted")
    })
    .catch((err)=>{
            console.log("cant delete from homes list",err)
    })
    .finally(()=>{
        res.redirect('/host/hostHomeList')
    })

    
  
}