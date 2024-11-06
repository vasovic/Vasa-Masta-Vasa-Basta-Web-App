import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema;

let User = new Schema({
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    korisnickoIme: {
        type: String,
        unique:true
    },
    lozinka: {
        type: String
    },
    tip: {
        type: String
    },
    pol: {
        type: String
    },
    adresa: {
        type: String
    },
    brojTelefona: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    brojKreditneKartice: {
        type: String
    },
    profilnaSlika: { 
        type: String
    },
    blokiran: {
        type: Number
    },
    firma: { 
        type: String
    }
})

User.pre('save',function(next){
    const user = this;
    if(!user.isModified('lozinka')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
      if(err) return next(err);
  
      bcrypt.hash(user.lozinka!,salt,function(err,hash){
        if(err) return next(err);
        user.lozinka = hash;
        next();
      })
    })
  })


export default mongoose.model('User', User, 'korisnici');