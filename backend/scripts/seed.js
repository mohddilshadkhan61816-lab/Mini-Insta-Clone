const { db, initDatabase } = require('../database/db');
const bcrypt = require('bcryptjs');

const indianCelebrities = [
  { firstname: 'ShahRukh', lastname: 'Khan', username: 'iamsrk' },
  { firstname: 'Amitabh', lastname: 'Bachchan', username: 'amitabhbachchan' },
  { firstname: 'Akshay', lastname: 'Kumar', username: 'akshaykumar' },
  { firstname: 'Salman', lastname: 'Khan', username: 'beingsalmankhan' },
  { firstname: 'Aamir', lastname: 'Khan', username: 'aamir_khan' },
  { firstname: 'Priyanka', lastname: 'Chopra', username: 'priyankachopra' },
  { firstname: 'Deepika', lastname: 'Padukone', username: 'deepikapadukone' },
  { firstname: 'Ranveer', lastname: 'Singh', username: 'ranveersingh' },
  { firstname: 'Ranbir', lastname: 'Kapoor', username: 'ranbirkapoor' },
  { firstname: 'Alia', lastname: 'Bhatt', username: 'aliabhatt' },
  { firstname: 'Virat', lastname: 'Kohli', username: 'virat.kohli' },
  { firstname: 'Rohit', lastname: 'Sharma', username: 'rohitsharma45' },
  { firstname: 'MS', lastname: 'Dhoni', username: 'mahi7781' },
  { firstname: 'Hardik', lastname: 'Pandya', username: 'hardikpandya93' },
  { firstname: 'KL', lastname: 'Rahul', username: 'klrahul' }
];

const demoUsers = [
  { username: 'alice_wonder', email: 'alice@example.com', password: 'password123' },
  { username: 'bob_photographer', email: 'bob@example.com', password: 'password123' },
  { username: 'charlie_travel', email: 'charlie@example.com', password: 'password123' },
  { firstname: 'Diana', username: 'diana_fashion', email: 'diana@example.com', password: 'password123' },
  { firstname: 'Emma', username: 'emma_art', email: 'emma@example.com', password: 'password123' },
  { firstname: 'Frank', username: 'frank_foodie', email: 'frank@example.com', password: 'password123' },
  { firstname: 'Grace', username: 'grace_nature', email: 'grace@example.com', password: 'password123' },
  { firstname: 'Henry', username: 'henry_tech', email: 'henry@example.com', password: 'password123' }
];

const captions = [
  'Beautiful sunset today! 🌅',
  'Exploring new places ✈️',
  'Love this view! ❤️',
  'Living my best life 💫',
  'Adventure awaits 🗺️',
  'Nature is healing 🌿',
  'Making memories 📸',
  'Good vibes only ✨',
  'Coffee and good company ☕',
  'Weekend vibes 🎉',
  'Sunny days ahead ☀️',
  'Just another day in paradise 🌴',
  'Work hard, play harder 💪',
  'Food for the soul 🍕',
  'Creative minds think alike 🎨',
  'The journey is the destination 🛣️',
  'Dream big, work hard 💭',
  'Life is beautiful 💖',
  'Chasing dreams 🌙',
  'Simple pleasures 🍃',
  'On set! 🎬',
  'Behind the scenes 📷',
  'Thank you for all the love! 🙏',
  'New project coming soon! 🎥',
  'Grateful for this journey 🌟',
  'Team work makes the dream work 👥',
  'Living the dream ✨',
  'Blessed and grateful 🙌',
  'New beginnings 🌱',
  'Stay positive, stay strong 💪'
];

