const Sequilize=require('sequelize');

const connection=new Sequilize('maindb','root','root',{
    host:'localhost',
    dialect:'mysql'
})

module.exports=connection;