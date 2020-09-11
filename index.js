const cvs = document.getElementById('scenes');
const ctx = cvs.getContext('2d');
const scenes = {
	w: 500,
	h: 500
}
const ground = {
	x: 0,
	y: 470,
	w: 500,
	h: 30,
	color: 'black'
}
const platform = {
	x: 250,
	y: 380,
	w: 200,
	h: 20,
	color: 'black'
}
const hero = {
	x: 100,
	y: 300,
	w: 30,
	h: 50,
	color: 'red',
	xSpeed: 200,
	ySpeed: 0,
	gravity: 2000,
	onGround: false
}
const arr = [ground, platform, hero];
arr.forEach(item => {
	Object.defineProperty(item, 'center', {
		get() {
			return {
				x: this.x + this.w / 2,
				y: this.y + this.h / 2
			}
		}
	});
});

const keysDown = {};
addEventListener('keydown', function(e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener('keyup', function(e) {
	delete keysDown[e.keyCode];
}, false);

function handleCollision() {
	if (Math.abs(hero.center.y - ground.center.y) <= hero.h / 2 + ground.h / 2) {
		hero.y = ground.y - hero.h;
		hero.ySpeed = 0;
		hero.onGround = true;
	}
	if (Math.abs(hero.center.x - platform.center.x) <= hero.w / 2 + platform.w / 2 &&
			Math.abs(hero.center.y - platform.center.y) <= hero.h / 2 + platform.h / 2) {
		if (hero.y > platform.y) {
			hero.y = platform.y + platform.h;
			hero.ySpeed = 10;
		} else {
			hero.y = platform.y - hero.h;
			hero.ySpeed = 0;
			hero.onGround = true;
		}
	}
}

function renderRect({ x, y, w, h, color }) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function _update(modifier) {
	if (hero.y < ground.y - hero.h) {
		hero.onGround = false;
		hero.ySpeed += hero.gravity * modifier;
		hero.y += hero.ySpeed * modifier;
	}
	handleCollision();
	if(37 in keysDown) { // left
		if(hero.x <= 0) {
			hero.x -= 0;
		} else {
			hero.x -= hero.xSpeed * modifier;
		}
	}
	if(39 in keysDown) { // right
		if(hero.x >= scenes.w - hero.w) {
			hero.x += 0;
		} else {
			hero.x += hero.xSpeed * modifier;
		}
	}
	if(38 in keysDown) { // up
		if (hero.onGround) {
			hero.ySpeed = -600;
			hero.y += hero.ySpeed * modifier;
		}
	}
	ctx.clearRect(0, 0, scenes.w, scenes.h);
	renderRect(platform);
	renderRect(ground);
	renderRect(hero);
}

function update(then) {
	let now = Date.now();
	let delta = now - then;
	_update(delta / 1000);
	then = now;
	requestAnimationFrame(update.bind(null, then));
}

update(Date.now());
