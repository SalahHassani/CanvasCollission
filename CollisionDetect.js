// Particle Class
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;

    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      const otherParticle = particles[i];

      if (this === otherParticle) continue;

      if (
        distance(this.x, this.y, otherParticle.x, otherParticle.y) -
          this.radius * 2 <
        0
      ) {
        resolveCollision(this, otherParticle);
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.velocity.y = -this.velocity.y;
    }

    //mouse collision detection...
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < 150 &&
      this.opacity < 0.3
    ) {
      this.opacity += 0.05;
    } else if (this.opacity > 0) {
      this.opacity -= 0.03;

      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Resolve Collision Function
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );
    const m1 = particle.mass;
    const m2 = otherParticle.mass;
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);
    const v1 = {
      x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m2 - m1) + 2 * m1 * u1.x) / (m1 + m2),
      y: u2.y,
    };
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;
    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(particles);
  });
}

// Initialization
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const particles = [];
// const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
// const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c", "#f1c40f", "#e67e22"];
const colors = [
  "#4285F4",
  "#34A853",
  "#FBBC05",
  "#EA4335",
  "#6F2DBD",
  "#FF6D00",
  "#009688",
  "#795548",
];

for (let i = 0; i < 100; i++) {
  const radius = 30;
  const color = randomColor(colors);
  let x = randomIntFromRange(radius, canvas.width - radius);
  let y = randomIntFromRange(radius, canvas.height - radius);

  if (i !== 0) {
    for (let j = 0; j < particles.length; j++) {
      if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
        x = randomIntFromRange(radius, canvas.width - radius);
        y = randomIntFromRange(radius, canvas.height - radius);
        j = -1;
      }
    }
  }
  particles.push(new Particle(x, y, radius, color));
}

// Event Listeners
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(xDist * xDist + yDist * yDist);
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
  return rotatedVelocities;
}

animate();