async function seedDatabase() {
  try {
    initDatabase();

    console.log('Clearing existing data...');
    db.exec('DELETE FROM comments');
    db.exec('DELETE FROM likes');
    db.exec('DELETE FROM follows');
    db.exec('DELETE FROM posts');
    db.exec('DELETE FROM users');

    console.log('Creating Indian celebrities...');
    const celebrityIds = [];

    for (const celeb of indianCelebrities) {
      const email = `${celeb.firstname.toLowerCase()}@gmail.com`;
      const password = `${celeb.firstname.toLowerCase()}@123`;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(
        celeb.username,
        email,
        hashedPassword
      );
      celebrityIds.push(result.lastInsertRowid);
      console.log(`Created celebrity: ${celeb.username} (${email} / ${password})`);
    }

    console.log('Creating demo users...');
    const userIds = [...celebrityIds];

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(
        userData.username,
        userData.email,
        hashedPassword
      );
      userIds.push(result.lastInsertRowid);
      console.log(`Created user: ${userData.username}`);
    }

    console.log('Creating posts for celebrities...');
    for (let i = 0; i < celebrityIds.length; i++) {
      const userId = celebrityIds[i];
      const numPosts = Math.floor(Math.random() * 8) + 5;

      for (let j = 0; j < numPosts; j++) {
        const imageId = Math.floor(Math.random() * 1000) + 1;
        const width = 600;
        const height = 600 + Math.floor(Math.random() * 200);
        const imageUrl = `https://picsum.photos/${width}/${height}?random=${imageId + i * 100 + j}`;
        const caption = captions[Math.floor(Math.random() * captions.length)];

        db.prepare('INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)').run(
          userId,
          imageUrl,
          caption
        );
      }
      console.log(`Created ${numPosts} posts for ${indianCelebrities[i].username}`);
    }

    console.log('Creating posts for demo users...');
    for (let i = 0; i < demoUsers.length; i++) {
      const userId = userIds[celebrityIds.length + i];
      const numPosts = Math.floor(Math.random() * 5) + 3;

      for (let j = 0; j < numPosts; j++) {
        const imageId = Math.floor(Math.random() * 1000) + 1;
        const width = 600;
        const height = 600 + Math.floor(Math.random() * 200);
        const imageUrl = `https://picsum.photos/${width}/${height}?random=${imageId + (celebrityIds.length + i) * 100 + j}`;
        const caption = captions[Math.floor(Math.random() * captions.length)];

        db.prepare('INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)').run(
          userId,
          imageUrl,
          caption
        );
      }
      console.log(`Created ${numPosts} posts for ${demoUsers[i].username}`);
    }

    console.log('Creating follow relationships...');
    for (let i = 0; i < userIds.length; i++) {
      const followerId = userIds[i];
      const numFollows = Math.floor(Math.random() * 5) + 3;

      const shuffled = [...userIds].filter(id => id !== followerId).sort(() => 0.5 - Math.random());
      const toFollow = shuffled.slice(0, numFollows);

      for (const followingId of toFollow) {
        try {
          db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').run(
            followerId,
            followingId
          );
        } catch (e) {
        }
      }
    }

    console.log('Creating some likes...');
    const allPosts = db.prepare('SELECT id, user_id FROM posts').all();
    for (const post of allPosts) {
      const numLikes = Math.floor(Math.random() * 50) + 10;
      const shuffled = [...userIds].filter(id => id !== post.user_id).sort(() => 0.5 - Math.random());
      const likers = shuffled.slice(0, Math.min(numLikes, shuffled.length));

      for (const userId of likers) {
        try {
          db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(userId, post.id);
        } catch (e) {
        }
      }
    }

    console.log('Creating some comments...');
    for (const post of allPosts.slice(0, Math.floor(allPosts.length * 0.8))) {
      const numComments = Math.floor(Math.random() * 8) + 2;
      const shuffled = [...userIds].filter(id => id !== post.user_id).sort(() => 0.5 - Math.random());
      const commenters = shuffled.slice(0, Math.min(numComments, shuffled.length));

      const commentTexts = [
        'Amazing! 😍',
        'Love this! ❤️',
        'So beautiful! ✨',
        'Incredible! 🌟',
        'Wow! 👏',
        'Perfect! 💯',
        'Stunning! 🤩',
        'Awesome! 🔥',
        'Fantastic work! 🎉',
        'You\'re the best! 🌟',
        'Inspiring! 💫',
        'Keep it up! 👌',
        'Brilliant! ✨',
        'So proud! 🙌'
      ];

      for (const userId of commenters) {
        const commentText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        db.prepare('INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)').run(
          userId,
          post.id,
          commentText
        );
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${userIds.length} users (${indianCelebrities.length} celebrities + ${demoUsers.length} demo users) with posts, follows, likes, and comments.`);
    console.log('\nIndian Celebrity Accounts:');
    indianCelebrities.forEach((celeb, idx) => {
      const email = `${celeb.firstname.toLowerCase()}@gmail.com`;
      const password = `${celeb.firstname.toLowerCase()}@123`;
      console.log(`  ${celeb.username}: Email: ${email}, Password: ${password}`);
    });
    console.log('\nDemo Accounts (password: password123):');
    demoUsers.forEach(user => {
      console.log(`  ${user.username}: ${user.email}`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
