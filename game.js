let config={
    type:Phaser.AUTO,
    scale:{
        mode:Phaser.Scale.FIT,
        width:1200,
        height:600,
    },
    backgroundColor:0xffff11,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                y:1000,
            },
            debug:false,
        }
    },
    scene:{
         preload:preload,
         create:create,
         update:update,
     }
};
let game=new Phaser.Game(config);

let player_config={
    player_speed:150,
    player_jumpspeed:-600,
}
function preload(){
    this.load.image("ground","topground.png");
    this.load.image("sky","background.png");
    this.load.image("apple","apple.png");
    this.load.spritesheet("dude","dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("ray","ray.png")

}
function create(){
    W=game.config.width;
    H=game.config.height;
    let ground=this.add.tileSprite(0,H-128,W,128,"ground")
    ground.setOrigin(0,0);

    let background=this.add.sprite(0,0,"sky");
    background.setOrigin(0,0);

    background.displayWidth=W;
    background.displayHeight=H;
    background.depth=-2;

    rays=[];
    for(let i=-10;i<=10;i++){
        let ray=this.add.sprite(W/3,H-100,'ray');
        ray.displayHeight=2.1*H;
        ray.alpha=0.1;
        ray.angle=i*100;
        ray.depth=-1;
        rays.push(ray);
    }

    this.tweens.add({
        targets:rays,
        props:{
            angle:{
                value:"+=100",
            }
        },
        duration:6000,
        repeat:-1,
    });

    this.player=this.physics.add.sprite(100,100,"dude",4);
    this.player.setBounce(0.3);

    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        framerate:10,
        repeat:-1
    });
    this.anims.create({
        key:'centre',
        frames:[{key:'dude',frame:4}],
        framerate:10,
    });
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        framerate:10,
        repeat:-1
    });

    this.cursors=this.input.keyboard.createCursorKeys();

    let fruits=this.physics.add.group({
            key:"apple",
            repeat:8,
            setScale:{x:0.2,y:0.2},
            setXY:{x:10,y:0,stepX:100}
        });
    fruits.children.iterate(function (f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.6));
    })   
    
    let platforms=this.physics.add.staticGroup();
    platforms.create(500,350,'ground').setScale(2,0.5).refreshBody();
    platforms.create(700,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
    platforms.add(ground);


    this.physics.add.existing(ground)

    ground.body.allowGravity=false;
    ground.body.immovable=true;

    this.physics.add.collider(platforms,this.player);
    //this.physics.add.collider(ground,fruits);
    
    this.physics.add.collider(platforms,fruits);

    this.physics.add.overlap(this.player,fruits,eatFruit,null,this);

    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);

    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);

}
function update(){
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left',true);
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
         this.player.anims.play('right',true);
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play('centre');
    }
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jumpspeed);
    }
}
    
    function eatFruit(_player,fruit){
        fruit.disableBody(true,true);
    }

