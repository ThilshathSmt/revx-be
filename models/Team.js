const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName:{
        type:String,
        required: true,
        trim:true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User (likely HR) who created the department
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
})

teamSchema.pre('save',function (next){
    this.updatedAt = Date.now();
    next();
});

const Team=mongoose.model('Team',teamSchema);

module.exports =Team;